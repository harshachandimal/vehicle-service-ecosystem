import React, { useState } from 'react';
import OwnerSidebar from '../../../components/dashboard/owner/layout/OwnerSidebar';
import GarageSection from '../../../components/dashboard/owner/GarageSection';
import ServiceHistorySection from '../../../components/dashboard/owner/ServiceHistorySection';
import { InvoiceViewer } from '../../../components/dashboard/shared/invoices/InvoiceViewer';
import { useOwnerDashboard } from '../../../hooks/useOwnerDashboard';

const OwnerDashboard: React.FC = () => {
  const { vehicles, bookings, loading, error } = useOwnerDashboard();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      {/* Sidebar Navigation */}
      <OwnerSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Owner Dashboard</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Welcome back, manage your garage</p>
          </div>
        </header>

        <div className="p-8 space-y-12 overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          {/* My Garage Section */}
          <GarageSection vehicles={vehicles} />

          {/* Service History Section */}
          <ServiceHistorySection 
            bookings={bookings} 
            onViewInvoice={(id) => setSelectedBookingId(id)} 
          />
        </div>
      </main>

      {/* Modals */}
      {selectedBookingId && (
        <InvoiceViewer
          bookingId={selectedBookingId}
          isOwner={true}
          onClose={() => setSelectedBookingId(null)}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;
