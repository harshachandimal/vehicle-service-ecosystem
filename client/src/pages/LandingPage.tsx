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
        <div className="min-h-screen">
            <Hero />
            <CategoryGrid />
            <ProcessFlow />
            <DualCTA />
            <AboutContact />
        </div>
    );
}
