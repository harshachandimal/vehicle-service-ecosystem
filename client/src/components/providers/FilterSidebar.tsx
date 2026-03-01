/**
 * FilterSidebar component
 * Collapsible sidebar with provider listing filters
 */

import { Filter } from 'lucide-react';
import type { ProviderFilters } from '../../api/providers.api';

const CITIES = [
    'Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna',
    'Kurunegala', 'Ratnapura', 'Badulla', 'Matara', 'Anuradhapura',
];

const PROVIDER_TYPES = ['Authorized', 'Premium', 'New'] as const;
const RATINGS = [4, 3, 2] as const;

interface Props {
    filters: ProviderFilters;
    onChange: (filters: ProviderFilters) => void;
}

/**
 * Sidebar panel with Type / Location / Rating filter controls
 */
export default function FilterSidebar({ filters, onChange }: Props) {
    const setFilter = <K extends keyof ProviderFilters>(key: K, value: ProviderFilters[K]) =>
        onChange({ ...filters, [key]: value });

    return (
        <aside className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-5 text-dark font-bold text-sm">
                <Filter size={16} className="text-primary" />
                Filters
            </div>

            {/* Type of Provider */}
            <section className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Provider Type</h4>
                <div className="flex flex-wrap gap-2">
                    {PROVIDER_TYPES.map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter('type', filters.type === t ? undefined : t)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${filters.type === t
                                ? 'bg-primary text-white border-primary'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </section>

            {/* Location */}
            <section className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Location</h4>
                <select
                    value={filters.location ?? ''}
                    onChange={(e) => setFilter('location', e.target.value || undefined)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="">All Cities</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </section>

            {/* Minimum Rating */}
            <section className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Minimum Rating</h4>
                <div className="space-y-2">
                    {RATINGS.map((r) => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer group/rating">
                            <input
                                type="checkbox"
                                checked={filters.minRating === r}
                                onChange={() => setFilter('minRating', filters.minRating === r ? undefined : r)}
                                className="accent-primary"
                            />
                            <span className="text-sm text-gray-600 group-hover/rating:text-primary transition-colors">
                                {r}+ Stars
                            </span>
                        </label>
                    ))}
                </div>
            </section>

        </aside>
    );
}
