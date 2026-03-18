import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

/**
 * Main navigation bar component with branding and navigation links
 * @returns Navbar component
 */
export default function Navbar() {
    const { user, logout } = useAuth();

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'OWNER') return '/dashboard/owner';
        if (user.role === 'PROVIDER') return '/dashboard/provider';
        return '/';
    };

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
                    <Link to="/about" className="text-dark hover:text-primary transition-colors font-medium">
                        Contact
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to={getDashboardLink()} className="btn-primary text-sm px-6">
                                Dashboard
                            </Link>
                            <button 
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 text-dark hover:text-red-600 hover:bg-red-600/10 border border-slate-200 hover:border-red-200 rounded-xl transition-all duration-300 font-semibold text-sm shadow-sm hover:shadow-md active:scale-95"
                            >
                                <LogOut size={16} />
                                <span>Log Out</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-dark hover:text-primary transition-colors font-medium">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn-primary text-sm">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
