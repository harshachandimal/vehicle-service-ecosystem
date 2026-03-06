import { UserPlus, Search, CheckCircle } from 'lucide-react';

const steps = [
    {
        step: '01',
        icon: UserPlus,
        title: 'Create Account',
        desc: 'Sign up in seconds and set up your profile to get started with AutoFix.',
        accent: 'from-blue-500 to-cyan-500',
        glow: 'rgba(59,130,246,0.5)',
    },
    {
        step: '02',
        icon: Search,
        title: 'Find & Book',
        desc: 'Browse verified providers, compare services, and book your appointment instantly.',
        accent: 'from-violet-500 to-blue-500',
        glow: 'rgba(139,92,246,0.5)',
    },
    {
        step: '03',
        icon: CheckCircle,
        title: 'Get it Done',
        desc: 'Enjoy quality service from trusted professionals and rate your experience.',
        accent: 'from-emerald-500 to-cyan-500',
        glow: 'rgba(16,185,129,0.5)',
    },
];

export default function ProcessFlow() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest">
                        Simple process
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">How AutoFix Works</h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm">
                        Getting the auto service you need is effortless with our three-step process.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connector line — desktop only */}
                    <div className="hidden md:block absolute top-16 left-[calc(16.6%+2rem)] right-[calc(16.6%+2rem)] h-px bg-gradient-to-r from-blue-500/40 via-violet-500/40 to-emerald-500/40" />

                    {steps.map(({ step, icon: Icon, title, desc, accent, glow }, idx) => (
                        <div
                            key={title}
                            className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
                            style={{ animationDelay: `${idx * 0.15}s` }}
                        >
                            {/* Top accent */}
                            <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                            {/* Step number */}
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{step}</div>

                            {/* Icon */}
                            <div
                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                                style={{ boxShadow: `0 0 22px ${glow}` }}
                            >
                                <Icon className="text-white" size={30} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
