/**
 * ServiceSidebar component
 * Filter panel for the Services listing page — vehicle type, duration, location, ratings
 */

import { Filter, RotateCcw } from 'lucide-react';
import type { ServiceFilters } from '../../api/services.api';
import { DISTRICTS } from '../../constants/locations';

const VEHICLE_TYPES = ['Any', 'Car', 'Van', 'Truck', 'SUV', 'Sports Car'] as const;
const RATINGS = [5, 4, 3] as const;

interface Props {
    filters: ServiceFilters;
    onChange: (filters: ServiceFilters) => void;
    resultCount?: number;
}

export default function ServiceSidebar({ filters, onChange, resultCount }: Props) {
    const set = <K extends keyof ServiceFilters>(key: K, value: ServiceFilters[K]) =>
        onChange({ ...filters, [key]: value });

    const reset = () => onChange({});

    return (
        <aside className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-5">
                <span className="flex items-center gap-2 font-bold text-dark text-sm">
                    <Filter size={15} className="text-primary" /> Filter
                </span>
                <button onClick={reset} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <RotateCcw size={11} /> Reset
                </button>
            </div>

            {/* Vehicle Type */}
            <section className="mb-5">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type of Vehicle</h4>
                <div className="flex flex-wrap gap-2">
                    {VEHICLE_TYPES.map((vt) => {
                        const active = (filters.vehicleType ?? 'Any') === vt;
                        return (
                            <button
                                key={vt}
                                onClick={() => set('vehicleType', vt === 'Any' ? undefined : vt)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${active
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {active && vt !== 'Any' ? '✓ ' : ''}{vt}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Estimated Duration */}
            <section className="mb-5">
                <div className="flex justify-between mb-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estimated Duration</h4>
                    <span className="text-xs text-gray-400">
                        {filters.maxDuration ? `≤ ${filters.maxDuration} min` : '> 1 hour'}
                    </span>
                </div>
                <input
                    type="range" min={10} max={120} step={10}
                    value={filters.maxDuration ?? 120}
                    onChange={(e) => set('maxDuration', Number(e.target.value) < 120 ? Number(e.target.value) : undefined)}
                    className="w-full accent-primary"
                />
            </section>

            {/* Location */}
            <section className="mb-5">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Location</h4>
                <select
                    value={filters.location ?? ''}
                    onChange={(e) => set('location', e.target.value || undefined)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="">All Locations</option>
                    {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
            </section>

            {/* Ratings */}
            <section className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ratings</h4>
                <div className="space-y-2">
                    {RATINGS.map((r) => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.minRating === r}
                                onChange={() => set('minRating', filters.minRating === r ? undefined : r)}
                                className="accent-primary"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                                {r === 5 ? '5 ★' : `${r} ★ & above`}
                            </span>
                        </label>
                    ))}
                </div>
            </section>

            <button
                onClick={() => { }}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all"
            >
                Show {resultCount !== undefined ? `(${resultCount})` : ''} Properties
            </button>
        </aside>
    );
}
