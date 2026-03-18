import React from 'react';
import { Calendar, Wrench, ChevronRight, FileText } from 'lucide-react';
import type { BookingResponse } from '../../../../api/booking.api';

interface ServiceHistoryItemProps {
  booking: BookingResponse;
  onNavigate: (id: string) => void;
}

const ServiceHistoryItem: React.FC<ServiceHistoryItemProps> = ({ booking, onNavigate }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Service Info Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Date & Vehicle Column */}
          <div className="flex items-start gap-4 pr-4">
            <div className="p-3 bg-blue-600/10 rounded-xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Date</p>
              <p className="text-sm font-bold text-white mb-1 whitespace-nowrap">{formatDate(booking.serviceDate)}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span>{booking.vehicle?.make} {booking.vehicle?.model}</span>
              </div>
            </div>
          </div>

          {/* Provider Column */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Provider</p>
            <p className="text-sm font-bold text-white">{booking.provider?.name}</p>
            <p className="text-[10px] text-slate-500 font-medium">{booking.vehicle?.licensePlate}</p>
          </div>

          {/* Service Column */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Service</p>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <Wrench size={14} className="text-blue-500 shrink-0" />
              <span className="truncate">{booking.service?.name || booking.description}</span>
            </div>
          </div>

          {/* Mileage Column */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Mileage</p>
            <p className="text-sm font-bold text-white">
              {booking.currentMileage ? `${booking.currentMileage.toLocaleString()} km` : 'N/A'}
            </p>
          </div>

          {/* Amount Column */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Amount</p>
            <p className="text-sm font-bold text-blue-400">
              {booking.invoice?.amount ? `LKR ${booking.invoice.amount}` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Status & Actions (Far Right) */}
        <div className="flex items-center justify-between lg:justify-end gap-6 lg:border-l lg:border-white/5 lg:pl-8 lg:min-w-[180px]">
          {booking.invoice ? (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border whitespace-nowrap ${
              booking.invoice.status === 'PAID'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : booking.invoice.status === 'PAYMENT_PENDING'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <FileText size={14} />
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {booking.invoice.status === 'PAID' ? 'Paid' : booking.invoice.status === 'PAYMENT_PENDING' ? 'Pending' : 'Unpaid'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-500/10 text-slate-400 rounded-lg border border-slate-500/20 whitespace-nowrap">
              <FileText size={14} />
              <span className="text-[10px] font-black uppercase tracking-tighter">No Invoice</span>
            </div>
          )}
          <button 
            onClick={() => onNavigate(booking.id)}
            className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceHistoryItem;
