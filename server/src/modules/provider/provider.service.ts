/**
 * Provider Service Layer
 * Business logic for Provider Profile and Service Management
 * Implements Dependency Inversion Principle by receiving repository via constructor
 */

import {
    UpdateProviderProfileDTO,
    CreateServiceItemDTO,
    UpdateServiceItemDTO,
    ProviderDetailsResponse,
    ProviderFilterDTO,
    ProviderListItem,
    ServiceFilterDTO,
    ServiceListItem,
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
     * Get all providers with optional filters
     *
     * @param {ProviderFilterDTO} filters - Filter criteria
     * @returns Promise with list of provider list items
     */
    async getAllProviders(filters: ProviderFilterDTO): Promise<ProviderListItem[]> {
        return await this.providerRepository.getAllProviders(filters);
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
        if (data.businessName || data.category || data.streetAddress || data.district || data.city) {
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
     * @param {string} userId - Provider user ID (for ownership check)
     * @param {string} serviceId - Service ID to remove
     * @returns Promise with deleted service
     */
    async removeServiceFromMenu(userId: string, serviceId: string) {
        await this.checkServiceOwnership(userId, serviceId);
        return await this.providerRepository.removeServiceItem(serviceId);
    }

    /**
     * Update service in provider's menu
     * 
     * @param {string} userId - Provider user ID (for ownership check)
     * @param {string} serviceId - Service ID to update
     * @param {UpdateServiceItemDTO} data - Service item data to update
     * @returns Promise with updated service
     */
    async updateServiceInMenu(userId: string, serviceId: string, data: UpdateServiceItemDTO) {
        await this.checkServiceOwnership(userId, serviceId);
        
        // Validate service data if provided
        if (data.price !== undefined && data.price < 0) {
            throw new Error('Price cannot be negative.');
        }

        return await this.providerRepository.updateServiceItem(serviceId, data);
    }

    /**
     * Helper to verify if a service belongs to a provider
     * 
     * @param {string} userId - Provider user ID
     * @param {string} serviceId - Service ID
     * @throws {Error} if ownership not verified
     */
    private async checkServiceOwnership(userId: string, serviceId: string) {
        const service = await this.providerRepository.findServiceById(serviceId);
        
        if (!service) {
            throw new Error('Service not found.');
        }

        if (service.profile.userId !== userId) {
            throw new Error('You do not have permission to modify this service.');
        }
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

    /**
     * Get all available services with optional filters
     *
     * @param {ServiceFilterDTO} filters - Filter criteria
     * @returns Promise with list of service items
     */
    async getAvailableServices(filters: ServiceFilterDTO): Promise<ServiceListItem[]> {
        return await this.providerRepository.getAvailableServices(filters);
    }

    /**
     * Get a specific service by ID
     * @param {string} serviceId - Service ID
     * @returns Promise with service item or null
     */
    async getServiceById(serviceId: string): Promise<ServiceListItem | null> {
        return await this.providerRepository.getServiceById(serviceId);
    }
}
