import { InvoiceRepository } from './invoice.repository';
import { BookingRepository } from '../booking/booking.repository';
import { Invoice, CreateInvoiceDTO, InvoiceWithDetails, InvoiceStatus } from '../../types/invoice.types';
import { BookingStatus } from '../../types/booking.types';

/**
 * Invoice Service
 * Handles business logic for invoice management
 * Enforces strict business rules for invoice creation
 */
export class InvoiceService {
    private invoiceRepository: InvoiceRepository;
    private bookingRepository: BookingRepository;

    /**
     * Create a new InvoiceService instance
     * 
     * @param {InvoiceRepository} invoiceRepository - Repository for invoice data access
     * @param {BookingRepository} bookingRepository - Repository for booking data access
     */
    constructor(invoiceRepository: InvoiceRepository, bookingRepository: BookingRepository) {
        this.invoiceRepository = invoiceRepository;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Create a new invoice for a completed booking
     * Validates booking status, provider ownership, and prevents double billing
     * 
     * @param {string} providerId - The authenticated provider's user ID
     * @param {CreateInvoiceDTO} data - Invoice data including booking ID and items
     * @returns {Promise<Invoice>} The created invoice
     * @throws {Error} If booking not found, not completed, access denied, or already invoiced
     */
    async createInvoice(providerId: string, data: CreateInvoiceDTO): Promise<Invoice> {
        // Fetch the booking with details
        const booking = await this.bookingRepository.findById(data.bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        // CRITICAL VALIDATION #1: Verify booking status is COMPLETED
        if (booking.status !== BookingStatus.COMPLETED) {
            throw new Error('Invoice can only be created for completed bookings');
        }

        // CRITICAL VALIDATION #2: Verify provider ownership
        if (booking.providerId !== providerId) {
            throw new Error('Access denied. Not your booking');
        }

        // CRITICAL VALIDATION #3: Check for existing invoice (prevent double billing)
        const existingInvoice = await this.invoiceRepository.findByBookingId(data.bookingId);
        if (existingInvoice) {
            throw new Error('Invoice already exists for this booking');
        }

        // Calculate total amount from items
        const amount = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create the invoice
        return this.invoiceRepository.create({ ...data, amount });
    }

    /**
     * Update an existing invoice
     */
    async updateInvoice(providerId: string, id: string, data: CreateInvoiceDTO): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findById(id);
        if (!invoice) throw new Error('Invoice not found');

        if (invoice.booking?.providerId !== providerId) {
            throw new Error('Access denied. Not your invoice');
        }

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
        const invoice = await this.invoiceRepository.findById(id);
        if (!invoice) throw new Error('Invoice not found');

        if (invoice.booking?.providerId !== providerId) {
            throw new Error('Access denied. Not your invoice');
        }

        if (invoice.status !== InvoiceStatus.DRAFT) {
            throw new Error('Invoice is already finalized or paid');
        }

        return this.invoiceRepository.updateStatus(id, 'UNPAID' as any);
    }

    /**
     * Get invoices by user role
     * Smart dispatcher that calls appropriate repository method based on role
     * 
     * @param {string} userId - The user's ID
     * @param {string} role - The user's role (OWNER or PROVIDER)
     * @returns {Promise<InvoiceWithDetails[]>} Array of invoices
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
     * Get a single invoice by ID
     * 
     * @param {string} id - The invoice ID
     * @returns {Promise<InvoiceWithDetails|null>} Invoice with details or null
     */
    async getInvoiceById(id: string): Promise<InvoiceWithDetails | null> {
        return this.invoiceRepository.findById(id);
    }

    /** Get invoice by booking ID */
    async getInvoiceByBookingId(bookingId: string): Promise<InvoiceWithDetails | null> {
        return this.invoiceRepository.findByBookingId(bookingId);
    }

    /** Pay an invoice */
    async payInvoice(id: string): Promise<Invoice> {
        return this.invoiceRepository.updateStatus(id, 'PAID' as any);
    }
}
