import { InvoiceRepository } from './invoice.repository';
import { BookingRepository } from '../booking/booking.repository';
import { Invoice, CreateInvoiceDTO, InvoiceWithDetails, InvoiceStatus } from '../../types/invoice.types';
import { BookingStatus } from '../../types/booking.types';

/**
 * Invoice Service
 * Handles business logic for invoice management
 * Enforces strict business rules for invoice creation and access
 */
export class InvoiceService {
    private invoiceRepository: InvoiceRepository;
    private bookingRepository: BookingRepository;

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
        return this.invoiceRepository.create({ ...data, amount });
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
        return this.invoiceRepository.updateItems(id, data.items, amount);
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

        return this.invoiceRepository.updateStatus(id, 'UNPAID' as any);
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

    /** Pay an invoice */
    async payInvoice(id: string, userId: string): Promise<Invoice> {
        const invoice = await this.getInvoiceById(id);
        if (!invoice) throw new Error('Invoice not found');

        // Verify that the person paying is the owner
        const isOwner = invoice.vehicle && userId === (invoice.vehicle as any).ownerId;
        if (!isOwner) throw new Error('Access denied. Only the vehicle owner can pay this invoice');

        return this.invoiceRepository.updateStatus(id, 'PAID' as any);
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
