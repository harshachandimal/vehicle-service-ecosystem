import { useState, useMemo } from 'react';
import type { BookingResponse } from '../../api/booking.api';
import BookingCard from './BookingCard';
import TabButton from './TabButton';
import { Calendar, FilterX } from 'lucide-react';

interface BookingListProps {
    bookings: BookingResponse[];
    onStatusUpdate: (id: string, status: string) => void;
}

export default function BookingList({ bookings, onStatusUpdate }: BookingListProps) {
    const [activeTab, setActiveTab] = useState<'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>('PENDING');

    const pendingBookings = useMemo(() => bookings.filter(b => b.status === 'PENDING'), [bookings]);
    const acceptedBookings = useMemo(() => bookings.filter(b => b.status === 'ACCEPTED'), [bookings]);
    const inProgressBookings = useMemo(() => bookings.filter(b => b.status === 'IN_PROGRESS'), [bookings]);
    const completedBookings = useMemo(() => bookings.filter(b => b.status === 'COMPLETED'), [bookings]);
    const cancelledBookings = useMemo(() => bookings.filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED'), [bookings]);

    const getDisplayedBookings = () => {
        switch (activeTab) {
            case 'PENDING': return pendingBookings;
            case 'ACCEPTED': return acceptedBookings;
            case 'IN_PROGRESS': return inProgressBookings;
            case 'COMPLETED': return completedBookings;
            case 'CANCELLED': return cancelledBookings;
            default: return [];
        }
    };

    const displayedBookings = getDisplayedBookings();

    const getEmptyStateMessage = () => {
        switch (activeTab) {
            case 'PENDING': return 'No pending booking requests right now.';
            case 'ACCEPTED': return 'No accepted services waiting to be started.';
            case 'IN_PROGRESS': return 'No ongoing services at the moment.';
            case 'COMPLETED': return 'No completed services to show yet.';
            case 'CANCELLED': return 'No cancelled or rejected bookings found.';
            default: return 'No bookings available.';
        }
    };

    if (!bookings || bookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-slate-100">
                    <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Bookings Yet</h3>
                <p className="text-slate-500 max-w-sm">When customers book your services, they will appear here seamlessly.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <TabButton 
                    label="Pending Requests" 
                    count={pendingBookings.length} 
                    isActive={activeTab === 'PENDING'} 
                    onClick={() => setActiveTab('PENDING')} 
                    activeColor="bg-amber-100 text-amber-800"
                />
                <TabButton 
                    label="Upcoming" 
                    count={acceptedBookings.length} 
                    isActive={activeTab === 'ACCEPTED'} 
                    onClick={() => setActiveTab('ACCEPTED')} 
                    activeColor="bg-blue-100 text-blue-800"
                />
                <TabButton 
                    label="Ongoing" 
                    count={inProgressBookings.length} 
                    isActive={activeTab === 'IN_PROGRESS'} 
                    onClick={() => setActiveTab('IN_PROGRESS')} 
                    activeColor="bg-cyan-100 text-cyan-800"
                />
                <TabButton 
                    label="Completed" 
                    count={completedBookings.length} 
                    isActive={activeTab === 'COMPLETED'} 
                    onClick={() => setActiveTab('COMPLETED')} 
                    activeColor="bg-emerald-100 text-emerald-800"
                />
                <TabButton 
                    label="Cancelled" 
                    count={cancelledBookings.length} 
                    isActive={activeTab === 'CANCELLED'} 
                    onClick={() => setActiveTab('CANCELLED')} 
                    activeColor="bg-slate-200 text-slate-700"
                />
            </div>

            {/* Content Area */}
            {displayedBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedBookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onStatusUpdate={onStatusUpdate}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                        <FilterX className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">It's quiet here</h3>
                    <p className="text-slate-500 text-sm max-w-sm">{getEmptyStateMessage()}</p>
                </div>
            )}
        </div>
    );
}
