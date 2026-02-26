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
} from '../../types/provider.types';

/**
 * Provider Repository
 * Uses Singleton PrismaService instance for database operations
 */
export class ProviderRepository {
    private prisma = PrismaService.getInstance();

    /**
     * Upsert provider profile
     * Creates new profile or updates existing one
     * 
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
     * 
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
     * 
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
     * 
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
     * 
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

    /**
     * Map Prisma provider profile to domain model
     */
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
