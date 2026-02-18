import { UserPlus, Search, CheckCircle } from 'lucide-react';

/**
 * Step-by-step process flow data
 */
const steps = [
    {
        icon: UserPlus,
        title: 'Create Account',
        desc: 'Sign up in seconds and set up your profile to get started.',
        color: 'bg-blue-500',
    },
    {
        icon: Search,
        title: 'Find & Book',
        desc: 'Browse services, compare providers, and book your appointment.',
        color: 'bg-green-500',
    },
    {
        icon: CheckCircle,
        title: 'Get it Done',
        desc: 'Enjoy quality service and rate your experience.',
        color: 'bg-purple-500',
    },
];

/**
 * Process flow component showing how to use the platform
 * @returns ProcessFlow component
 */
export default function ProcessFlow() {
    return (
        <section className="py-20 px-6 bg-black/30">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-white mb-4">How to Use AutoFix</h2>
                <p className="text-white/70 mb-16 max-w-2xl mx-auto">
                    Getting the service you need is simple and straightforward.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map(({ icon: Icon, title, desc, color }, idx) => (
                        <div key={title} className="relative fade-in-up" style={{ animationDelay: `${idx * 0.2}s` }}>
                            <div className={`${color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                                <Icon className="text-white" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                            <p className="text-white/70 leading-relaxed">{desc}</p>

                            {idx < steps.length - 1 && (
                                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-white/30 to-transparent -translate-x-1/2"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
