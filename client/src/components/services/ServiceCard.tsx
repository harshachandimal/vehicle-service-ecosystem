/**
 * ServiceCard component
 * Displays a single service item with provider info, duration, rating, price, and Book Now CTA
 */

import { Clock, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ServiceListItem } from '../../api/services.api';

const SERVER = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

/** Category-based gradient colours used as fallback when no provider photo exists */
const GRADIENTS: Record<string, string> = {
    'Mechanical Repair': 'from-slate-700 to-blue-900',
    'Body Washing': 'from-teal-700 to-cyan-800',
    'Tyre Services': 'from-zinc-700 to-stone-900',
    'Nano Coating': 'from-indigo-700 to-purple-900',
    'Oil Change': 'from-amber-700 to-orange-900',
    'Wheel Alignment': 'from-emerald-700 to-green-900',
};
const DEFAULT_GRADIENT = 'from-primary to-blue-900';

interface Props { service: ServiceListItem; }

export default function ServiceCard({ service }: Props) {
    const navigate = useNavigate();
    const grad = GRADIENTS[service.name] ?? DEFAULT_GRADIENT;
    const photoSrc = service.providerPhotoUrl ? `${SERVER}${service.providerPhotoUrl}` : null;

    return (
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
            {/* Category image banner – uses provider photo if available, falls back to gradient */}
            <div className="h-40 relative flex items-center justify-center overflow-hidden">
                {photoSrc ? (
                    <img
                        src={photoSrc}
                        alt={service.providerName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${grad} flex items-center justify-center`}>
                        <span className="text-white/20 text-7xl font-black select-none tracking-tighter">
                            {service.name.charAt(0)}
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {service.vehicleType && (
                    <span className="absolute bottom-3 left-4 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
                        {service.vehicleType}
                    </span>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                {/* Title & provider */}
                <h3 className="font-bold text-dark text-base leading-tight mb-0.5 line-clamp-1">{service.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <span className="font-medium">{service.providerName}</span>
                    <span>•</span>
                    <MapPin size={11} className="text-primary shrink-0" />
                    <span>{service.providerCity}</span>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    {service.duration && (
                        <span className="flex items-center gap-1">
                            <Clock size={12} className="text-primary" />
                            {service.duration >= 60
                                ? `${Math.floor(service.duration / 60)}h${service.duration % 60 ? ` ${service.duration % 60}min` : ''}`
                                : `${service.duration} min`}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        {service.rating.toFixed(1)} / 5
                    </span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Customer Reviews Count ({service.reviewCount}+ reviews)</p>

                {/* Footer: price + CTA */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div>
                        <p className="text-2xl font-extrabold text-dark tracking-tight">
                            Rs. {service.price.toLocaleString('en-LK')}
                        </p>
                        <p className="text-[10px] text-gray-400">Tax included</p>
                    </div>
                    <button
                        onClick={() => navigate(`/providers/${service.providerId}`)}
                        className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </article>
    );
}
