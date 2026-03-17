import React from 'react';
import { Calendar, Car, Wrench, Eye, FileText } from 'lucide-react';
import type { BookingResponse } from '../../../../api/booking.api';

interface BookingRowProps {
    booking: BookingResponse;
    onViewInvoice: (bookingId: string) => void;
    onViewDetails: (bookingId: string) => void;
}

const BookingRow: React.FC<BookingRowProps> = ({ booking, onViewInvoice, onViewDetails }) => {
    const statusColors: Record<string, string> = {
        PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        ACCEPTED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        IN_PROGRESS: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        COMPLETED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
        CANCELLED: 'bg-slate-700/30 text-slate-500 border-slate-700/50',
    };

    const colorClass = statusColors[booking.status] || statusColors.PENDING;

    return (
        <tr className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
            <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                        <Wrench size={16} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                            {booking.provider?.name || 'Harsha Garage'}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{booking.service?.name || 'General Service'}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={14} className="text-slate-600" />
                    <span className="text-xs font-medium">
                        {new Date(booking.serviceDate).toLocaleDateString()}
                        <span className="text-slate-600 ml-1">· {booking.timeSlot || 'Anytime'}</span>
                    </span>
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                    <Car size={14} className="text-blue-500/50" />
                    <span className="text-xs text-slate-300 font-medium">
                        {booking.vehicle?.make} {booking.vehicle?.model}
                    </span>
                    <span className="text-[10px] font-mono bg-white/5 text-slate-500 px-1.5 py-0.5 rounded border border-white/5">
                        {booking.vehicle?.licensePlate}
                    </span>
                </div>
            </td>
            <td className="py-4 px-6">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
                    {booking.status}
                </span>
            </td>
            <td className="py-4 px-6 text-right">
                {booking.status === 'COMPLETED' ? (
                    <button 
                        onClick={() => onViewInvoice(booking.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-blue-500/20 shadow-lg shadow-blue-500/5"
                    >
                        <FileText size={14} /> View Invoice
                    </button>
                ) : (
                    <button 
                        onClick={() => onViewDetails(booking.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-lg text-xs font-bold transition-all border border-white/10"
                    >
                        <Eye size={14} /> Details
                    </button>
                )}
            </td>
        </tr>
    );
};

export default BookingRow;
