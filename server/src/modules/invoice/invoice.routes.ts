import { Router } from 'express';
import { InvoiceRepository } from './invoice.repository';
import { BookingRepository } from '../booking/booking.repository';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { authenticate, authorize, AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import { UserRole } from '../../types/user.types';

/**
 * Invoice Routes
 * Defines API endpoints for invoice management
 * All routes require JWT authentication with role-based access control
 * 
 * @module invoiceRoutes
 */
const invoiceRoutes = Router();

// Initialize dependencies
const invoiceRepository = new InvoiceRepository();
const bookingRepository = new BookingRepository();
const invoiceService = new InvoiceService(invoiceRepository, bookingRepository);
const invoiceController = new InvoiceController(invoiceService);

/** Apply authentication middleware to all invoice routes */
invoiceRoutes.use(authenticate);

/**
 * POST /api/invoices
 * Create a new invoice for a completed booking
 * 
 * @access Provider only
 * @body {CreateInvoiceDTO} - bookingId, items array
 * @returns {Invoice} Created invoice object
 */
invoiceRoutes.post(
    '/',
    authorize([UserRole.PROVIDER]),
    (req: AuthenticatedRequest, res) => invoiceController.createInvoice(req, res)
);

/**
 * GET /api/invoices
 * Retrieve all invoices for the authenticated user (role-based)
 * 
 * @access Owner or Provider
 * @returns {InvoiceWithDetails[]} Array of invoices with booking/vehicle/provider details
 */
invoiceRoutes.get(
    '/',
    (req: AuthenticatedRequest, res) => invoiceController.getMyInvoices(req, res)
);

/**
 * GET /api/invoices/:id
 * Retrieve a single invoice by ID
 * 
 * @access Owner or Provider (if related to the booking)
 * @param {string} id - Invoice ID
 * @returns {InvoiceWithDetails} Invoice with details
 */
invoiceRoutes.get(
    '/:id',
    (req: AuthenticatedRequest, res) => invoiceController.getInvoiceById(req, res)
);

export default invoiceRoutes;
