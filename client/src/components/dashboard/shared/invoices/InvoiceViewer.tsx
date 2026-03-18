import React, { useState, useEffect } from 'react';
import { invoiceApi, type Invoice } from '../../../../api/invoice.api';
import { CheckCircle, CreditCard, Receipt, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { socketClient } from '../../../../utils/socket';

interface Props {
    bookingId: string;
    isOwner: boolean;
    onClose: () => void;
}

export const InvoiceViewer: React.FC<Props> = ({ bookingId, isOwner, onClose }) => {
    const { user } = useAuth();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [finalizing, setFinalizing] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            const data = await invoiceApi.getInvoice(bookingId);
            setInvoice(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bookingId) {
            fetchInvoice();
        }

        if (user?.id) {
            socketClient.connect();
            socketClient.join(user.id);

            const handleUpdate = (data: any) => {
                if (data.bookingId === bookingId || data.invoiceId === invoice?.id) {
                    console.log('🔄 Invoice update received via socket');
                    fetchInvoice();
                }
            };

            socketClient.on('invoice_updated', handleUpdate);

            return () => {
                socketClient.off('invoice_updated', handleUpdate);
            };
        }
    }, [bookingId, user?.id, invoice?.id]);

    const handlePay = async () => {
        if (!invoice) return;
        try {
            setPaying(true);
            const updated = await invoiceApi.payInvoice(invoice.id);
            setInvoice({ ...invoice, status: updated.status });
        } catch (err) {
            alert('Payment failed');
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"><Loader2 className="animate-spin text-white w-8 h-8" /></div>;
    if (!invoice) return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                <p className="text-gray-600 mb-4 font-medium">Invoice not yet generated.</p>
                <button onClick={onClose} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black font-medium">Close</button>
            </div>
        </div>
    );

    const isPaid = invoice.status === 'PAID';
    const isPending = invoice.status === 'PAYMENT_PENDING';
    const isDraft = invoice.status === 'DRAFT';

    const handleConfirm = async () => {
        if (!invoice) return;
        try {
            setConfirming(true);
            await invoiceApi.confirmPayment(invoice.id);
            await fetchInvoice();
        } catch (err) {
            alert('Failed to confirm payment');
        } finally {
            setConfirming(false);
        }
    };

    const handleFinalize = async () => {
        if (!invoice) return;
        try {
            setFinalizing(true);
            await invoiceApi.finalizeInvoice(invoice.id);
            await fetchInvoice(); // Refresh state
        } catch (err) {
            alert('Failed to finalize invoice');
        } finally {
            setFinalizing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-white/50 relative">
                <div className="p-8 pb-10 border-b-2 border-dashed border-gray-300">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-900"><Receipt className="text-gray-500" /> Receipt</h3>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">ID: {invoice.id.slice(0, 8)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase shadow-sm ${
                            isPaid ? 'bg-green-100 text-green-700 border border-green-200' : 
                            isPending ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                            {invoice.status.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="space-y-4 my-6">
                        {invoice.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm text-gray-700">
                                <span>{item.description} {item.quantity > 1 ? <span className="text-gray-400 text-xs">x{item.quantity}</span> : ''}</span>
                                <span className="font-semibold text-gray-900">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-5 flex justify-between items-end mt-6">
                        <span className="text-gray-500 font-medium text-sm">Total Amount</span>
                        <span className="text-2xl font-bold text-gray-900">Rs. {Number(invoice.amount).toFixed(2)}</span>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 flex flex-col gap-3">
                    {!isOwner && isDraft && (
                        <button onClick={handleFinalize} disabled={finalizing} className="w-full py-3.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                            {finalizing ? <Loader2 className="animate-spin" size={20} /> : <><Lock size={20} /> Finalise Invoice</>}
                        </button>
                    )}
                    
                    {isPending && isOwner && (
                        <div className="w-full py-4 bg-amber-50 text-amber-700 rounded-xl font-medium flex flex-col items-center justify-center gap-2 border border-amber-200 shadow-inner italic text-sm text-center px-4">
                            <Loader2 className="animate-spin text-amber-500" size={24} />
                            Waiting for provider to confirm your payment...
                        </div>
                    )}

                    {isPending && !isOwner && (
                        <button onClick={handleConfirm} disabled={confirming} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                            {confirming ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} /> Confirm Payment Received</>}
                        </button>
                    )}

                    {!isPaid && !isPending && !isDraft && isOwner && (
                        <button onClick={handlePay} disabled={paying} className="w-full py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                            {paying ? <Loader2 className="animate-spin" size={20} /> : <><CreditCard size={20} /> Pay Now Rs. {Number(invoice.amount).toFixed(2)}</>}
                        </button>
                    )}
                    {isPaid && (
                        <div className="w-full py-3 bg-green-50 text-green-700 rounded-xl font-medium flex items-center justify-center gap-2 border border-green-200 shadow-inner">
                            <CheckCircle size={20} /> Payment Successful
                        </div>
                    )}
                    <button onClick={onClose} className="w-full py-3 text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 rounded-xl font-medium transition-colors">
                        Close Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};
