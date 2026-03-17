import React from 'react';
import { Calendar, Wrench, CreditCard } from 'lucide-react';
import type { BookingResponse } from '../../../../api/booking.api';

interface OwnerBookingCardProps {
    booking: BookingResponse;
    onViewInvoice: (invoiceId: string) => void;
}

const OwnerBookingCard: React.FC<OwnerBookingCardProps> = ({ booking, onViewInvoice }) => {
    const statusColors = {
        PENDING: 'bg-yellow-500/20 text-yellow-400 ring-yellow-400/20',
        ACCEPTED: 'bg-green-500/20 text-green-400 ring-green-400/20',
        IN_PROGRESS: 'bg-blue-500/20 text-blue-400 ring-blue-400/20',
        COMPLETED: 'bg-purple-500/20 text-purple-400 ring-purple-400/20',
        REJECTED: 'bg-red-500/20 text-red-400 ring-red-400/20',
        CANCELLED: 'bg-slate-500/20 text-slate-400 ring-slate-400/20',
    };

    const statusLabel = booking.status;
    const colorClass = statusColors[booking.status as keyof typeof statusColors] || statusColors.PENDING;

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-500/20 rounded-lg">
                        <Wrench size={20} className="text-slate-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{booking.provider?.name || 'Service Provider'}</h3>
                        <p className="text-sm text-slate-400">{booking.service?.name || booking.description}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${colorClass}`}>
                    {statusLabel}
                </span>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar size={16} className="text-blue-400" />
                    <span>{new Date(booking.serviceDate).toLocaleDateString()} at {booking.timeSlot || 'Anytime'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Vehicle:</span>
                    <span className="text-blue-300">{booking.vehicle?.make} {booking.vehicle?.model} ({booking.vehicle?.licensePlate})</span>
                </div>
            </div>

            {booking.invoice && (
                <button
                    onClick={() => onViewInvoice(booking.id)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all ${
                        booking.invoice.status === 'UNPAID'
                            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                >
                    <CreditCard size={18} />
                    View Invoice
                </button>
            )}
        </div>
    );
};

export default OwnerBookingCard;
