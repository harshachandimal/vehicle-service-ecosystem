import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import OwnerSidebar from '../../../components/dashboard/owner/layout/OwnerSidebar';
import { useServiceHistory } from '../../../hooks/useServiceHistory';

// Sub-components
import ServiceHistoryHeader from '../../../components/dashboard/owner/service-history/ServiceHistoryHeader';
import ServiceHistoryItem from '../../../components/dashboard/owner/service-history/ServiceHistoryItem';
import ServiceHistoryEmpty from '../../../components/dashboard/owner/service-history/ServiceHistoryEmpty';
import ServiceHistorySearchEmpty from '../../../components/dashboard/owner/service-history/ServiceHistorySearchEmpty';

const ServiceHistory: React.FC = () => {
  const navigate = useNavigate();
  const { history, loading, error } = useServiceHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(booking => 
    booking.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.provider?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.vehicle?.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <OwnerSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <ServiceHistoryHeader 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        <div className="p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-2 mb-6">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Retrieving your service history...</p>
            </div>
          ) : history.length === 0 ? (
            <ServiceHistoryEmpty />
          ) : filteredHistory.length === 0 ? (
            <ServiceHistorySearchEmpty searchTerm={searchTerm} />
          ) : (
            <div className="space-y-4 w-full">
              {filteredHistory.map((booking) => (
                <ServiceHistoryItem 
                  key={booking.id} 
                  booking={booking} 
                  onNavigate={(id) => navigate(`/dashboard/owner/bookings/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServiceHistory;
