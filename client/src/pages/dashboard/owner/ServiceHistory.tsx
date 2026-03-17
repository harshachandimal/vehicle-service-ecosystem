import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Calendar, Car, Wrench, ChevronRight, Loader2, AlertCircle, FileText } from 'lucide-react';
import OwnerSidebar from '../../../components/dashboard/owner/layout/OwnerSidebar';
import { useServiceHistory } from '../../../hooks/useServiceHistory';

const ServiceHistory: React.FC = () => {
  const navigate = useNavigate();
  const { history, loading, error } = useServiceHistory();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <OwnerSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Service History</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-0.5">View your completed vehicle services</p>
          </div>
        </header>

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
            <div className="bg-slate-900/50 border border-dashed border-white/10 rounded-3xl p-20 text-center flex flex-col items-center">
              <div className="inline-flex p-4 bg-slate-800/50 rounded-2xl mb-4 text-slate-600">
                <History size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">No service history yet</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                Once your service bookings are completed by providers, they will appear here as part of your vehicle's maintenance record.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-5xl">
              {history.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-600/10 rounded-xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">{formatDate(booking.serviceDate)}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <Car size={14} className="text-slate-500" />
                          <span>{booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <span className="text-slate-500 uppercase">{booking.vehicle?.licensePlate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:border-l md:border-white/5 md:pl-8">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Provider</p>
                        <p className="text-sm font-bold text-white">{booking.provider?.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Service</p>
                        <p className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Wrench size={14} className="text-blue-500" />
                          {booking.service?.name || booking.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Amount</p>
                        <p className="text-sm font-bold text-blue-400">
                          {booking.invoice?.amount ? `LKR ${booking.invoice.amount}` : 'N/A'}
                        </p>
                      </div>
                      {booking.invoice && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
                          <FileText size={14} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">Invoiced</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => navigate(`/dashboard/owner/bookings/${booking.id}`)}
                      className="md:ml-auto p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServiceHistory;
