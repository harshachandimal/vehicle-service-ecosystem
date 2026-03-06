import { Link } from 'react-router-dom';
import { Car, Store, ArrowRight } from 'lucide-react';

export default function DualCTA() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Ready to Experience the Difference?
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm">
                        Whether you're a vehicle owner or a service professional, AutoFix is built for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Owner card */}
                    <div className="relative group rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-md p-10 overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                        {/* Glow top line */}
                        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />
                        {/* Background radial glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.15)_0%,transparent_60%)] pointer-events-none" />

                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-300">
                                <Car className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">For Vehicle Owners</h3>
                            <p className="text-slate-300 text-sm leading-relaxed mb-8">
                                Book trusted automotive services at your convenience. Browse verified providers and get quality work done across Sri Lanka.
                            </p>
                            <Link
                                to="/register?role=owner"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_16px_rgba(59,130,246,0.4)] hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 group/btn"
                            >
                                Get Started
                                <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Provider card */}
                    <div className="relative group rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-600/15 to-slate-900/30 backdrop-blur-md p-10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300">
                        {/* Glow top line */}
                        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent" />
                        {/* Background radial glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.15)_0%,transparent_60%)] pointer-events-none" />

                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:scale-110 transition-transform duration-300">
                                <Store className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">For Service Providers</h3>
                            <p className="text-slate-300 text-sm leading-relaxed mb-8">
                                Grow your business and connect with customers who need you. Expand your reach across Sri Lanka on one trusted platform.
                            </p>
                            <Link
                                to="/register?role=provider"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-[0_0_16px_rgba(16,185,129,0.4)] hover:shadow-[0_0_24px_rgba(16,185,129,0.6)] transition-all duration-300 group/btn"
                            >
                                Join as Provider
                                <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
