import React, { useState } from 'react';
import { Receipt } from 'lucide-react';
import BookingActions from '../BookingActions';
import { GenerateInvoiceModal } from '../../invoices/GenerateInvoiceModal';
import { InvoiceViewer } from '../../../shared/invoices/InvoiceViewer';
import { type BookingResponse } from '../../../../../api/booking.api';

interface Props {
    booking: BookingResponse;
    status: string;
    isProvider: boolean;
    isOwner: boolean;
    canStartService: boolean;
    onStatusUpdate: (id: string, status: string) => void;
    onInvoiceSuccess: () => void;
}

export const ProviderBookingFooter: React.FC<Props> = ({ booking, status, isProvider, isOwner, canStartService, onStatusUpdate, onInvoiceSuccess }) => {
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    return (
        <div className="border-t border-slate-100 pt-8 mt-auto flex flex-col md:flex-row gap-4 items-center justify-end">
            <div className="w-full md:w-auto">
                <BookingActions booking={booking} canStartService={canStartService} onStatusUpdate={onStatusUpdate} />
            </div>
            
            <div className="flex w-full md:w-auto gap-3">
                {status === 'COMPLETED' && isProvider && (!booking.invoice || booking.invoice.status === 'DRAFT') && (
                    <button
                        onClick={() => setIsGenerateOpen(true)}
                        className="flex-1 md:flex-none px-6 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Receipt size={18} /> {booking.invoice ? "Edit Invoice" : "Create Invoice"}
                    </button>
                )}
                {status === 'COMPLETED' && booking.invoice && (
                    <button
                        onClick={() => setIsViewerOpen(true)}
                        className="flex-1 md:flex-none px-6 bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Receipt size={18} /> View Invoice
                    </button>
                )}
            </div>

            <GenerateInvoiceModal 
                isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} 
                bookingId={booking.id} invoiceId={booking.invoice?.id} onSuccess={onInvoiceSuccess} 
            />
            
            {isViewerOpen && (
                <InvoiceViewer bookingId={booking.id} isOwner={isOwner} onClose={() => setIsViewerOpen(false)} />
            )}
        </div>
    );
};
