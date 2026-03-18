import { InvoiceRepository } from './invoice.repository';
import { BookingRepository } from '../booking/booking.repository';
import { Invoice, CreateInvoiceDTO, InvoiceWithDetails, InvoiceStatus } from '../../types/invoice.types';
import { BookingStatus } from '../../types/booking.types';
import { PrismaService } from '../../common/prisma.service';
import { SocketService } from '../../common/socket.service';

/**
 * Invoice Service
 * Handles business logic for invoice management
 * Enforces strict business rules for invoice creation and access
 */
export class InvoiceService {
    private invoiceRepository: InvoiceRepository;
    private bookingRepository: BookingRepository;
    private prisma = PrismaService.getInstance();

    /**
     * @param {InvoiceRepository} invoiceRepository - Repository for invoice data access
     * @param {BookingRepository} bookingRepository - Repository for booking data access
     */
    constructor(invoiceRepository: InvoiceRepository, bookingRepository: BookingRepository) {
        this.invoiceRepository = invoiceRepository;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Create a new invoice for a completed booking
     */
    async createInvoice(providerId: string, data: CreateInvoiceDTO): Promise<Invoice> {
        const booking = await this.bookingRepository.findById(data.bookingId);
        if (!booking) throw new Error('Booking not found');

        if (booking.status !== BookingStatus.COMPLETED) {
            throw new Error('Invoice can only be created for completed bookings');
        }

        if (booking.providerId !== providerId) {
            throw new Error('Access denied. Not your booking');
        }

        const existingInvoice = await this.invoiceRepository.findByBookingId(data.bookingId);
        if (existingInvoice) throw new Error('Invoice already exists for this booking');

        const amount = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const invoice = await this.invoiceRepository.create({ ...data, amount });

        // Notify via Sockets
        const bookingData = await this.bookingRepository.findById(data.bookingId);
        if (bookingData) {
            const vehicle = await this.prisma.vehicle.findUnique({ where: { id: bookingData.vehicleId } });
            if (vehicle) {
                SocketService.emit('invoice_updated', { invoiceId: invoice.id, bookingId: data.bookingId }, vehicle.ownerId);
            }
            SocketService.emit('invoice_updated', { invoiceId: invoice.id, bookingId: data.bookingId }, providerId);
        }

        return invoice;
    }

    /**
     * Update an existing invoice
     */
    async updateInvoice(providerId: string, id: string, data: CreateInvoiceDTO): Promise<Invoice> {
        const invoice = await this.getInvoiceById(id);
        if (!invoice) throw new Error('Invoice not found');

        this.verifyInvoiceAccess(invoice, providerId, true);

        if (invoice.status !== InvoiceStatus.DRAFT) {
            throw new Error('Cannot edit a finalized invoice');
        }

        const amount = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const updated = await this.invoiceRepository.updateItems(id, data.items, amount);

        // Notify via Sockets
        const booking = await this.bookingRepository.findById(invoice.bookingId);
        if (booking) {
            const vehicle = await this.prisma.vehicle.findUnique({ where: { id: booking.vehicleId } });
            if (vehicle) SocketService.emit('invoice_updated', { invoiceId: id, bookingId: invoice.bookingId }, vehicle.ownerId);
            SocketService.emit('invoice_updated', { invoiceId: id, bookingId: invoice.bookingId }, providerId);
        }

        return updated;
    }

    /**
     * Finalize an invoice to prevent further editing
     */
    async finalizeInvoice(providerId: string, id: string): Promise<Invoice> {
        const invoice = await this.getInvoiceById(id);
        if (!invoice) throw new Error('Invoice not found');

        this.verifyInvoiceAccess(invoice, providerId, true);

        if (invoice.status !== InvoiceStatus.DRAFT) {
            throw new Error('Invoice is already finalized or paid');
        }

        const updated = await this.invoiceRepository.updateStatus(id, 'UNPAID' as any);

        // Notify via Sockets
        const booking = await this.bookingRepository.findById(invoice.bookingId);
        if (booking) {
            const vehicle = await this.prisma.vehicle.findUnique({ where: { id: booking.vehicleId } });
            if (vehicle) SocketService.emit('invoice_updated', { invoiceId: id, bookingId: invoice.bookingId }, vehicle.ownerId);
            SocketService.emit('invoice_updated', { invoiceId: id, bookingId: invoice.bookingId }, providerId);
        }

        return updated;
    }

    /**
     * Get invoices by user role
     */
    async getInvoicesByRole(userId: string, role: string): Promise<InvoiceWithDetails[]> {
        if (role === 'OWNER') {
            return this.invoiceRepository.findByOwner(userId);
        } else if (role === 'PROVIDER') {
            return this.invoiceRepository.findByProvider(userId);
        }
        return [];
    }

    /**
     * Get a single invoice by ID with access verification
     */
    async getValidatedInvoiceById(id: string, userId: string): Promise<InvoiceWithDetails> {
        const invoice = await this.invoiceRepository.findById(id);
        if (!invoice) throw new Error('Invoice not found');

        this.verifyInvoiceAccess(invoice, userId);
        return invoice;
    }

    /**
     * Get a single invoice by ID without verification (internal use)
     */
    async getInvoiceById(id: string): Promise<InvoiceWithDetails | null> {
        return this.invoiceRepository.findById(id);
    }

    /**
     * Get invoice by booking ID with access verification
     */
    async getValidatedInvoiceByBookingId(bookingId: string, userId: string): Promise<InvoiceWithDetails> {
        const invoice = await this.invoiceRepository.findByBookingId(bookingId);
        if (!invoice) throw new Error('Invoice not found');

        this.verifyInvoiceAccess(invoice, userId);
        return invoice;
    }

    /** Get invoice by booking ID without verification (internal use) */
    async getInvoiceByBookingId(bookingId: string): Promise<InvoiceWithDetails | null> {
        return this.invoiceRepository.findByBookingId(bookingId);
    }

    /** Pay an invoice - sets to PAYMENT_PENDING and notifies provider */
    async payInvoice(id: string, userId: string): Promise<Invoice> {
        const invoice = await this.getInvoiceById(id);
        if (!invoice) throw new Error('Invoice not found');

        // Verify that the person paying is the owner
        const isOwner = invoice.vehicle && userId === (invoice.vehicle as any).ownerId;
        if (!isOwner) throw new Error('Access denied. Only the vehicle owner can pay this invoice');

        if (invoice.status === InvoiceStatus.PAID) {
            throw new Error('Invoice is already paid');
        }

        const updated = await this.invoiceRepository.updateStatus(id, InvoiceStatus.PAYMENT_PENDING as any);

        // Notify via Sockets
        const booking = await this.prisma.booking.findUnique({
            where: { id: invoice.bookingId },
            include: { vehicle: true }
        });
        if (booking) {
            SocketService.emit('invoice_updated', { invoiceId: id, bookingId: invoice.bookingId }, booking.vehicle.ownerId);
            SocketService.emit('invoice_updated', { invoiceId: id, bookingId: invoice.bookingId }, booking.providerId);

            await this.prisma.notification.create({
                data: {
                    userId: booking.providerId,
                    title: 'Payment Confirmation Required',
                    message: `The owner has marked the invoice for ${booking.vehicle.make} ${booking.vehicle.model} (${booking.vehicle.licensePlate}) as paid. Please confirm receipt of payment.`,
                    bookingId: booking.id,
                },
            });
        }

        return updated;
    }

    /** Confirm payment - sets status to PAID (Provider only) */
    async confirmPayment(id: string, providerId: string): Promise<Invoice> {
        const invoice = await this.getInvoiceById(id);
        if (!invoice) throw new Error('Invoice not found');

        this.verifyInvoiceAccess(invoice, providerId, true);

        if (invoice.status !== InvoiceStatus.PAYMENT_PENDING) {
            throw new Error('Invoice must be in PAYMENT_PENDING status to be confirmed');
        }

        const updated = await this.invoiceRepository.updateStatus(id, InvoiceStatus.PAID as any);

        // Notify via Sockets
        const booking = await this.bookingRepository.findById(invoice.bookingId);
        if (booking) {
            const vehicle = await this.prisma.vehicle.findUnique({ where: { id: booking.vehicleId } });
            if (vehicle) SocketService.emit('invoice_updated', { invoiceId: id }, vehicle.ownerId);
            SocketService.emit('invoice_updated', { invoiceId: id }, booking.providerId);
        }

        return updated;
    }

    /**
     * Centralized access verification logic
     * @param invoice - The invoice to check
     * @param userId - The user ID to verify
     * @param providerOnly - If true, only the provider has access
     * @throws {Error} If access is denied
     */
    private verifyInvoiceAccess(invoice: InvoiceWithDetails, userId: string, providerOnly: boolean = false): void {
        const isProvider = invoice.booking && userId === (invoice.booking as any).providerId;
        const isOwner = invoice.vehicle && userId === (invoice.vehicle as any).ownerId;

        if (providerOnly) {
            if (!isProvider) throw new Error('Access denied. Only the provider can perform this action');
            return;
        }

        if (!isProvider && !isOwner) {
            throw new Error('Access denied. You are not authorized to view this invoice');
        }
    }
}
