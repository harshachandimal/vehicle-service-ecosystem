import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';

/**
 * Invoice Controller
 * Handles HTTP requests for invoice management operations
 */
export class InvoiceController {
    /**
     * @param {InvoiceService} invoiceService - Service for invoice business logic
     */
    constructor(private invoiceService: InvoiceService) {}

    /**
     * Create a new invoice for a completed booking
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
            this.handleError(res, error);
        }
    }

    /**
     * Update a draft invoice
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
            this.handleError(res, error);
        }
    }

    /**
     * Finalize a draft invoice
     */
    async finalizeInvoice(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const providerId = req.user!.userId;
            const { id } = req.params;

            const invoice = await this.invoiceService.finalizeInvoice(providerId, id);
            res.status(200).json(invoice);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    /**
     * Get a single invoice by ID
     */
    async getInvoiceById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            const invoice = await this.invoiceService.getValidatedInvoiceById(id, userId);
            res.status(200).json(invoice);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    /**
     * Get invoice by booking ID
     */
    async getInvoiceByBookingId(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { bookingId } = req.params;
            const userId = req.user!.userId;

            const invoice = await this.invoiceService.getValidatedInvoiceByBookingId(bookingId, userId);
            res.status(200).json(invoice);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    /**
     * Pay an invoice
     */
    async payInvoice(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            const invoice = await this.invoiceService.payInvoice(id, userId);
            res.status(200).json(invoice);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    /**
     * Get all invoices for the authenticated user
     */
    async getMyInvoices(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const role = req.user!.role;

            const invoices = await this.invoiceService.getInvoicesByRole(userId, role);
            res.status(200).json(invoices);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    /**
     * Centralized error handling
     */
    private handleError(res: Response, error: any): void {
        const message = error.message || 'An unexpected error occurred';
        let status = 400;

        if (message.includes('Access denied') || message.includes('authorized')) {
            status = 403;
        } else if (message.includes('not found')) {
            status = 404;
        }

        res.status(status).json({ error: message });
    }
}
