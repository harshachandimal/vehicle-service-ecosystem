import { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { bookingApi } from '../../../api/booking.api';
import { socketClient } from '../../../utils/socket';
import type { BookingResponse } from '../../../api/booking.api';
import BookingList from '../../../components/dashboard/provider/bookings/BookingList';
import ProviderSidebar from '../../../components/dashboard/provider/layout/ProviderSidebar';
import { FileText, AlertCircle, RefreshCw, Search, LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import CalendarView from '../../../components/dashboard/provider/bookings/CalendarView';
import { cn } from '../../../utils/cn';

export default function ProviderDashboard() {
    const { user, token, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await bookingApi.getProviderBookings();
            setBookings(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch bookings');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token && user?.role === 'PROVIDER' && user?.id) {
            fetchBookings();

            socketClient.connect();
            socketClient.join(user.id);

            const handleUpdate = () => {
                console.log('🔄 Provider dashboard update received via socket');
                fetchBookings();
            };

            socketClient.on('booking_updated', handleUpdate);
            socketClient.on('invoice_updated', handleUpdate);

            return () => {
                socketClient.off('booking_updated', handleUpdate);
                socketClient.off('invoice_updated', handleUpdate);
            };
        }
    }, [token, user?.role, user?.id]);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await bookingApi.updateBookingStatus(id, status);
            // Re-fetch after updating status
            fetchBookings();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to update booking status');
        }
    };

    // Calculate metrics
    const pendingRequests = useMemo(() => bookings.filter(b => b.status === 'PENDING').length, [bookings]);
    const upcomingAppointments = useMemo(() => bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS').length, [bookings]);
    const completedServices = useMemo(() => bookings.filter(b => b.status === 'COMPLETED').length, [bookings]);

    // Search filter
    const filteredBookings = useMemo(() => {
        if (!searchQuery.trim()) return bookings;
        const query = searchQuery.toLowerCase();
        return bookings.filter(b => 
            (b.service?.name || 'General Service').toLowerCase().includes(query) ||
            (b.vehicle?.ownerName || '').toLowerCase().includes(query) ||
            (b.vehicle?.make || '').toLowerCase().includes(query) ||
            (b.vehicle?.model || '').toLowerCase().includes(query) ||
            (b.vehicle?.licensePlate || '').toLowerCase().includes(query) ||
            (b.description || '').toLowerCase().includes(query)
        );
    }, [bookings, searchQuery]);

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!token || user?.role !== 'PROVIDER') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-100">
            {/* Sidebar nav */}
            <ProviderSidebar />

            {/* Main Content Area */}
            <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto relative z-0">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 mt-2 text-lg">Manage your service requests and appointments.</p>
                    </div>
                </header>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <MetricCard
                        title="Pending Requests"
                        value={pendingRequests}
                        icon={<AlertCircle className="w-8 h-8 relative z-10 text-amber-600" />}
                        bgClass="bg-amber-100/50"
                        colorClass="text-amber-500"
                    />
                    <MetricCard
                        title="Active & Upcoming"
                        value={upcomingAppointments}
                        icon={<FileText className="w-8 h-8 relative z-10 text-emerald-600" />}
                        bgClass="bg-emerald-100/50"
                        colorClass="text-emerald-500"
                    />
                    <MetricCard
                        title="Completed Services"
                        value={completedServices}
                        icon={<RefreshCw className="w-8 h-8 relative z-10 text-blue-600" />}
                        bgClass="bg-blue-100/50"
                        colorClass="text-blue-500"
                    />
                </div>

                {/* Bookings Area */}
                <div className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Schedule</h2>
                            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                                        viewMode === 'list' 
                                            ? "bg-white text-blue-600 shadow-md ring-1 ring-slate-200" 
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    )}
                                >
                                    <LayoutList className="w-4 h-4" />
                                    <span>List</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                                        viewMode === 'calendar' 
                                            ? "bg-white text-blue-600 shadow-md ring-1 ring-slate-200" 
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    )}
                                >
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>Calendar</span>
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search appointments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full md:w-80 pl-11 pr-4 py-3 border-transparent rounded-2xl leading-5 bg-white shadow-sm ring-1 ring-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center p-16">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50/80 backdrop-blur-md text-red-600 p-8 rounded-3xl border border-red-100 text-center shadow-sm font-bold">
                            {error}
                        </div>
                    ) : (
                        viewMode === 'list' ? (
                            <BookingList bookings={filteredBookings} onStatusUpdate={handleStatusUpdate} />
                        ) : (
                            <CalendarView bookings={bookings} />
                        )
                    )}
                </div>
            </main>
        </div>
    );
}

function MetricCard({ title, value, icon, bgClass, colorClass }: any) {
    return (
        <div className="group bg-white/80 w-full backdrop-blur-xl rounded-3xl p-6 border border-white shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700 ease-out bg-current ${colorClass}`}></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{title}</p>
                    <p className="text-4xl font-black text-slate-800 mt-2 tracking-tight">{value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${bgClass} shadow-inner border border-white/50`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
