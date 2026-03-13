import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProviderBooking } from '../../hooks/useProviderBooking';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { ProviderBookingHeader } from '../../components/dashboard/booking-details/ProviderBookingHeader';
import { ProviderCustomerInfo } from '../../components/dashboard/booking-details/ProviderCustomerInfo';
import { ProviderVehicleInfo } from '../../components/dashboard/booking-details/ProviderVehicleInfo';
import { ProviderBookingNotes } from '../../components/dashboard/booking-details/ProviderBookingNotes';
import { ProviderBookingLoading } from '../../components/dashboard/booking-details/ProviderBookingLoading';
import { ProviderBookingError } from '../../components/dashboard/booking-details/ProviderBookingError';
import { ProviderBookingFooter } from '../../components/dashboard/booking-details/ProviderBookingFooter';
import { ArrowLeft } from 'lucide-react';
import { isServiceTimePassed } from '../../utils/date.util';

export default function ProviderBookingDetails() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { booking, loading, error, handleStatusUpdate, refetch } = useProviderBooking(id);

    if (loading) return <ProviderBookingLoading />;
    if (error || !booking) return <ProviderBookingError error={error} />;

    const { vehicle, service, status } = booking;
    const date = new Date(booking.serviceDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const canStartService = status === 'ACCEPTED' ? isServiceTimePassed(booking.serviceDate, booking.timeSlot) : false;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <main className="flex-1 p-8 md:p-12 lg:p-16">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <Link to="/dashboard/provider" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium bg-white/50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                        <StatusBadge status={status} />
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <ProviderBookingHeader serviceName={service?.name || "General Service"} dateString={date} timeSlot={booking.timeSlot} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <ProviderCustomerInfo ownerName={vehicle?.ownerName} ownerPhone={vehicle?.ownerPhone} />
                            <ProviderVehicleInfo make={vehicle?.make} model={vehicle?.model} licensePlate={vehicle?.licensePlate} />
                        </div>
                        <ProviderBookingNotes description={booking.description} />
                        <ProviderBookingFooter 
                            booking={booking} status={status} 
                            isProvider={user?.role === 'PROVIDER'} isOwner={user?.role === 'OWNER'} 
                            canStartService={canStartService} onStatusUpdate={handleStatusUpdate} onInvoiceSuccess={refetch} 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
