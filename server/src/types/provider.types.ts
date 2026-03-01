/**
 * Provider Profile and Service Domain Types
 */

/** Provider badge type used for UI display */
export type ProviderBadge = 'Authorized' | 'Premium' | 'New';

/** Query filters for listing providers */
export interface ProviderFilterDTO {
    location?: string;
    minRating?: number;
    type?: ProviderBadge;
    search?: string;
}

/** Lightweight provider item for listing pages */
export interface ProviderListItem {
    id: string;
    businessName: string;
    category: ServiceCategory;
    city: string;
    district: string;
    businessDescription?: string;
    photoUrl?: string;
    badge: ProviderBadge;
    rating: number;
    reviewCount: number;
    serviceCount: number;
}

/**
 * Service Categories for Provider Classification
 */
export enum ServiceCategory {
    GARAGE = 'GARAGE',
    CARRIER = 'CARRIER',
    DETAILER = 'DETAILER',
}


/**
 * Provider Profile Interface
 * Represents the business details of a service provider
 */
export interface ProviderProfile {
    id: string;
    userId: string;
    businessName: string;
    category: ServiceCategory;
    streetAddress: string;
    district: string;
    city: string;
    businessDescription?: string;
    registrationNumber?: string;
    photoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Provider Service Interface
 * Represents a specific service item in the provider's catalog
 */
export interface ProviderService {
    id: string;
    profileId: string;
    name: string;
    price: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * DTO for creating a new service item
 */
export interface CreateServiceItemDTO {
    name: string;
    price: number;
    description?: string;
}

/**
 * DTO for updating provider profile
 */
export interface UpdateProviderProfileDTO {
    businessName?: string;
    category?: ServiceCategory;
    streetAddress?: string;
    district?: string;
    city?: string;
    businessDescription?: string;
    registrationNumber?: string;
    photoUrl?: string;
}

/**
 * Response type for provider details with services
 */
export interface ProviderDetailsResponse {
    profile: ProviderProfile;
    services: ProviderService[];
}
