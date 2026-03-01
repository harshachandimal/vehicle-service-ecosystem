/**
 * ProviderProfilePage
 * Full detail view for a single service provider
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wrench, ArrowLeft, Phone, FileText } from 'lucide-react';
import { getProviderById } from '../api/providers.api';
import type { ProviderDetail } from '../api/providers.api';

const SERVER = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

const BADGE_COLORS: Record<string, string> = {
    GARAGE: 'bg-blue-50 text-blue-700',
    CARRIER: 'bg-violet-50 text-violet-700',
    DETAILER: 'bg-emerald-50 text-emerald-700',
};

const CATEGORY_LABELS: Record<string, string> = {
    GARAGE: 'Auto Garage',
    CARRIER: 'Transport & Carrier',
    DETAILER: 'Detailing Studio',
};

/** Skeleton for the detail page while loading */
function Skeleton() {
    return (
        <div className="animate-pulse max-w-4xl mx-auto py-10 px-4">
            <div className="h-64 rounded-2xl bg-gray-200 mb-6" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-gray-100" />)}
            </div>
        </div>
    );
}

/** Full-width provider profile detail page */
export default function ProviderProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<ProviderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getProviderById(id)
            .then(setData)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Skeleton />;
    if (error || !data) return (
        <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">Provider not found</p>
            <button onClick={() => navigate('/providers')} className="mt-4 btn-primary">Back to Listing</button>
        </div>
    );

    const { profile, services } = data;
    const photoSrc = profile.photoUrl ? `${SERVER}${profile.photoUrl}` : null;
    const categoryStyle = BADGE_COLORS[profile.category] ?? 'bg-gray-100 text-gray-600';

    return (
        <div className="min-h-screen bg-silver">
            {/* Hero banner */}
            <div className="relative h-64 md:h-80 overflow-hidden">
                {photoSrc ? (
                    <img src={photoSrc} alt={profile.businessName} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/90 to-primary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                    onClick={() => navigate('/providers')}
                    className="absolute top-4 left-4 flex items-center gap-1.5 text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition"
                >
                    <ArrowLeft size={15} /> Back
                </button>
                <div className="absolute bottom-5 left-6 right-6">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryStyle}`}>{CATEGORY_LABELS[profile.category]}</span>
                        {profile.registrationNumber && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Authorized</span>
                        )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white">{profile.businessName}</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                        <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Location</p>
                            <p className="text-sm font-semibold text-dark">{profile.streetAddress}</p>
                            <p className="text-xs text-gray-500">{profile.city}, {profile.district}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                        <Star size={18} className="text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Rating</p>
                            <p className="text-sm font-semibold text-dark">4.5 / 5.0</p>
                            <p className="text-xs text-gray-500">12 verified reviews</p>
                        </div>
                    </div>
                    {profile.registrationNumber && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                            <FileText size={18} className="text-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Registration No.</p>
                                <p className="text-sm font-semibold text-dark">{profile.registrationNumber}</p>
                            </div>
                        </div>
                    )}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                        <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Contact</p>
                            <p className="text-sm font-semibold text-dark">Contact via booking</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {profile.businessDescription && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
                        <h2 className="text-sm font-bold text-dark mb-2">About</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{profile.businessDescription}</p>
                    </div>
                )}

                {/* Services */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Wrench size={16} className="text-primary" />
                        <h2 className="text-base font-bold text-dark">Services Offered</h2>
                        <span className="text-xs text-gray-400">({services.length})</span>
                    </div>
                    {services.length === 0 ? (
                        <p className="text-sm text-gray-400">No services listed yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {services.map((s) => (
                                <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-primary/40 transition-colors">
                                    <div>
                                        <p className="text-sm font-semibold text-dark">{s.name}</p>
                                        {s.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{s.description}</p>}
                                    </div>
                                    <span className="text-primary font-bold text-sm whitespace-nowrap ml-4">Rs. {s.price.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
