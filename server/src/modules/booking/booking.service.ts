import { BookingRepository } from './booking.repository';
import { Booking, BookingStatus, CreateBookingDTO, BookingWithDetails } from '../../types/booking.types';
import { validateStatusTransition } from '../../utils/booking-status.util';
import { PrismaService } from '../../common/prisma.service';

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
        return this.bookingRepository.create(data);
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
        return this.bookingRepository.updateStatus(bookingId, newStatus);
    }
}
