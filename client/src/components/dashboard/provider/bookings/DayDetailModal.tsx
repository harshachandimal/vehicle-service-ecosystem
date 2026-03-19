import React from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { X, Clock, Calendar as CalendarIcon } from 'lucide-react';
import type { BookingResponse } from '../../../../api/booking.api';
import TimelineItem from './TimelineItem';

interface DayDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date;
    bookings: BookingResponse[];
}

const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const DayDetailModal: React.FC<DayDetailModalProps> = ({ isOpen, onClose, date, bookings }) => {
    if (!isOpen) return null;

    const dayBookings = bookings.filter(booking => {
        const bookingDate = parseISO(booking.serviceDate);
        return isSameDay(bookingDate, date) && (booking.status === 'ACCEPTED' || booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED');
    });

    const getBookingsForSlot = (slot: string) => {
        return dayBookings.filter(b => b.timeSlot === slot);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden border border-white flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white relative">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <CalendarIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{format(date, 'EEEE, MMMM do')}</h2>
                                <p className="text-blue-100 font-medium opacity-90">{dayBookings.length} {dayBookings.length === 1 ? 'appointment' : 'appointments'} scheduled</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                        <div className="space-y-8">
                            {TIME_SLOTS.map((slot) => (
                                <TimelineItem 
                                    key={slot} 
                                    slot={slot} 
                                    bookings={getBookingsForSlot(slot)} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>All times in local time</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span>Working Hours: 9 AM - 5 PM</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayDetailModal;
