/**
 * ProviderCard component
 * Displays a single service provider in the listing grid with photo and Visit button
 */

import { Star, MapPin, Wrench, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ProviderListItem } from '../../api/providers.api';

const SERVER = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

const BADGE_STYLES: Record<string, string> = {
    Authorized: 'bg-blue-100 text-blue-700 border border-blue-200',
    Premium: 'bg-amber-100 text-amber-700 border border-amber-200',
    New: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const CATEGORY_LABELS: Record<string, string> = {
    GARAGE: 'Auto Garage',
    CARRIER: 'Transport & Carrier',
    DETAILER: 'Detailing Studio',
};

interface Props { provider: ProviderListItem; }

/** Renders a styled card with provider photo, badge, stats, and Visit button */
export default function ProviderCard({ provider }: Props) {
    const navigate = useNavigate();
    const photoSrc = provider.photoUrl ? `${SERVER}${provider.photoUrl}` : null;

    return (
        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col">
            {/* Photo / banner */}
            <div className="relative h-40 overflow-hidden">
                {photoSrc ? (
                    <img src={photoSrc} alt={provider.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary" />
                )}
                {/* Overlay gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Badge */}
                <span className={`absolute bottom-3 left-4 text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE_STYLES[provider.badge]}`}>
                    {provider.badge}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-dark font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-0.5">
                    {provider.businessName}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{CATEGORY_LABELS[provider.category] ?? provider.category}</p>

                {/* Location */}
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                    <MapPin size={12} className="shrink-0 text-primary" />
                    <span className="truncate">{provider.city}, {provider.district}</span>
                </div>

                {provider.businessDescription && (
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-1">{provider.businessDescription}</p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto mb-3">
                    <div className="flex items-center gap-1">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-dark">{provider.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({provider.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Wrench size={12} />
                        <span>{provider.serviceCount} services</span>
                    </div>
                </div>

                {/* Visit button */}
                <button
                    onClick={() => navigate(`/providers/${provider.id}`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all duration-200 hover:shadow-md group/btn"
                >
                    Visit Profile
                    <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                </button>
            </div>
        </article>
    );
}
