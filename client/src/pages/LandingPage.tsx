import Hero from '../components/landing/Hero';
import CategoryGrid from '../components/landing/CategoryGrid';
import ProcessFlow from '../components/landing/ProcessFlow';
import DualCTA from '../components/landing/DualCTA';
import AboutContact from '../components/landing/AboutContact';

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
