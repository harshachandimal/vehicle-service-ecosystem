/**
 * Providers API module
 * Handles HTTP calls to the /api/providers endpoint
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

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
    services: { id: string; name: string; price: number; description?: string }[];
}

/**
 * Fetch providers from the API with optional filters
 */
export async function getAllProviders(filters: ProviderFilters = {}): Promise<ProviderListItem[]> {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.search) params.set('search', filters.search);
    if (filters.type) params.set('type', filters.type);
    if (filters.minRating !== undefined) params.set('minRating', String(filters.minRating));

    const res = await fetch(`${API_BASE}/providers?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch providers');
    return res.json();
}

/**
 * Fetch a single provider's full detail by profile ID
 */
export async function getProviderById(id: string): Promise<ProviderDetail> {
    const res = await fetch(`${API_BASE}/providers/${id}`);
    if (!res.ok) throw new Error('Provider not found');
    return res.json();
}
