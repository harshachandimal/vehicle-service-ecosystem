import { Navigate } from 'react-router-dom';
import { useProviderDashboard } from '../../../hooks/useProviderDashboard';
import BookingList from '../../../components/dashboard/provider/bookings/BookingList';
import ProviderSidebar from '../../../components/dashboard/provider/layout/ProviderSidebar';
import { FileText, AlertCircle, RefreshCw } from 'lucide-react';
import CalendarView from '../../../components/dashboard/provider/bookings/CalendarView';
import MetricCard from '../../../components/dashboard/provider/layout/MetricCard';
import DashboardHeader from '../../../components/dashboard/provider/layout/DashboardHeader';
import DashboardControls from '../../../components/dashboard/provider/layout/DashboardControls';

export default function ProviderDashboard() {
    const {
        user,
        token,
        authLoading,
        filteredBookings,
        bookings,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        metrics,
        handleStatusUpdate
    } = useProviderDashboard();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
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
                <DashboardHeader 
                    title="Dashboard" 
                    subtitle="Manage your service requests and appointments." 
                />

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <MetricCard
                        title="Pending Requests"
                        value={metrics.pendingRequests}
                        icon={<AlertCircle className="w-8 h-8 relative z-10 text-amber-600" />}
                        bgClass="bg-amber-100/50"
                        colorClass="text-amber-500"
                    />
                    <MetricCard
                        title="Active & Upcoming"
                        value={metrics.upcomingAppointments}
                        icon={<FileText className="w-8 h-8 relative z-10 text-emerald-600" />}
                        bgClass="bg-emerald-100/50"
                        colorClass="text-emerald-500"
                    />
                    <MetricCard
                        title="Completed Services"
                        value={metrics.completedServices}
                        icon={<RefreshCw className="w-8 h-8 relative z-10 text-blue-600" />}
                        bgClass="bg-blue-100/50"
                        colorClass="text-blue-500"
                    />
                </div>

                {/* Bookings Area */}
                <div className="mb-16">
                    <DashboardControls 
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

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
