import { Link } from 'react-router-dom';

/**
 * Main navigation bar component with branding and navigation links
 * @returns Navbar component
 */
export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 glass px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
                    Auto<span className="text-black">Fix</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/providers" className="text-dark hover:text-primary transition-colors font-medium">
                        Providers
                    </Link>
                    <Link to="/services" className="text-dark hover:text-primary transition-colors font-medium">
                        Services
                    </Link>
                    <Link to="/contact" className="text-dark hover:text-primary transition-colors font-medium">
                        Contact
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-dark hover:text-primary transition-colors font-medium">
                        Sign In
                    </Link>
                    <Link to="/register" className="btn-primary text-sm">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
