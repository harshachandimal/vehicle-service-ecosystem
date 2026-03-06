import { Target, Mail, Phone, MapPin, ShieldCheck, Star, Zap, Users } from 'lucide-react';
import ContactForm from '../components/about/ContactForm';

/* ── Stat pill ─────────────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center px-8 py-4">
            <span className="text-3xl font-extrabold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                {value}
            </span>
            <span className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{label}</span>
        </div>
    );
}

/* ── Glass card ─────────────────────────────────────────── */
function GlassCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
    return (
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-blue-500/40 hover:bg-white/10 transition-all duration-300 group">
            {/* Blue glow accent */}
            <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
                    <Icon size={20} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            {children}
        </div>
    );
}

/* ── Value pill ─────────────────────────────────────────── */
function ValuePill({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
    return (
        <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm">
            <Icon size={16} className="text-blue-400 shrink-0" />
            <span className="text-sm font-medium text-slate-200">{text}</span>
        </div>
    );
}

/* ── Page ───────────────────────────────────────────────── */
export default function AboutPage() {
    return (
        <div
            className="min-h-screen relative text-white"
            style={{
                backgroundImage: `url('/Gemini_Generated_Image_4rzv574rzv574rzv.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* Dark cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90 backdrop-blur-[2px]" />

            <div className="relative z-10">

                {/* ── Hero ─────────────────────────────────────────── */}
                <section className="pt-24 pb-16 px-4 text-center">
                    {/* Eyebrow badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Sri Lanka's Trusted Auto Platform
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
                        About{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            AutoFix
                        </span>
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
                        Connecting vehicle owners with trusted service professionals — transparent, reliable, and built for Sri Lanka.
                    </p>
                </section>

                {/* ── Stats strip ──────────────────────────────────── */}
                <section className="max-w-4xl mx-auto px-6 mb-16">
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-wrap justify-center divide-x divide-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        <Stat value="500+" label="Service Providers" />
                        <Stat value="12K+" label="Happy Customers" />
                        <Stat value="25+" label="Cities Covered" />
                        <Stat value="4.8★" label="Avg. Rating" />
                    </div>
                </section>

                {/* ── Info cards ───────────────────────────────────── */}
                <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {/* Our Mission */}
                    <GlassCard icon={Target} title="Our Mission">
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            AutoFix connects vehicle owners with trusted service providers across Sri Lanka.
                            Our mission is to make vehicle maintenance simple, transparent, and reliable for
                            everyone in our community.
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            We're building a platform where quality service providers can grow their businesses
                            while customers easily find and book reliable vehicle services.
                        </p>
                    </GlassCard>

                    {/* Get in Touch */}
                    <GlassCard icon={Mail} title="Get in Touch">
                        <p className="text-slate-400 text-sm mb-6">
                            Have questions or want to partner with us? We'd love to hear from you.
                        </p>
                        <div className="space-y-4">
                            {[
                                { icon: Mail, label: 'Email', value: 'launchoura@gmail.com' },
                                { icon: Phone, label: 'Phone', value: '+94 72 204 9804' },
                                { icon: MapPin, label: 'Location', value: 'Colombo, Sri Lanka' },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
                                        <Icon size={14} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                                        <p className="text-sm text-slate-200">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </section>

                {/* ── Values strip ─────────────────────────────────── */}
                <section className="max-w-5xl mx-auto px-6 mb-16">
                    <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
                        <h2 className="text-center text-lg font-bold text-white mb-6">
                            What drives us every day
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            <ValuePill icon={ShieldCheck} text="Verified & Trusted Providers" />
                            <ValuePill icon={Star} text="Quality-First Experience" />
                            <ValuePill icon={Zap} text="Fast, Transparent Bookings" />
                            <ValuePill icon={Users} text="Community-Driven Growth" />
                        </div>
                    </div>
                </section>

                {/* ── Contact Form ──────────────────────────────────── */}
                <section className="max-w-5xl mx-auto px-6 pb-20">
                    <ContactForm />
                </section>
            </div>
        </div>
    );
}
