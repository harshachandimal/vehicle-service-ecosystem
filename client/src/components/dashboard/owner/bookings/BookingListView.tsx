import React, { useState } from 'react';
import type { BookingResponse } from '../../../../api/booking.api';
import BookingRow from './BookingRow';

interface BookingListViewProps {
    bookings: BookingResponse[];
    onViewInvoice: (bookingId: string) => void;
}

type TabType = 'ALL' | 'PENDING' | 'ACTIVE' | 'COMPLETED';

const BookingListView: React.FC<BookingListViewProps> = ({ bookings, onViewInvoice }) => {
    const [activeTab, setActiveTab] = useState<TabType>('ACTIVE');

    const filterBookings = (tab: TabType) => {
        switch (tab) {
            case 'PENDING': return bookings.filter(b => b.status === 'PENDING');
            case 'ACTIVE': return bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS');
            case 'COMPLETED': return bookings.filter(b => b.status === 'COMPLETED');
            default: return bookings;
        }
    };

    const filteredBookings = filterBookings(activeTab);

    const tabs: { type: TabType; label: string }[] = [
        { type: 'ALL', label: 'All History' },
        { type: 'PENDING', label: 'Pending' },
        { type: 'ACTIVE', label: 'Active Services' },
        { type: 'COMPLETED', label: 'Completed' },
    ];

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
            {/* Tabs */}
            <div className="flex border-b border-white/5 p-2 bg-black/20">
                {tabs.map((tab) => (
                    <button
                        key={tab.type}
                        onClick={() => setActiveTab(tab.type)}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                            activeTab === tab.type 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-black/10">
                    <tr>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Provider & Service</th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule</th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vehicle</th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <BookingRow 
                                key={booking.id} 
                                booking={booking} 
                                onViewInvoice={onViewInvoice}
                                onViewDetails={(id) => console.log('View details', id)}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-20 text-center">
                                <div className="flex flex-col items-center">
                                    <p className="text-slate-500 font-medium">No bookings found in this category.</p>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">Try switching tabs or book a new service</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BookingListView;
