import React from 'react';
import { Receipt, X } from 'lucide-react';

interface Props {
    isEditMode: boolean;
    onClose: () => void;
}

export const InvoiceModalHeader: React.FC<Props> = ({ isEditMode, onClose }) => (
    <div className="px-6 py-4 border-b flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Receipt className="text-blue-600" /> {isEditMode ? 'Edit Invoice' : 'Generate Invoice'}
        </h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={20} />
        </button>
    </div>
);
