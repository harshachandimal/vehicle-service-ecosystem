import type { BookingResponse } from '../../api/booking.api';
import { useAuth } from '../../hooks/useAuth';

interface BookingActionsProps {
    booking: BookingResponse;
    canStartService: boolean;
    onStatusUpdate: (id: string, newStatus: string) => void;
    compact?: boolean;
}

export default function BookingActions({ booking, canStartService, onStatusUpdate, compact }: BookingActionsProps) {
    const { status } = booking;
    const { user } = useAuth();
    const isProvider = user?.role === 'PROVIDER';

    return (
        <div className="mt-auto pt-2 flex flex-col gap-3">
            <div className="flex gap-3">
                {status === 'PENDING' && isProvider && (
                    <>
                        <button
                            onClick={() => onStatusUpdate(booking.id, 'ACCEPTED')}
                            className={`bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] font-semibold transition-all duration-300 active:scale-[0.98] ${compact ? 'px-4 py-2 rounded-lg text-sm' : 'flex-1 px-8 py-2.5 rounded-xl min-w-[140px]'}`}
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => onStatusUpdate(booking.id, 'REJECTED')}
                            className={`bg-white border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-semibold transition-all duration-300 active:scale-[0.98] ${compact ? 'px-4 py-1.5 rounded-lg text-sm' : 'flex-1 px-8 py-2.5 rounded-xl min-w-[140px]'}`}
                        >
                            Reject
                        </button>
                    </>
                )}
                {status === 'ACCEPTED' && isProvider && (
                    <button
                        onClick={() => onStatusUpdate(booking.id, 'IN_PROGRESS')}
                        disabled={!canStartService}
                        title={!canStartService ? "Service cannot be started before the scheduled time" : "Start handling this service"}
                        className={`font-semibold transition-all duration-300 ${compact ? 'px-4 py-2 rounded-lg text-sm' : 'w-full px-12 py-2.5 rounded-xl min-w-[220px]'} ${
                            canStartService 
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] active:scale-[0.98]"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        {canStartService ? "Start Service" : "Waiting for Time"}
                    </button>
                )}
                {status === 'IN_PROGRESS' && isProvider && (
                    <button
                        onClick={() => onStatusUpdate(booking.id, 'COMPLETED')}
                        className={`bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] font-semibold transition-all duration-300 active:scale-[0.98] ${compact ? 'px-4 py-2 rounded-lg text-sm' : 'w-full px-12 py-2.5 rounded-xl min-w-[220px]'}`}
                    >
                        Finish
                    </button>
                )}
            </div>
        </div>
    );
}
