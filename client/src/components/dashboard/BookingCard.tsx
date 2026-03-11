import type { BookingResponse } from '../../api/booking.api';
import { Calendar, Clock, User, Car, Phone } from 'lucide-react';
import StatusBadge from './StatusBadge';
import BookingActions from './BookingActions';
import { isServiceTimePassed } from '../../utils/date.util';

interface BookingCardProps {
    booking: BookingResponse;
    onStatusUpdate: (id: string, newStatus: string) => void;
}

export default function BookingCard({ booking, onStatusUpdate }: BookingCardProps) {
    const { vehicle, service, status } = booking;
    const date = new Date(booking.serviceDate).toLocaleDateString();

    // Determine if start time has passed for this booking
    const canStartService = status === 'ACCEPTED' ? isServiceTimePassed(booking.serviceDate, booking.timeSlot) : false;

    return (
        <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-5 border border-white shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                        {service?.name || "General Service"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" /> <span>{date}</span>
                        {booking.timeSlot && (
                            <>
                                <span className="mx-1 text-slate-300">•</span>
                                <Clock className="w-4 h-4 text-slate-400" /> <span>{booking.timeSlot}</span>
                            </>
                        )}
                    </div>
                </div>
                <StatusBadge status={status} />
            </div>

            {/* Customer & Vehicle Info */}
            <div className="bg-slate-50/70 rounded-2xl p-4 flex flex-col gap-3 border border-slate-100/50">
                <div className="flex items-center gap-3 text-slate-700">
                    <div className="bg-blue-100 p-1.5 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <span className="font-semibold block">{vehicle?.ownerName || "Unknown Customer"}</span>
                        {vehicle?.ownerPhone && (
                            <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-400" /> {vehicle.ownerPhone}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                    <div className="bg-slate-200/50 p-1.5 rounded-lg">
                        <Car className="w-4 h-4 text-slate-500" />
                    </div>
                    <span>{vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}` : "Vehicle details not provided"}</span>
                </div>
            </div>

            {/* Notes */}
            {booking.description && (
                <div className="text-sm border-l-2 border-slate-300 pl-3 py-1 text-slate-600 italic">
                    "{booking.description}"
                </div>
            )}

            {/* Actions */}
            <BookingActions
                booking={booking}
                canStartService={canStartService}
                onStatusUpdate={onStatusUpdate}
            />
        </div>
    );
}
