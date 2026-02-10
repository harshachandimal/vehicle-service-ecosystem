import { Response } from 'express';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import { BookingService } from './booking.service';
import { BookingRepository } from './booking.repository';
import { CreateBookingDTO, UpdateStatusDTO } from '../../types/booking.types';

const bookingRepository = new BookingRepository();
const bookingService = new BookingService(bookingRepository);

/**
 * Create a new booking - POST /api/bookings (Owner only)
 * @param {AuthenticatedRequest} req @param {Response} res
 */
export async function createBookingHandler(
    req: AuthenticatedRequest, res: Response
): Promise<void> {
    try {
        const ownerId = req.user!.userId;
        const data: CreateBookingDTO = req.body;
        if (!data.vehicleId || !data.providerId || !data.description || !data.serviceDate) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const booking = await bookingService.createBooking(ownerId, data);
        res.status(201).json(booking);
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to create booking';
        res.status(400).json({ error: msg });
    }
}

/**
 * Get provider's bookings - GET /api/bookings/provider (Provider only)
 * @param {AuthenticatedRequest} req @param {Response} res
 */
export async function getProviderBookingsHandler(
    req: AuthenticatedRequest, res: Response
): Promise<void> {
    try {
        const providerId = req.user!.userId;
        const bookings = await bookingService.getProviderBookings(providerId);
        res.status(200).json(bookings);
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to fetch bookings';
        res.status(500).json({ error: msg });
    }
}

/**
 * Get owner's bookings - GET /api/bookings/owner (Owner only)
 * @param {AuthenticatedRequest} req @param {Response} res
 */
export async function getOwnerBookingsHandler(
    req: AuthenticatedRequest, res: Response
): Promise<void> {
    try {
        const ownerId = req.user!.userId;
        const bookings = await bookingService.getOwnerBookings(ownerId);
        res.status(200).json(bookings);
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to fetch bookings';
        res.status(500).json({ error: msg });
    }
}

/**
 * Update booking status - PATCH /api/bookings/:id/status (Provider only)
 * @param {AuthenticatedRequest} req @param {Response} res
 */
export async function updateStatusHandler(
    req: AuthenticatedRequest, res: Response
): Promise<void> {
    try {
        const providerId = req.user!.userId;
        const bookingId = req.params.id;
        const { status }: UpdateStatusDTO = req.body;
        if (!status) {
            res.status(400).json({ error: 'Status is required' });
            return;
        }
        const booking = await bookingService.updateBookingStatus(bookingId, providerId, status);
        res.status(200).json(booking);
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to update status';
        res.status(400).json({ error: msg });
    }
}
