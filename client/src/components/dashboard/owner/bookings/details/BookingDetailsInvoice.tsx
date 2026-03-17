import React from 'react';
import { FileText, CreditCard } from 'lucide-react';

interface Props {
  invoice: {
    id: string;
    status: string;
  };
  onViewInvoice: () => void;
}

export const BookingDetailsInvoice: React.FC<Props> = ({ invoice, onViewInvoice }) => {
  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-green-500/10 rounded-2xl text-green-400 border border-green-500/20">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Service Invoice</h3>
            <p className="text-sm text-slate-500">Invoice ID: #{invoice.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
            invoice.status === 'PAID' 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {invoice.status}
          </div>
          <button 
            onClick={onViewInvoice}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            <CreditCard size={18} />
            View Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
