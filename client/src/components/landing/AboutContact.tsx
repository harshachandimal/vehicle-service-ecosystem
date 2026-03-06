import { Mail, Phone, MapPin, Target } from 'lucide-react';
import ContactForm from '../shared/ContactForm';

const contactDetails = [
    { icon: Mail, label: 'Email', value: 'autofix@email.com' },
    { icon: Phone, label: 'Phone', value: '+94 77 123 4567' },
    { icon: MapPin, label: 'Location', value: 'Colombo, Sri Lanka' },
];

export default function AboutContact() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest">
                        About us
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">What is AutoFix?</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
                        AutoFix connects vehicle owners with trusted service providers across Sri Lanka —
                        making vehicle maintenance simple, transparent, and reliable for everyone.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left — info */}
                    <div className="space-y-5">
                        {/* Mission */}
                        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-7 hover:border-blue-500/30 hover:bg-white/8 transition-all duration-300 group">
                            <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
                                    <Target size={16} className="text-blue-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Our Mission</h3>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                To revolutionize how vehicle servicing works in Sri Lanka — connecting owners with quality providers through a platform built on transparency and trust.
                            </p>
                        </div>

                        {/* Contact details */}
                        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-7 hover:border-blue-500/30 transition-all duration-300">
                            <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                            <h3 className="text-lg font-bold text-white mb-5">Get in Touch</h3>
                            <div className="space-y-4">
                                {contactDetails.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
                                            <Icon size={15} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                                            <p className="text-sm text-slate-200">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — contact form */}
                    <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8">
                        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                        <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
                        <ContactForm />
                    </div>
                </div>

                {/* Footer line */}
                <p className="text-center text-slate-600 text-xs mt-16">
                    © {new Date().getFullYear()} AutoFix · Built for Sri Lanka
                </p>
            </div>
        </section>
    );
}
