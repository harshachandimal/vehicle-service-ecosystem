import React from 'react';
import type { BookingResponse } from '../../../../api/booking.api';
import OwnerBookingCard from './OwnerBookingCard';

interface OwnerBookingListProps {
  bookings: BookingResponse[];
  onViewInvoice: (invoiceId: string) => void;
}

const OwnerBookingList: React.FC<OwnerBookingListProps> = ({ bookings, onViewInvoice }) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
        <p className="text-slate-400">No service bookings found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <OwnerBookingCard 
          key={booking.id} 
          booking={booking} 
          onViewInvoice={onViewInvoice}
        />
      ))}
    </div>
  );
};

export default OwnerBookingList;
