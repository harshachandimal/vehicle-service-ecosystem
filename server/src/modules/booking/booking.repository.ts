import { PrismaService } from '../../common/prisma.service';
import { Booking, BookingStatus, CreateBookingDTO, BookingWithDetails } from '../../types/booking.types';
import { BookingStatus as PrismaBookingStatus } from '@prisma/client';

/** Booking Repository - Handles database operations for Booking entities */
export class BookingRepository {
    private prisma = PrismaService.getInstance();

    /** @param {CreateBookingDTO} data - Booking data @returns {Promise<Booking>} Created booking */
    async create(data: CreateBookingDTO): Promise<Booking> {
        const booking = await this.prisma.booking.create({
            data: {
                vehicleId: data.vehicleId, providerId: data.providerId,
                description: data.description, serviceDate: new Date(data.serviceDate),
            },
        });
        return this.mapToBooking(booking);
    }

    /** @param {string} id - Booking ID @returns {Promise<BookingWithDetails|null>} Booking with details */
    async findById(id: string): Promise<BookingWithDetails | null> {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { vehicle: { include: { owner: true } }, provider: true },
        });
        return booking ? this.mapToBookingWithDetails(booking) : null;
    }

    /** @param {string} providerId @returns {Promise<BookingWithDetails[]>} Provider's bookings */
    async findByProvider(providerId: string): Promise<BookingWithDetails[]> {
        const bookings = await this.prisma.booking.findMany({
            where: { providerId },
            include: { vehicle: { include: { owner: true } }, provider: true },
            orderBy: { createdAt: 'desc' },
        });
        return bookings.map(b => this.mapToBookingWithDetails(b));
    }

    /** @param {string} ownerId @returns {Promise<BookingWithDetails[]>} Owner's bookings */
    async findByOwner(ownerId: string): Promise<BookingWithDetails[]> {
        const bookings = await this.prisma.booking.findMany({
            where: { vehicle: { ownerId } },
            include: { vehicle: { include: { owner: true } }, provider: true },
            orderBy: { createdAt: 'desc' },
        });
        return bookings.map(b => this.mapToBookingWithDetails(b));
    }

    /** @param {string} id @param {BookingStatus} status @returns {Promise<Booking>} Updated booking */
    async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
        const booking = await this.prisma.booking.update({
            where: { id },
            data: { status: status as PrismaBookingStatus },
        });
        return this.mapToBooking(booking);
    }

    private mapToBooking(b: any): Booking {
        return {
            id: b.id, vehicleId: b.vehicleId, providerId: b.providerId,
            description: b.description, serviceDate: b.serviceDate,
            status: b.status as BookingStatus, createdAt: b.createdAt, updatedAt: b.updatedAt,
        };
    }

    private mapToBookingWithDetails(b: any): BookingWithDetails {
        return {
            ...this.mapToBooking(b),
            vehicle: b.vehicle ? {
                make: b.vehicle.make, model: b.vehicle.model,
                licensePlate: b.vehicle.licensePlate, ownerName: b.vehicle.owner?.name,
            } : undefined,
            provider: b.provider ? { name: b.provider.name, email: b.provider.email } : undefined,
        };
    }
}
