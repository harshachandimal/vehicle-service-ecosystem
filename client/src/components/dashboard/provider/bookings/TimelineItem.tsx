import React from 'react';
import { Clock } from 'lucide-react';
import type { BookingResponse } from '../../../../api/booking.api';
import { cn } from '../../../../utils/cn';
import BookingDetailCard from './BookingDetailCard';

interface TimelineItemProps {
    slot: string;
    bookings: BookingResponse[];
}

const TimelineItem: React.FC<TimelineItemProps> = ({ slot, bookings }) => {
    const hasBookings = bookings.length > 0;

    return (
        <div className="relative flex gap-8 items-start group">
            {/* Time Label */}
            <div className="w-20 text-right pt-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{slot}</span>
            </div>

            {/* Timeline Dot */}
            <div className={cn(
                "relative z-10 w-4 h-4 rounded-full border-2 bg-white mt-2 transition-transform duration-300 group-hover:scale-125",
                hasBookings ? "border-blue-500 ring-4 ring-blue-50" : "border-slate-200"
            )}></div>

            {/* Booking Cards or Empty Slot */}
            <div className="flex-1 space-y-4">
                {hasBookings ? (
                    bookings.map((booking) => (
                        <BookingDetailCard key={booking.id} booking={booking} />
                    ))
                ) : (
                    <div className="py-4 px-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/30 flex items-center justify-between group/empty">
                        <span className="text-sm font-bold text-slate-300 group-hover/empty:text-slate-400 transition-colors">Available Slot</span>
                        <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-200 group-hover/empty:border-slate-300 group-hover/empty:text-slate-300 transition-colors">
                            <Clock size={12} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimelineItem;
