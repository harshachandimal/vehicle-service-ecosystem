import { Link } from 'react-router-dom';
import type { BookingResponse } from '../../../../api/booking.api';
import { Calendar, Clock, User, Car, Phone, ChevronRight } from 'lucide-react';
import StatusBadge from '../../shared/common/StatusBadge';
import InvoiceBadge from '../../shared/invoices/InvoiceBadge';
import BookingActions from './BookingActions';
import { isServiceTimePassed } from '../../../../utils/date.util';

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
        <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-6 border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-300">
            {/* Service & Schedule (Left Col) */}
            <div className="flex-1 min-w-[200px]">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">
                    {service?.name || "General Service"}
                </h3>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400" /> <span>{date}</span>
                    {booking.timeSlot && (
                        <>
                            <span className="mx-1 text-slate-300">•</span>
                            <Clock className="w-4 h-4 text-slate-400" /> <span>{booking.timeSlot}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Customer Info (Mid Col) */}
            <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                <div className="flex items-center gap-2.5 text-slate-700">
                    <div className="bg-blue-50 p-1.5 rounded-md">
                        <User className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                        <span className="font-semibold text-sm block">{vehicle?.ownerName || "Unknown Customer"}</span>
                        {vehicle?.ownerPhone && (
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-400" /> {vehicle.ownerPhone}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 text-sm font-medium">
                    <div className="bg-slate-100 p-1.5 rounded-md">
                        <Car className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-xs">{vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}` : "Vehicle details not provided"}</span>
                </div>
            </div>

            {/* Status (Mid-Right Col) */}
            <div className="md:w-32 flex flex-col items-start md:items-center justify-center shrink-0 gap-2">
                <StatusBadge status={status} />
                {status === 'COMPLETED' && booking.invoice && (
                    <InvoiceBadge status={booking.invoice.status} />
                )}
            </div>

            {/* Actions (Right Col) */}
            <div className="flex items-center gap-3 shrink-0 mt-4 md:mt-0 ml-auto">
                <BookingActions
                    booking={booking}
                    canStartService={canStartService}
                    onStatusUpdate={onStatusUpdate}
                    compact={true} // new optional prop for list view
                />
                
                {/* View Button Link */}
                <Link 
                    to={`/dashboard/provider/bookings/${booking.id}`}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="View Booking Details"
                >
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
