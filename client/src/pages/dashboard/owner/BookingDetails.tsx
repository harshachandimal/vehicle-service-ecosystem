import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import OwnerSidebar from '../../../components/dashboard/owner/layout/OwnerSidebar';
import { useBookingDetails } from '../../../hooks/useBookingDetails';
import { InvoiceViewer } from '../../../components/dashboard/shared/invoices/InvoiceViewer';
import { useAuth } from '../../../hooks/useAuth';

// New sub-components
import { BookingDetailsHeader } from '../../../components/dashboard/owner/bookings/details/BookingDetailsHeader';
import { BookingDetailsServiceInfo } from '../../../components/dashboard/owner/bookings/details/BookingDetailsServiceInfo';
import { BookingDetailsVehicle } from '../../../components/dashboard/owner/bookings/details/BookingDetailsVehicle';
import { BookingDetailsProvider } from '../../../components/dashboard/owner/bookings/details/BookingDetailsProvider';
import { BookingDetailsDescription } from '../../../components/dashboard/owner/bookings/details/BookingDetailsDescription';
import { BookingDetailsInvoice } from '../../../components/dashboard/owner/bookings/details/BookingDetailsInvoice';
import { BookingDetailsServiceRecord } from '../../../components/dashboard/owner/bookings/details/BookingDetailsServiceRecord';

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { booking, loading, error } = useBookingDetails(id);
  const [showInvoice, setShowInvoice] = React.useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#020617] text-slate-200">
        <OwnerSidebar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Fetching booking details...</p>
        </main>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen bg-[#020617] text-slate-200">
        <OwnerSidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Error</h2>
            <p className="text-slate-400 mb-6">{error || 'Booking not found.'}</p>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <OwnerSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <BookingDetailsHeader 
          bookingId={booking.id} 
          status={booking.status} 
          onBack={() => navigate(-1)} 
        />

        <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <BookingDetailsServiceInfo 
              serviceName={booking.service?.name || 'General Service'}
              serviceDate={booking.serviceDate}
              timeSlot={booking.timeSlot}
              amount={booking.invoice?.amount}
            />

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <BookingDetailsVehicle vehicle={booking.vehicle} />
              <BookingDetailsProvider provider={booking.provider} />
            </div>

            <BookingDetailsDescription description={booking.description} />

            {booking.status === 'COMPLETED' && (
              <BookingDetailsServiceRecord
                currentMileage={booking.currentMileage}
                serviceNote={booking.serviceNote}
              />
            )}
          </div>

          {booking.invoice && (
            <BookingDetailsInvoice 
              invoice={booking.invoice} 
              onViewInvoice={() => setShowInvoice(true)} 
            />
          )}
        </div>
      </main>

      {showInvoice && id && (
        <InvoiceViewer 
          bookingId={id} 
          isOwner={user?.role === 'OWNER'} 
          onClose={() => setShowInvoice(false)} 
        />
      )}
    </div>
  );
};

export default BookingDetails;
