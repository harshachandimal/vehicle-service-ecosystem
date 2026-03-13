import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wrench, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function ProviderSidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.1)] hidden md:flex flex-col justify-between z-10 sticky top-0 h-screen">
            <div>
                <div className="p-8">
                    <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">AutoFix</h2>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Provider Portal</p>
                </div>
                <nav className="flex flex-col gap-2 px-4 mt-6">
                    <Link to="/dashboard/provider" className="flex items-center gap-3 px-4 py-3.5 bg-blue-600/20 text-blue-400 rounded-2xl font-semibold transition-all">
                        <LayoutDashboard className="w-5 h-5 text-blue-400" /> Dashboard
                    </Link>
                    <Link to="/services" className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-2xl font-medium transition-all">
                        <Wrench className="w-5 h-5 text-slate-500" /> My Services
                    </Link>
                    <Link to="/providers" className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-2xl font-medium transition-all">
                        <User className="w-5 h-5 text-slate-500" /> Profile Settings
                    </Link>
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
