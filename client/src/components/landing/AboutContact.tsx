import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function AboutContact() {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

    return (
        <section className="py-20 px-6 bg-silver">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-dark mb-4">What is AutoFix?</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        AutoFix connects vehicle owners with trusted service providers across Sri Lanka.
                        Our mission is to make vehicle maintenance simple, transparent, and reliable for everyone in our community.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="glass p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                Our Mission
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                To revolutionize how vehicle servicing works in Sri Lanka by connecting owners with quality providers.
                            </p>
                        </div>

                        <div className="glass p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-dark mb-4">Get in Touch</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Mail size={20} className="text-primary" />
                                    <span>autofix@email.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Phone size={20} className="text-primary" />
                                    <span>+94 77 123 4567</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <MapPin size={20} className="text-primary" />
                                    <span>Colombo, Sri Lanka</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold text-dark mb-6">Send us a Message</h3>
                        <form className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name *"
                                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-primary outline-none transition"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-primary outline-none transition"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address *"
                                    className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-primary outline-none transition"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <textarea
                                placeholder="Message *"
                                rows={4}
                                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-primary outline-none transition resize-none"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
