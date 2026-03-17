import api from './auth.api';

/** Filter parameters for the provider listing */
export interface ProviderFilters {
    location?: string;
    search?: string;
    type?: 'Authorized' | 'Premium' | 'New';
    minRating?: number;
}

/** Lightweight provider data returned from the listing endpoint */
export interface ProviderListItem {
    id: string;
    businessName: string;
    category: 'GARAGE' | 'CARRIER' | 'DETAILER' | 'TYRE_HOUSE';
    city: string;
    district: string;
    businessDescription?: string;
    photoUrl?: string;
    badge: 'Authorized' | 'Premium' | 'New';
    rating: number;
    reviewCount: number;
    serviceCount: number;
}

/** Full provider detail including services (used on the detail page) */
export interface ProviderDetail {
    profile: {
        id: string;
        businessName: string;
        category: 'GARAGE' | 'CARRIER' | 'DETAILER' | 'TYRE_HOUSE';
        city: string;
        district: string;
        streetAddress: string;
        businessDescription?: string;
        registrationNumber?: string;
        photoUrl?: string;
    };
    services: ProviderService[];
}

export interface ProviderService {
    id: string;
    name: string;
    price: number;
    description?: string;
    vehicleType?: string;
    duration?: number;
}

export interface CreateServiceDTO {
    name: string;
    price: number;
    description?: string;
    vehicleType?: string;
    duration?: number;
}

export interface UpdateServiceDTO extends Partial<CreateServiceDTO> {}

/**
 * Providers API module
 */
export const providersApi = {
    /**
     * Fetch providers from the API with optional filters
     */
    getAllProviders: async (filters: ProviderFilters = {}): Promise<ProviderListItem[]> => {
        const response = await api.get<ProviderListItem[]>('/api/providers', { params: filters });
        return response.data;
    },

    /**
     * Fetch a single provider's full detail by profile ID
     */
    getProviderById: async (id: string): Promise<ProviderDetail> => {
        const response = await api.get<ProviderDetail>(`/api/providers/${id}`);
        return response.data;
    },

    /**
     * Fetch the authenticated provider's own profile and services
     */
    getMyProfile: async (): Promise<ProviderDetail> => {
        const response = await api.get<ProviderDetail>('/api/providers/me');
        return response.data;
    },

    /**
     * Add a service to the provider's catalog
     */
    addService: async (data: CreateServiceDTO): Promise<ProviderService> => {
        const response = await api.post<ProviderService>('/api/providers/services', data);
        return response.data;
    },

    /**
     * Update an existing service item
     */
    updateService: async (id: string, data: UpdateServiceDTO): Promise<ProviderService> => {
        const response = await api.patch<ProviderService>(`/api/providers/services/${id}`, data);
        return response.data;
    },

    /**
     * Remove a service item from the catalog
     */
    deleteService: async (id: string): Promise<void> => {
        await api.delete(`/api/providers/services/${id}`);
    },
};

// Named exports for backward compatibility
export const getAllProviders = providersApi.getAllProviders;
export const getProviderById = providersApi.getProviderById;
