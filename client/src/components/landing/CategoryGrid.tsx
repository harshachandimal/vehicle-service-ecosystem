import { Wrench, Car, Droplet, Settings, Sparkles, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
    { icon: Wrench, title: 'General Repairs', accent: 'from-blue-500 to-blue-700', glow: 'rgba(59,130,246,0.4)' },
    { icon: Car, title: 'Full Service', accent: 'from-emerald-500 to-emerald-700', glow: 'rgba(16,185,129,0.4)' },
    { icon: Droplet, title: 'Car Wash & Detailing', accent: 'from-cyan-500 to-cyan-700', glow: 'rgba(6,182,212,0.4)' },
    { icon: Settings, title: 'Engine Work', accent: 'from-violet-500 to-violet-700', glow: 'rgba(139,92,246,0.4)' },
    { icon: Sparkles, title: 'Paint & Body', accent: 'from-pink-500 to-pink-700', glow: 'rgba(236,72,153,0.4)' },
    { icon: Gauge, title: 'Diagnostics', accent: 'from-orange-500 to-orange-700', glow: 'rgba(249,115,22,0.4)' },
];

export default function CategoryGrid() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Section header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest">
                        What we offer
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Service Categories</h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                        Browse our wide range of automotive services, each delivered by verified professionals.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map(({ icon: Icon, title, accent, glow }) => (
                        <Link
                            to={`/providers?type=${encodeURIComponent(title)}`}
                            key={title}
                            className="relative group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 hover:border-white/20 hover:bg-white/10 transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                            {/* Top accent line */}
                            <div className={`absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent`} />

                            {/* Icon */}
                            <div
                                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                                style={{ boxShadow: `0 0 20px ${glow}` }}
                            >
                                <Icon className="text-white" size={28} />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Professional {title.toLowerCase()} by verified providers across Sri Lanka.
                            </p>

                            {/* Hover glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                                style={{ background: `radial-gradient(ellipse at bottom left, ${glow} 0%, transparent 70%)` }}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
