import React from 'react';
import { ArrowLeft } from 'lucide-react';
import StatusBadge from '../../../shared/common/StatusBadge';

interface Props {
  bookingId: string;
  status: string;
  onBack: () => void;
}

export const BookingDetailsHeader: React.FC<Props> = ({ bookingId, status, onBack }) => {
  return (
    <header className="sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Booking Details</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Reference: #{bookingId.slice(-8).toUpperCase()}
          </p>
        </div>
      </div>
      <StatusBadge status={status} />
    </header>
  );
};
