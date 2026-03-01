/**
 * ProvidersPage
 * Full listing page for service providers with sidebar filters and search
 */

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getAllProviders } from '../api/providers.api';
import type { ProviderListItem, ProviderFilters } from '../api/providers.api';
import ProviderCard from '../components/providers/ProviderCard';
import FilterSidebar from '../components/providers/FilterSidebar';

/** Skeleton card shown while data is loading */
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-24 bg-gray-200" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded" />
            </div>
        </div>
    );
}

/** Helper: read a URLSearchParams key or return undefined */
function qp(params: URLSearchParams, key: string): string | undefined {
    return params.get(key) ?? undefined;
}

/**
 * Provider listing page with sidebar filter panel and URL-synced state
 */
export default function ProvidersPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [providers, setProviders] = useState<ProviderListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(qp(searchParams, 'search') ?? '');

    const filters: ProviderFilters = {
        location: qp(searchParams, 'location'),
        search: qp(searchParams, 'search'),
        type: qp(searchParams, 'type') as ProviderFilters['type'],
        minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    };

    const applyFilters = useCallback((newFilters: ProviderFilters) => {
        const p = new URLSearchParams();
        if (newFilters.location) p.set('location', newFilters.location);
        if (newFilters.search) p.set('search', newFilters.search);
        if (newFilters.type) p.set('type', newFilters.type);
        if (newFilters.minRating !== undefined) p.set('minRating', String(newFilters.minRating));
        setSearchParams(p);
    }, [setSearchParams]);

    useEffect(() => {
        setLoading(true);
        getAllProviders(filters)
            .then(setProviders)
            .catch(() => setProviders([]))
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
            <div className="max-w-7xl mx-auto relative">
                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white mb-1">Find a Service Provider</h1>
                    <p className="text-white text-sm">Discover verified auto-service professionals across Sri Lanka</p>
                </div>

                {/* Search bar */}
                <div className="flex gap-2 mb-8 max-w-2xl">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search by business name…"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    />
                    <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
                        <Search size={16} /> Search
                    </button>
                </div>

                <div className="flex gap-6 items-start">
                    {/* Sidebar */}
                    <div className="hidden md:block w-64 shrink-0">
                        <FilterSidebar filters={filters} onChange={applyFilters} />
                    </div>

                    {/* Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : providers.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-lg font-medium">No providers found</p>
                                <p className="text-sm mt-1">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {providers.map((p) => <ProviderCard key={p.id} provider={p} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
