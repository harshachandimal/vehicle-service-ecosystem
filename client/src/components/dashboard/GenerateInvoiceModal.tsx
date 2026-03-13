import React from 'react';
import { Plus } from 'lucide-react';
import { useInvoiceForm } from '../../hooks/useInvoiceForm';
import { InvoiceModalHeader } from './invoice/InvoiceModalHeader';
import { InvoiceLineItem } from './invoice/InvoiceLineItem';
import { InvoiceModalFooter } from './invoice/InvoiceModalFooter';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    invoiceId?: string;
    onSuccess: () => void;
}

export const GenerateInvoiceModal: React.FC<Props> = ({ isOpen, onClose, bookingId, invoiceId, onSuccess }) => {
    const { items, loading, fetching, totalAmount, addItem, removeItem, updateItem, handleSubmit, isEditMode } =
        useInvoiceForm({ isOpen, bookingId, invoiceId, onSuccess, onClose });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                <InvoiceModalHeader isEditMode={isEditMode} onClose={onClose} />
                {fetching ? (
                    <div className="p-12 flex justify-center text-blue-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item, index) => (
                                <InvoiceLineItem key={index} item={item} index={index} onUpdate={updateItem} onRemove={removeItem} />
                            ))}
                        </div>
                        <button type="button" onClick={addItem} className="mt-4 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded-md hover:bg-blue-50 transition-colors w-fit">
                            <Plus size={16} /> Add Line Item
                        </button>
                        <InvoiceModalFooter totalAmount={totalAmount} loading={loading} itemCount={items.length} isEditMode={isEditMode} onClose={onClose} />
                    </form>
                )}
            </div>
        </div>
    );
};
