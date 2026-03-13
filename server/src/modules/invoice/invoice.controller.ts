import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';

/**
 * Invoice Controller
 * Handles HTTP requests for invoice management operations
 */
export class InvoiceController {
    private invoiceService: InvoiceService;

    /**
     * Create a new InvoiceController instance
     * 
     * @param {InvoiceService} invoiceService - Service for invoice business logic
     */
    constructor(invoiceService: InvoiceService) {
        this.invoiceService = invoiceService;
    }

    /**
     * Create a new invoice for a completed booking
     * POST /api/invoices
     * 
     * @route POST /
     * @access Provider only
     */
    async createInvoice(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const providerId = req.user!.userId;
            const { bookingId, items } = req.body;

            if (!bookingId || !items || !Array.isArray(items) || items.length === 0) {
                res.status(400).json({ error: 'Booking ID and items array are required' });
                return;
            }

            const invoice = await this.invoiceService.createInvoice(providerId, { bookingId, items });
            res.status(201).json(invoice);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Update a draft invoice
     * PUT /api/invoices/:id
     */
    async updateInvoice(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const providerId = req.user!.userId;
            const { id } = req.params;
            const { bookingId, items } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                res.status(400).json({ error: 'Items array is required' });
                return;
            }

            const invoice = await this.invoiceService.updateInvoice(providerId, id, { bookingId, items });
            res.status(200).json(invoice);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Finalize a draft invoice
     * PATCH /api/invoices/:id/finalize
     */
    async finalizeInvoice(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const providerId = req.user!.userId;
            const { id } = req.params;

            const invoice = await this.invoiceService.finalizeInvoice(providerId, id);
            res.status(200).json(invoice);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Get a single invoice by ID
     * GET /api/invoices/:id
     * 
     * @route GET /:id
     * @access Owner or Provider (if related to the booking)
     */
    async getInvoiceById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            const invoice = await this.invoiceService.getInvoiceById(id);
            if (!invoice) {
                res.status(404).json({ error: 'Invoice not found' });
                return;
            }

            // Verify access: user must be the provider or the owner
            const isProvider = invoice.booking && userId === (invoice.booking as any).providerId;
            const isOwner = invoice.vehicle && userId === (invoice.vehicle as any).ownerId;

            if (!isProvider && !isOwner) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }

            res.status(200).json(invoice);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Get invoice by booking ID
     * GET /api/invoices/booking/:bookingId
     */
    async getInvoiceByBookingId(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { bookingId } = req.params;
            const userId = req.user!.userId;

            const invoice = await this.invoiceService.getInvoiceByBookingId(bookingId);
            if (!invoice) {
                res.status(404).json({ error: 'Invoice not found' });
                return;
            }

            const isProvider = invoice.booking && userId === (invoice.booking as any).providerId;
            const isOwner = invoice.vehicle && userId === (invoice.vehicle as any).ownerId;

            if (!isProvider && !isOwner) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }

            res.status(200).json(invoice);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Pay an invoice
     * PATCH /api/invoices/:id/pay
     */
    async payInvoice(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const invoice = await this.invoiceService.payInvoice(id);
            res.status(200).json(invoice);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Get all invoices for the authenticated user
     * Smart handler that returns owner's or provider's invoices based on role
     * GET /api/invoices
     * 
     * @route GET /
     * @access Owner or Provider
     */
    async getMyInvoices(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const role = req.user!.role;

            const invoices = await this.invoiceService.getInvoicesByRole(userId, role);
            res.status(200).json(invoices);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
