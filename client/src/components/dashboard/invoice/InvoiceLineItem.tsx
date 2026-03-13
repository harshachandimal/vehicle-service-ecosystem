import React from 'react';
import { X } from 'lucide-react';
import { type InvoiceItem } from '../../../api/invoice.api';

interface Props {
    item: InvoiceItem;
    index: number;
    onUpdate: (index: number, field: keyof InvoiceItem, value: string | number) => void;
    onRemove: (index: number) => void;
}

export const InvoiceLineItem: React.FC<Props> = ({ item, index, onUpdate, onRemove }) => (
    <div className="flex gap-2 items-center group">
        <input
            required
            placeholder="Service Description"
            className="flex-1 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none"
            value={item.description}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
        />
        <input
            required
            type="number"
            min="0"
            step="0.01"
            className="w-28 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none"
            placeholder="Price"
            value={item.price || ''}
            onChange={(e) => onUpdate(index, 'price', Number(e.target.value))}
        />
        <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
            <X size={18} />
        </button>
    </div>
);
