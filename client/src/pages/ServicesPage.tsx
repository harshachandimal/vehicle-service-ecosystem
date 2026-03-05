/**
 * ServicesPage
 * Public listing of all available services with sidebar filters and URL-synced state
 */

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getAvailableServices } from '../api/services.api';
import type { ServiceListItem, ServiceFilters } from '../api/services.api';
import ServiceCard from '../components/services/ServiceCard';
import ServiceSidebar from '../components/services/ServiceSidebar';

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-200" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded" />
            </div>
        </div>
    );
}

function qp(params: URLSearchParams, key: string): string | undefined {
    return params.get(key) ?? undefined;
}

export default function ServicesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [services, setServices] = useState<ServiceListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(qp(searchParams, 'search') ?? '');

    const filters: ServiceFilters = {
        vehicleType: qp(searchParams, 'vehicleType'),
        location: qp(searchParams, 'location'),
        minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        maxDuration: searchParams.get('maxDuration') ? Number(searchParams.get('maxDuration')) : undefined,
        search: qp(searchParams, 'search'),
    };

    const applyFilters = useCallback((next: ServiceFilters) => {
        const p = new URLSearchParams();
        if (next.vehicleType) p.set('vehicleType', next.vehicleType);
        if (next.location) p.set('location', next.location);
        if (next.minRating !== undefined) p.set('minRating', String(next.minRating));
        if (next.maxPrice !== undefined) p.set('maxPrice', String(next.maxPrice));
        if (next.maxDuration !== undefined) p.set('maxDuration', String(next.maxDuration));
        if (next.search) p.set('search', next.search);
        setSearchParams(p);
    }, [setSearchParams]);

    useEffect(() => {
        setLoading(true);
        getAvailableServices(filters)
            .then(setServices)
            .catch(() => setServices([]))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.toString()]);

    const handleSearch = () => applyFilters({ ...filters, search: searchInput || undefined });

    return (
        <div
            className="min-h-screen py-10 px-4"
            style={{
                backgroundImage: `url('/Gemini_Generated_Image_5k4jyd5k4jyd5k4j (1).png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* Overlay for readability */}
            <div className="min-h-screen bg-white/70 backdrop-blur-sm absolute inset-0 -z-10" />
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-white mb-1">Browse Services</h1>
                    <p className="text-white text-sm">Find and book auto services from verified professionals across Sri Lanka</p>
                </div>

                {/* Search bar */}
                <div className="flex gap-2 mb-8 max-w-2xl">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search for services..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm shadow-sm"
                    />
                    <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
                        <Search size={16} /> Search
                    </button>
                </div>

                <div className="flex gap-6 items-start">
                    {/* Sidebar */}
                    <div className="hidden md:block w-64 shrink-0 sticky top-24">
                        <ServiceSidebar filters={filters} onChange={applyFilters} resultCount={services.length} />
                    </div>

                    {/* Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : services.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-lg font-medium">No services found</p>
                                <p className="text-sm mt-1">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {services.map((s) => <ServiceCard key={s.id} service={s} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
