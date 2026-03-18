import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OwnerSidebar from '../../../components/dashboard/owner/layout/OwnerSidebar';
import GarageSection from '../../../components/dashboard/owner/GarageSection';
import ServiceHistorySection from '../../../components/dashboard/owner/ServiceHistorySection';
import { InvoiceViewer } from '../../../components/dashboard/shared/invoices/InvoiceViewer';
import { useOwnerDashboard } from '../../../hooks/useOwnerDashboard';

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, bookings, loading, error } = useOwnerDashboard();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(booking => 
    booking.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.provider?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.vehicle?.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search vehicles, services, or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
        </header>

        <div className="p-8 space-y-12 overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          {/* My Garage Section */}
          <GarageSection vehicles={filteredVehicles} />

          {/* Service History Section */}
          <ServiceHistorySection 
            bookings={filteredBookings} 
            onViewInvoice={(id) => setSelectedBookingId(id)} 
            onViewDetails={(id) => navigate(`/dashboard/owner/bookings/${id}`)}
          />

          {(filteredVehicles.length === 0 && filteredBookings.length === 0 && searchTerm) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
              <p className="text-slate-400 max-w-xs">
                We couldn't find anything matching "{searchTerm}". Try another keyword.
              </p>
            </div>
          )}
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
