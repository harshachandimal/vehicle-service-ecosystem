import { Link } from 'react-router-dom';
import { Car, Store } from 'lucide-react';

/**
 * Dual call-to-action component for vehicle owners and service providers
 * @returns DualCTA component
 */
export default function DualCTA() {
    return (
        <section className="py-20 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-white mb-16">
                    Ready to Experience the Difference?
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-primary text-white rounded-3xl p-12 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <Car size={48} className="mb-6" />
                            <h3 className="text-3xl font-bold mb-4">For Vehicle Owners</h3>
                            <p className="text-white/90 mb-8 leading-relaxed">
                                Book trusted automotive services at your convenience. Browse verified providers and get quality work done.
                            </p>
                            <Link to="/register?role=owner" className="inline-block px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-silver transition-all shadow-xl">
                                Get Started
                            </Link>
                        </div>
                    </div>

                    <div className="glass text-white rounded-3xl p-12 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <Store size={48} className="mb-6" />
                            <h3 className="text-3xl font-bold mb-4">For Service Providers</h3>
                            <p className="text-white/80 mb-8 leading-relaxed">
                                Grow your business and connect with customers. Join our platform and expand your reach across Sri Lanka.
                            </p>
                            <Link to="/register?role=provider" className="inline-block px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-silver transition-all shadow-xl">
                                Join as Provider
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
