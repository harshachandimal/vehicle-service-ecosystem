import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface Props {
  serviceName: string;
  serviceDate: string;
  timeSlot?: string | null;
  amount?: string | null;
}

export const BookingDetailsServiceInfo: React.FC<Props> = ({ serviceName, serviceDate, timeSlot, amount }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-8 border-b border-white/5 bg-blue-600/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-2">{serviceName}</h2>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" />
              <span className="text-sm font-medium">{formatDate(serviceDate)}</span>
            </div>
            {timeSlot && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <span className="text-sm font-medium">{timeSlot}</span>
              </div>
            )}
          </div>
        </div>
        {amount && (
          <div className="text-right">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
            <p className="text-3xl font-black text-blue-400">LKR {amount}</p>
          </div>
        )}
      </div>
    </div>
  );
};
