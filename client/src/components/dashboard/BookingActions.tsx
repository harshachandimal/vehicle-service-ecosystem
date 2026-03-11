import type { BookingResponse } from '../../api/booking.api';

interface BookingActionsProps {
    booking: BookingResponse;
    canStartService: boolean;
    onStatusUpdate: (id: string, newStatus: string) => void;
}

export default function BookingActions({ booking, canStartService, onStatusUpdate }: BookingActionsProps) {
    const { status } = booking;

    return (
        <div className="mt-auto pt-2 flex gap-3">
            {status === 'PENDING' && (
                <>
                    <button
                        onClick={() => onStatusUpdate(booking.id, 'ACCEPTED')}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-[0.98]"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => onStatusUpdate(booking.id, 'REJECTED')}
                        className="flex-1 bg-white border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-[0.98]"
                    >
                        Reject
                    </button>
                </>
            )}
            {status === 'ACCEPTED' && (
                <button
                    onClick={() => onStatusUpdate(booking.id, 'IN_PROGRESS')}
                    disabled={!canStartService}
                    title={!canStartService ? "Service cannot be started before the scheduled time" : "Start handling this service"}
                    className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                        canStartService 
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] active:scale-[0.98]"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                >
                    {canStartService ? "Start Service" : "Waiting for Scheduled Time"}
                </button>
            )}
            {status === 'IN_PROGRESS' && (
                <button
                    onClick={() => onStatusUpdate(booking.id, 'COMPLETED')}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-[0.98]"
                >
                    Finish
                </button>
            )}
        </div>
    );
}
