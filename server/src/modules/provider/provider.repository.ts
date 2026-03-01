/**
 * Provider Repository Layer
 * Handles database operations for Provider Profile and Services
 * Implements the Repository Pattern for data access abstraction
 */

import { PrismaService } from '../../common/prisma.service';
import {
    ServiceCategory,
    UpdateProviderProfileDTO,
    CreateServiceItemDTO,
    ProviderDetailsResponse,
    ProviderFilterDTO,
    ProviderListItem,
    ProviderBadge,
} from '../../types/provider.types';

/**
 * Provider Repository
 * Uses Singleton PrismaService instance for database operations
 */
export class ProviderRepository {
    private prisma = PrismaService.getInstance();

    /**
     * Get all provider profiles with optional filters
     * @param {ProviderFilterDTO} filters - Optional filters (location, type, search)
     * @returns Promise with list of providers
     */
    async getAllProviders(filters: ProviderFilterDTO): Promise<ProviderListItem[]> {
        const where: Record<string, unknown> = {};

        if (filters.location) {
            where.OR = [
                { city: { contains: filters.location, mode: 'insensitive' } },
                { district: { contains: filters.location, mode: 'insensitive' } },
            ];
        }

        if (filters.search) {
            where.businessName = { contains: filters.search, mode: 'insensitive' };
        }

        if (filters.type === 'Authorized') {
            where.registrationNumber = { not: null };
        } else if (filters.type === 'New') {
            where.createdAt = { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
        }

        const profiles = await this.prisma.providerProfile.findMany({
            where,
            include: { services: true },
            orderBy: { createdAt: 'desc' },
        });

        let results = profiles.map((p) => this.mapToListItem(p));

        if (filters.minRating) {
            results = results.filter((r) => r.rating >= filters.minRating!);
        }

        if (filters.type === 'Premium') {
            results = results.filter((r) => r.badge === 'Premium');
        }

        return results;
    }

    /** Derive a display badge from profile data */
    private getBadge(profile: {
        registrationNumber?: string | null;
        services: unknown[];
        createdAt: Date;
    }): ProviderBadge {
        const ageMs = Date.now() - new Date(profile.createdAt).getTime();
        if (ageMs < 90 * 24 * 60 * 60 * 1000) return 'New';
        if (profile.registrationNumber) return 'Authorized';
        if (profile.services.length >= 5) return 'Premium';
        return 'New';
    }

    /** Map raw Prisma profile to ProviderListItem */
    private mapToListItem(profile: any): ProviderListItem {
        return {
            id: profile.id,
            businessName: profile.businessName,
            category: profile.category as ServiceCategory,
            city: profile.city,
            district: profile.district,
            businessDescription: profile.businessDescription ?? undefined,
            photoUrl: profile.photoUrl ?? undefined,
            badge: this.getBadge(profile),
            rating: 4.5,       // placeholder – no ratings table yet
            reviewCount: 12,   // placeholder
            serviceCount: profile.services.length,
        };
    }

    /**
     * Upsert provider profile
     * Creates new profile or updates existing one
     * @param {string} userId - The provider user ID
     * @param {UpdateProviderProfileDTO} data - Profile data to upsert
     * @returns Promise with created/updated profile
     */
    async upsertProfile(userId: string, data: UpdateProviderProfileDTO) {
        return await this.prisma.providerProfile.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                businessName: data.businessName!,
                category: data.category!,
                streetAddress: data.streetAddress ?? '',
                district: data.district ?? '',
                city: data.city ?? '',
                businessDescription: data.businessDescription,
                registrationNumber: data.registrationNumber,
            },
        });
    }

    /**
     * Add service item to provider's catalog
     * @param {string} profileId - Provider profile ID
     * @param {CreateServiceItemDTO} data - Service item data
     * @returns Promise with created service
     */
    async addServiceItem(profileId: string, data: CreateServiceItemDTO) {
        return await this.prisma.providerService.create({
            data: {
                profileId,
                name: data.name,
                price: data.price,
                description: data.description,
            },
        });
    }

    /**
     * Remove service item from catalog
     * @param {string} serviceId - Service ID to delete
     * @returns Promise with deleted service
     */
    async removeServiceItem(serviceId: string) {
        return await this.prisma.providerService.delete({
            where: { id: serviceId },
        });
    }

    /**
     * Get provider profile with all services by user ID
     * @param {string} userId - Provider user ID
     * @returns Promise with provider details or null
     */
    async getProfileWithServices(userId: string): Promise<ProviderDetailsResponse | null> {
        const profile = await this.prisma.providerProfile.findUnique({
            where: { userId },
            include: { services: true },
        });

        return profile ? this.mapToProviderDetails(profile) : null;
    }

    /**
     * Get provider profile by profile ID
     * @param {string} profileId - Provider profile ID
     * @returns Promise with provider details or null
     */
    async getProfileById(profileId: string): Promise<ProviderDetailsResponse | null> {
        const profile = await this.prisma.providerProfile.findUnique({
            where: { id: profileId },
            include: { services: true },
        });

        return profile ? this.mapToProviderDetails(profile) : null;
    }

    /** Map Prisma provider profile to domain model */
    private mapToProviderDetails(profile: any): ProviderDetailsResponse {
        const { services, ...profileData } = profile;

        return {
            profile: {
                ...profileData,
                category: profileData.category as ServiceCategory,
            },
            services: services.map((s: any) => ({
                ...s,
                price: parseFloat(s.price.toString()),
            })),
        };
    }
}
