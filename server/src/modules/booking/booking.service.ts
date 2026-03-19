import { BookingRepository } from './booking.repository';
import { Booking, BookingStatus, CreateBookingDTO, BookingWithDetails } from '../../types/booking.types';
import { validateStatusTransition } from '../../utils/booking-status.util';
import { PrismaService } from '../../common/prisma.service';
import { SocketService } from '../../common/socket.service';
import { isServiceTimePassed } from '../../utils/date.util';

/**
 * Booking Service
 * Handles business logic for booking management
 * Implements state machine validation and access control
 * Follows Dependency Inversion Principle
 */
export class BookingService {
    private bookingRepository: BookingRepository;
    private prisma = PrismaService.getInstance();

    /**
     * Create a new BookingService instance
     * 
     * @param {BookingRepository} bookingRepository - Repository for data access
     */
    constructor(bookingRepository: BookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /**
     * Create a new booking for a vehicle service
     * Validates vehicle ownership and provider role before creation
     * 
     * @param {string} ownerId - The authenticated owner's user ID
     * @param {CreateBookingDTO} data - Booking data including vehicle and provider IDs
     * @returns {Promise<Booking>} The created booking
     * @throws {Error} If vehicle not owned by user or invalid provider
     */
    async createBooking(ownerId: string, data: CreateBookingDTO): Promise<Booking> {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id: data.vehicleId },
        });
        if (!vehicle || vehicle.ownerId !== ownerId) {
            throw new Error('Vehicle not found or not owned by you');
        }
        const provider = await this.prisma.user.findUnique({
            where: { id: data.providerId },
        });
        if (!provider || provider.role !== 'PROVIDER') {
            throw new Error('Invalid provider or user is not a provider');
        }

        if (isServiceTimePassed(data.serviceDate, data.timeSlot)) {
            throw new Error('Cannot book a timeslot that has already passed');
        }

        const booking = await this.bookingRepository.create(data);

        // Notify via Sockets
        SocketService.emit('booking_updated', { bookingId: booking.id, type: 'NEW_BOOKING' }, ownerId);
        SocketService.emit('booking_updated', { bookingId: booking.id, type: 'NEW_BOOKING' }, data.providerId);

        // Notify the provider about the new booking request
        try {
            await this.prisma.notification.create({
                data: {
                    userId: data.providerId,
                    title: 'New Booking Request',
                    message: `You have a new booking request for a ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate}).`,
                    bookingId: booking.id,
                },
            });
        } catch (notificationError) {
            // Non-critical: log but don't fail the booking creation
            console.error('Failed to create booking notification:', notificationError);
        }

        return booking;
    }

    /**
     * Get all bookings assigned to a provider
     * 
     * @param {string} providerId - The provider's user ID
     * @returns {Promise<BookingWithDetails[]>} Array of bookings with vehicle/owner details
     */
    async getProviderBookings(providerId: string): Promise<BookingWithDetails[]> {
        return this.bookingRepository.findByProvider(providerId);
    }

    /**
     * Get all bookings for an owner's vehicles
     * 
     * @param {string} ownerId - The owner's user ID
     * @returns {Promise<BookingWithDetails[]>} Array of bookings with provider details
     */
    async getOwnerBookings(ownerId: string): Promise<BookingWithDetails[]> {
        return this.bookingRepository.findByOwner(ownerId);
    }

    /**
     * Update booking status with state machine validation
     * Only the assigned provider can update status
     * 
     * @param {string} bookingId - The booking ID to update
     * @param {string} providerId - The requesting provider's user ID
     * @param {BookingStatus} newStatus - The target status
     * @returns {Promise<Booking>} The updated booking
     * @throws {Error} If booking not found, access denied, or invalid transition
     */
    async updateBookingStatus(
        bookingId: string, providerId: string, newStatus: BookingStatus
    ): Promise<Booking> {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) throw new Error('Booking not found');
        if (booking.providerId !== providerId) {
            throw new Error('Access denied. You are not assigned to this booking');
        }
        validateStatusTransition(booking.status, newStatus);
        const updated = await this.bookingRepository.updateStatus(bookingId, newStatus);

        // Notify the vehicle owner about the status change
        let rawBooking = null;
        try {
            rawBooking = await this.prisma.booking.findUnique({
                where: { id: bookingId },
                include: { vehicle: true },
            });
            if (rawBooking) {
                const statusLabels: Record<string, string> = {
                    ACCEPTED: 'accepted',
                    REJECTED: 'rejected',
                    IN_PROGRESS: 'started working on',
                    COMPLETED: 'completed',
                    CANCELLED: 'cancelled',
                };
                const statusLabel = statusLabels[newStatus] ?? newStatus.toLowerCase();
                await this.prisma.notification.create({
                    data: {
                        userId: rawBooking.vehicle.ownerId,
                        title: `Booking ${newStatus.charAt(0) + newStatus.slice(1).toLowerCase()}`,
                        message: `Your provider has ${statusLabel} the booking for your ${rawBooking.vehicle.make} ${rawBooking.vehicle.model}.`,
                        bookingId,
                    },
                });
            }
        } catch (notificationError) {
            // Non-critical: log but don't fail the status update
            console.error('Failed to create owner notification:', notificationError);
        }

        // Notify via Sockets
        if (rawBooking) {
            SocketService.emit('booking_updated', { bookingId, status: newStatus }, rawBooking.vehicle.ownerId);
            SocketService.emit('booking_updated', { bookingId, status: newStatus }, providerId);
        }

        return updated;
    }

    /**
     * Get a specific booking by ID with authorization check
     * 
     * @param {string} bookingId - The booking ID to retrieve
     * @param {string} userId - The requesting user's ID
     * @returns {Promise<BookingWithDetails | null>} The booking if authorized
     * @throws {Error} If authorized but booking not found, or if access denied
     */
    async getBookingById(bookingId: string, userId: string): Promise<BookingWithDetails | null> {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) return null;

        // Check ownership/assignment from the database via Prisma to be sure
        const rawBooking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: true }
        });

        if (!rawBooking) return null;

        const isOwner = rawBooking.vehicle.ownerId === userId;
        const isProvider = rawBooking.providerId === userId;

        if (!isOwner && !isProvider) {
            throw new Error('Access denied. You are not authorized to view this booking');
        }

        return booking;
    }

    /**
     * Update service record fields (mileage + note) for a completed booking
     * Only the assigned provider can update; booking must be COMPLETED
     *
     * @param {string} bookingId - The booking ID to update
     * @param {string} providerId - The requesting provider's user ID
     * @param {number} currentMileage - Vehicle mileage at time of service
     * @param {string|undefined} serviceNote - Work description
     * @returns {Promise<Booking>} The updated booking
     */
    async updateServiceRecord(
        bookingId: string, providerId: string, currentMileage: number, serviceNote?: string
    ): Promise<Booking> {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) throw new Error('Booking not found');
        if (booking.providerId !== providerId) {
            throw new Error('Access denied. You are not assigned to this booking');
        }
        if (booking.status !== BookingStatus.COMPLETED) {
            throw new Error('Service record can only be added to completed bookings');
        }
        if (!currentMileage || currentMileage <= 0) {
            throw new Error('Current mileage must be a positive number');
        }
        return this.bookingRepository.updateServiceRecord(bookingId, currentMileage, serviceNote);
    }
}
