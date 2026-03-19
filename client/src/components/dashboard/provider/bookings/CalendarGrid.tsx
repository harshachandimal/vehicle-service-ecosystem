import React from 'react';
import { 
    format, 
    isSameMonth, 
    isSameDay, 
} from 'date-fns';
import { cn } from '../../../../utils/cn';
import type { BookingResponse } from '../../../../api/booking.api';

interface CalendarGridProps {
    calendarDays: Date[];
    monthStart: Date;
    selectedDate: Date | null;
    getBookingsForDay: (day: Date) => BookingResponse[];
    onDayClick: (day: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
    calendarDays,
    monthStart,
    selectedDate,
    getBookingsForDay,
    onDayClick
}) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[40px] border border-white shadow-2xl overflow-hidden">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 mb-4">
                {days.map(day => (
                    <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
                {calendarDays.map((day, idx) => {
                    const dayBookings = getBookingsForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "min-h-[140px] bg-white p-4 transition-all duration-300 relative group cursor-pointer",
                                !isCurrentMonth && "bg-slate-50/50 text-slate-300",
                                isToday && "bg-blue-50/30",
                                isSelected && "ring-2 ring-blue-500 ring-inset z-10"
                            )}
                            onClick={() => onDayClick(day)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={cn(
                                    "text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                                    isToday ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-700",
                                    !isCurrentMonth && "text-slate-300"
                                )}>
                                    {format(day, 'd')}
                                </span>
                                {dayBookings.length > 0 && (
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-tighter">
                                        {dayBookings.length} {dayBookings.length === 1 ? 'Job' : 'Jobs'}
                                    </span>
                                )}
                            </div>
                            
                            <div className="space-y-1.5 overflow-y-auto max-h-[85px] scrollbar-hide">
                                {dayBookings.slice(0, 3).map((booking) => (
                                    <div 
                                        key={booking.id}
                                        className={cn(
                                            "text-[10px] p-2 rounded-xl border transition-all duration-200 hover:scale-[1.02] truncate",
                                            booking.status === 'ACCEPTED' ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100" :
                                            booking.status === 'IN_PROGRESS' ? "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100" :
                                            "bg-slate-50 text-slate-600 border-slate-100"
                                        )}
                                    >
                                        <div className="flex items-center gap-1 font-bold">
                                            <div className={cn(
                                                "w-1 h-1 rounded-full",
                                                booking.status === 'ACCEPTED' ? "bg-emerald-500" :
                                                booking.status === 'IN_PROGRESS' ? "bg-blue-500" : "bg-slate-400"
                                            )}></div>
                                            {booking.timeSlot || 'Anytime'}
                                        </div>
                                        <div className="truncate opacity-80 mt-0.5">{booking.service?.name || 'General Service'}</div>
                                    </div>
                                ))}
                                {dayBookings.length > 3 && (
                                    <div className="text-[9px] text-center font-bold text-slate-400 py-1">
                                        + {dayBookings.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarGrid;
