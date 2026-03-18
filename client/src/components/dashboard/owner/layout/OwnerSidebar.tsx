import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, History, User, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import NotificationBell from '../../provider/layout/NotificationBell';

export default function OwnerSidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { to: '/dashboard/owner', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/dashboard/owner/book', icon: PlusCircle, label: 'Book a Service' },
        { to: '/dashboard/owner/vehicles', icon: Car, label: 'My Vehicles' },
        { to: '/dashboard/owner/history', icon: History, label: 'Service History' },
        { to: '/dashboard/owner/settings', icon: User, label: 'Profile Settings' },
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.1)] hidden md:flex flex-col justify-between z-10 sticky top-0 h-screen">
            <div>
                <div className="p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">AutoFix</h2>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Owner Portal</p>
                        </div>
                        <NotificationBell bookingUrlPrefix="/dashboard/owner/bookings" />
                    </div>
                </div>
                <nav className="flex flex-col gap-2 px-4 mt-6">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.to}
                            to={link.to} 
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all ${
                                isActive(link.to) 
                                    ? 'bg-blue-600/20 text-blue-400' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        >
                            <link.icon className={`w-5 h-5 ${isActive(link.to) ? 'text-blue-400' : 'text-slate-500'}`} /> {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4 mb-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-2xl font-medium transition-all"
                >
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </div>
        </aside>
    );
}
