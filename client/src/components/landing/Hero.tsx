import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * Hero section — cinematic, full-height hero with glass CTA buttons
 */
export default function Hero() {
    return (
        <section className="relative min-h-[92vh] flex items-center px-6 py-24">
            <div className="max-w-7xl mx-auto w-full text-center">

                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Sri Lanka's Premier Vehicle Service Platform
                </div>

                {/* Main heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-none mb-6">
                    Find Trusted
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300">
                        Auto Services
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Connect with verified mechanics, garages, and detailing experts across Sri Lanka — fast, transparent, and reliable.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/providers"
                        className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_24px_rgba(59,130,246,0.45)] hover:shadow-[0_0_32px_rgba(59,130,246,0.65)] transition-all duration-300 active:scale-95"
                    >
                        Browse Providers
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-300 active:scale-95"
                    >
                        <ShieldCheck size={16} className="text-blue-400" />
                        Join AutoFix
                    </Link>
                </div>

                {/* Trust pills */}
                <div className="mt-16 flex flex-wrap justify-center gap-3">
                    {['500+ Verified Providers', '12,000+ Happy Customers', '25+ Cities', '4.8★ Rating'].map((t) => (
                        <span
                            key={t}
                            className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 border border-white/10 bg-white/5 backdrop-blur-sm"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
