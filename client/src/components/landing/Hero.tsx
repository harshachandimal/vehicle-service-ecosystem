import { Search } from 'lucide-react';

/**
 * Hero section component for the landing page
 * @returns Hero component with search functionality
 */
export default function Hero() {
    return (
        <section className="relative bg-transparent min-h-[600px] flex items-center px-6 py-20">

            <div className="max-w-7xl mx-auto relative z-10 text-center fade-in-up">
                <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
                    Sri Lanka's Premier Vehicle Service Platform
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                    Find Trusted Auto Services
                    <br />
                    <span className="text-primary bg-white px-4 rounded-lg inline-block mt-2">Near You</span>
                </h1>

                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                    Connect with verified mechanics, garages, and detailing experts across Sri Lanka.
                </p>

                <div className="glass max-w-3xl mx-auto p-2 rounded-2xl flex flex-col md:flex-row gap-2">
                    <input
                        type="text"
                        placeholder="Search for services or providers..."
                        className="flex-1 px-6 py-4 bg-white/50 rounded-xl border-none outline-none text-dark placeholder:text-dark/60 font-medium"
                    />
                    <button className="btn-primary flex items-center gap-2 whitespace-nowrap">
                        <Search size={20} />
                        Search
                    </button>
                </div>
            </div>
        </section>
    );
}
