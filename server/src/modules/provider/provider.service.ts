/**
 * Provider Service Layer
 * Business logic for Provider Profile and Service Management
 * Implements Dependency Inversion Principle by receiving repository via constructor
 */

import {
    UpdateProviderProfileDTO,
    CreateServiceItemDTO,
    ProviderDetailsResponse,
} from '../../types/provider.types';
import { ProviderRepository } from './provider.repository';

/**
 * Provider Service
 * Handles business logic and validation for provider operations
 */
export class ProviderService {
    private providerRepository: ProviderRepository;

    /**
     * Create a new ProviderService instance
     * 
     * @param {ProviderRepository} providerRepository - Repository for data access
     */
    constructor(providerRepository: ProviderRepository) {
        this.providerRepository = providerRepository;
    }

    /**
     * Update provider profile
     * Creates or updates business details
     * 
     * @param {string} userId - Provider user ID
     * @param {UpdateProviderProfileDTO} data - Profile data to update
     * @returns Promise with updated profile
     * @throws {Error} If validation fails
     */
    async updateProfile(userId: string, data: UpdateProviderProfileDTO) {
        // Validate required fields for new profiles
        if (data.businessName || data.category || data.phone || data.address) {
            return await this.providerRepository.upsertProfile(userId, data);
        }

        throw new Error('At least one field must be provided for update');
    }

    /**
     * Add service item to provider's menu
     * 
     * @param {string} userId - Provider user ID
     * @param {CreateServiceItemDTO} data - Service item data
     * @returns Promise with created service
     * @throws {Error} If profile doesn't exist or validation fails
     */
    async addServiceToMenu(userId: string, data: CreateServiceItemDTO) {
        // Get provider's profile
        const providerDetails = await this.providerRepository.getProfileWithServices(userId);

        if (!providerDetails) {
            throw new Error('Provider profile not found. Create profile first.');
        }

        // Validate service data
        if (!data.name || data.price === undefined || data.price < 0) {
            throw new Error('Invalid service data. Name and non-negative price required.');
        }

        return await this.providerRepository.addServiceItem(providerDetails.profile.id, data);
    }

    /**
     * Remove service from provider's menu
     * 
     * @param {string} serviceId - Service ID to remove
     * @returns Promise with deleted service
     */
    async removeServiceFromMenu(serviceId: string) {
        return await this.providerRepository.removeServiceItem(serviceId);
    }

    /**
     * Get provider details with full service menu by user ID
     * 
     * @param {string} userId - Provider user ID
     * @returns Promise with provider details or null
     */
    async getProviderDetails(userId: string): Promise<ProviderDetailsResponse | null> {
        return await this.providerRepository.getProfileWithServices(userId);
    }

    /**
     * Get provider details by profile ID (public access)
     * 
     * @param {string} profileId - Provider profile ID
     * @returns Promise with provider details or null
     */
    async getProviderDetailsById(profileId: string): Promise<ProviderDetailsResponse | null> {
        return await this.providerRepository.getProfileById(profileId);
    }
}
