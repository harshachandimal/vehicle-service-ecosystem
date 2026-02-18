import { Wrench, Car, Droplet, Settings, Sparkles, Gauge } from 'lucide-react';

/**
 * Service categories with icons and colors
 */
const categories = [
    { icon: Wrench, title: 'General Repairs', color: 'bg-blue-500' },
    { icon: Car, title: 'Full Service', color: 'bg-green-500' },
    { icon: Droplet, title: 'Car Wash & Detailing', color: 'bg-cyan-500' },
    { icon: Settings, title: 'Engine Work', color: 'bg-purple-500' },
    { icon: Sparkles, title: 'Paint & Body', color: 'bg-pink-500' },
    { icon: Gauge, title: 'Diagnostics', color: 'bg-orange-500' },
];

/**
 * Service category grid component displaying available service types
 * @returns CategoryGrid component
 */
export default function CategoryGrid() {
    return (
        <section className="py-20 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-white mb-4">
                    Available Service Categories
                </h2>
                <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
                    Browse through our wide range of automotive services tailored for every need.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(({ icon: Icon, title, color }) => (
                        <div
                            key={title}
                            className="group glass p-8 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl"
                        >
                            <div className={`${color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon className="text-white" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-white/70 text-sm">
                                Professional {title.toLowerCase()} services from verified providers.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
