/**
 * Services API module
 * Handles HTTP calls to the /api/services endpoint
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/** Filters for the public service listing */
export interface ServiceFilters {
    vehicleType?: string;
    location?: string;
    minRating?: number;
    maxPrice?: number;
    maxDuration?: number;
    search?: string;
}

/** Flattened service item returned from the listing endpoint */
export interface ServiceListItem {
    id: string;
    name: string;
    price: number;
    description?: string;
    vehicleType?: string;
    duration?: number;
    providerName: string;
    providerCity: string;
    providerDistrict: string;
    providerId: string;
    providerPhotoUrl?: string;
    rating: number;
    reviewCount: number;
}

/** Fetch services from the API with optional filters */
export async function getAvailableServices(
    filters: ServiceFilters = {}
): Promise<ServiceListItem[]> {
    const params = new URLSearchParams();
    if (filters.vehicleType && filters.vehicleType !== 'Any') params.set('vehicleType', filters.vehicleType);
    if (filters.location) params.set('location', filters.location);
    if (filters.minRating !== undefined) params.set('minRating', String(filters.minRating));
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters.maxDuration !== undefined) params.set('maxDuration', String(filters.maxDuration));
    if (filters.search) params.set('search', filters.search);

    const res = await fetch(`${API_BASE}/services?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
}
