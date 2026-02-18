import Hero from '../components/landing/Hero';
import CategoryGrid from '../components/landing/CategoryGrid';
import ProcessFlow from '../components/landing/ProcessFlow';
import DualCTA from '../components/landing/DualCTA';
import AboutContact from '../components/landing/AboutContact';

/**
 * Landing page component that assembles all landing sections
 * @returns LandingPage component
 */
export default function LandingPage() {
    return (
        <div
            className="min-h-screen relative"
            style={{
                backgroundImage: 'url(/Gemini_Generated_Image_b3barcb3barcb3ba.png)',
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Dark overlay for readability across all sections */}
            <div className="absolute inset-0 bg-black/55 pointer-events-none" />
            <div className="relative z-10">
                <Hero />
                <CategoryGrid />
                <ProcessFlow />
                <DualCTA />
                <AboutContact />
            </div>
        </div>
    );
}
