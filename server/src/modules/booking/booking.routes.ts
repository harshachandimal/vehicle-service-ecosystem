import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth.middleware';
import { UserRole } from '../../types/user.types';
import {
    createBookingHandler,
    getProviderBookingsHandler,
    getOwnerBookingsHandler,
    updateStatusHandler,
} from './booking.controller';

/**
 * Booking Routes
 * Defines API endpoints for booking management
 * All routes require JWT authentication with role-based access control
 * 
 * @module bookingRoutes
 */
const bookingRoutes = Router();

/** Apply authentication middleware to all booking routes */
bookingRoutes.use(authenticate);

/**
 * POST /api/bookings
 * Create a new service booking
 * 
 * @access Owner only
 * @body {CreateBookingDTO} - vehicleId, providerId, description, serviceDate
 * @returns {Booking} Created booking object
 */
bookingRoutes.post('/', authorize([UserRole.OWNER]), createBookingHandler);

/**
 * GET /api/bookings/provider
 * Retrieve all bookings assigned to the authenticated provider
 * 
 * @access Provider only
 * @returns {BookingWithDetails[]} Array of bookings with vehicle and owner details
 */
bookingRoutes.get('/provider', authorize([UserRole.PROVIDER]), getProviderBookingsHandler);

/**
 * GET /api/bookings/owner
 * Retrieve all bookings for the authenticated owner's vehicles
 * 
 * @access Owner only
 * @returns {BookingWithDetails[]} Array of bookings with provider details
 */
bookingRoutes.get('/owner', authorize([UserRole.OWNER]), getOwnerBookingsHandler);

/**
 * PATCH /api/bookings/:id/status
 * Update booking status (state machine validated)
 * 
 * @access Provider only (must be assigned to booking)
 * @param {string} id - Booking ID
 * @body {UpdateStatusDTO} - New status value
 * @returns {Booking} Updated booking object
 */
bookingRoutes.patch('/:id/status', authorize([UserRole.PROVIDER]), updateStatusHandler);

export default bookingRoutes;
