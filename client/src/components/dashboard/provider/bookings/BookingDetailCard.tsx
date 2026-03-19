import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Car, User } from 'lucide-react';
import type { BookingResponse } from '../../../../api/booking.api';
import { cn } from '../../../../utils/cn';

interface BookingDetailCardProps {
    booking: BookingResponse;
}

const BookingDetailCard: React.FC<BookingDetailCardProps> = ({ booking }) => {
    const navigate = useNavigate();

    const handleNavigate = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent modal from potential closing/bubbling issues
        navigate(`/dashboard/provider/bookings/${booking.id}`);
    };

    return (
        <div className={cn(
            "p-5 rounded-3xl border transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 group/card",
            booking.status === 'ACCEPTED' ? "bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50" :
            booking.status === 'IN_PROGRESS' ? "bg-blue-50/50 border-blue-100 hover:bg-blue-50" :
            "bg-slate-50/80 border-slate-100 hover:bg-slate-50"
        )}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                            booking.status === 'ACCEPTED' ? "bg-emerald-100 text-emerald-700" :
                            booking.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-700" :
                            "bg-slate-200 text-slate-600"
                        )}>
                            {booking.status.replace('_', ' ')}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover/card:text-blue-600 transition-colors">
                        {booking.service?.name || 'General Service'}
                    </h3>
                </div>
                <button 
                    onClick={handleNavigate}
                    className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-blue-50 hover:border-blue-100 group/btn"
                >
                    <ChevronRight size={16} className="text-slate-400 group-hover/btn:text-blue-600 transition-colors" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        <Car className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle</p>
                        <p className="text-xs font-bold text-slate-700">
                            {booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                        <p className="text-xs font-bold text-slate-700">{booking.vehicle?.ownerName || 'Guest User'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailCard;
