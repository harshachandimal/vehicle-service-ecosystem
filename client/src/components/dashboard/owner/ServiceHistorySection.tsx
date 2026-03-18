import React from 'react';
import { History } from 'lucide-react';
import BookingListView from './bookings/BookingListView';
import type { BookingResponse } from '../../../api/booking.api';

interface ServiceHistorySectionProps {
  bookings: BookingResponse[];
  onViewInvoice: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const ServiceHistorySection: React.FC<ServiceHistorySectionProps> = ({ 
  bookings, 
  onViewInvoice,
  onViewDetails
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="text-blue-500" size={20} />
        <h2 className="text-lg font-bold text-white tracking-tight">Service History</h2>
        <span className="bg-slate-800 text-slate-500 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ml-2 tracking-widest">
          Latest
        </span>
      </div>

      <BookingListView 
        bookings={bookings} 
        onViewInvoice={onViewInvoice} 
        onViewDetails={onViewDetails}
      />
    </section>
  );
};

export default ServiceHistorySection;
