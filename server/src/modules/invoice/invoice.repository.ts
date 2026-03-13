import { PrismaService } from '../../common/prisma.service';
import { Invoice, CreateInvoiceDTO, InvoiceStatus, InvoiceWithDetails } from '../../types/invoice.types';
import { InvoiceStatus as PrismaInvoiceStatus } from '@prisma/client';

/** Invoice Repository - Handles database operations for Invoice entities */
export class InvoiceRepository {
    private prisma = PrismaService.getInstance();

    /** @param {CreateInvoiceDTO & { amount: number }} data @returns {Promise<Invoice>} Created invoice */
    async create(data: CreateInvoiceDTO & { amount: number; status?: InvoiceStatus }): Promise<Invoice> {
        const invoice = await this.prisma.invoice.create({
            data: {
                bookingId: data.bookingId,
                amount: data.amount,
                status: (data.status || InvoiceStatus.DRAFT) as PrismaInvoiceStatus,
                items: data.items as any,
            },
        });
        return this.mapToInvoice(invoice);
    }

    /** @param {string} id @param {any} items @param {number} amount @returns {Promise<Invoice>} */
    async updateItems(id: string, items: any, amount: number): Promise<Invoice> {
        const invoice = await this.prisma.invoice.update({
            where: { id },
            data: { items, amount }
        });
        return this.mapToInvoice(invoice);
    }

    /** @param {string} id @returns {Promise<InvoiceWithDetails|null>} Invoice with details */
    async findById(id: string): Promise<InvoiceWithDetails | null> {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: {
                booking: {
                    include: { vehicle: true, provider: { include: { providerProfile: true } } },
                },
            },
        });
        return invoice ? this.mapToInvoiceWithDetails(invoice) : null;
    }

    /** @param {string} bookingId @returns {Promise<InvoiceWithDetails|null>} Invoice for booking */
    async findByBookingId(bookingId: string): Promise<InvoiceWithDetails | null> {
        const invoice = await this.prisma.invoice.findUnique({
            where: { bookingId },
            include: { booking: { include: { vehicle: true, provider: { include: { providerProfile: true } } } } },
        });
        return invoice ? this.mapToInvoiceWithDetails(invoice) : null;
    }

    /** @param {string} id @param {PrismaInvoiceStatus} status @returns {Promise<Invoice>} */
    async updateStatus(id: string, status: PrismaInvoiceStatus): Promise<Invoice> {
        const invoice = await this.prisma.invoice.update({ where: { id }, data: { status } });
        return this.mapToInvoice(invoice);
    }

    /** @param {string} ownerId @returns {Promise<InvoiceWithDetails[]>} Owner's invoices */
    async findByOwner(ownerId: string): Promise<InvoiceWithDetails[]> {
        const invoices = await this.prisma.invoice.findMany({
            where: { booking: { vehicle: { ownerId } } },
            include: {
                booking: {
                    include: { vehicle: true, provider: { include: { providerProfile: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return invoices.map(i => this.mapToInvoiceWithDetails(i));
    }

    /** @param {string} providerId @returns {Promise<InvoiceWithDetails[]>} Provider's invoices */
    async findByProvider(providerId: string): Promise<InvoiceWithDetails[]> {
        const invoices = await this.prisma.invoice.findMany({
            where: { booking: { providerId } },
            include: {
                booking: {
                    include: { vehicle: true, provider: { include: { providerProfile: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return invoices.map(i => this.mapToInvoiceWithDetails(i));
    }

    private mapToInvoice(i: any): Invoice {
        return {
            id: i.id, bookingId: i.bookingId, amount: Number(i.amount),
            status: i.status as InvoiceStatus, items: i.items,
            createdAt: i.createdAt, updatedAt: i.updatedAt,
        };
    }

    private mapToInvoiceWithDetails(i: any): InvoiceWithDetails {
        return {
            ...this.mapToInvoice(i),
            booking: i.booking ? {
                serviceDate: i.booking.serviceDate,
                description: i.booking.description,
                providerId: i.booking.providerId, // Include for access control
            } : undefined,
            vehicle: i.booking?.vehicle ? {
                make: i.booking.vehicle.make, model: i.booking.vehicle.model,
                licensePlate: i.booking.vehicle.licensePlate,
                ownerId: i.booking.vehicle.ownerId, // Include for access control
            } : undefined,
            provider: i.booking?.provider ? {
                name: i.booking.provider.name,
                businessName: i.booking.provider.providerProfile?.businessName,
            } : undefined,
        };
    }
}
