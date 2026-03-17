import { Receipt } from 'lucide-react';

export default function InvoiceBadge({ status }: { status: string }) {
    const styles: Record<string, { bg: string, text: string, border: string }> = {
        DRAFT: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
        UNPAID: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
        PAID: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' }
    };

    const config = styles[status] || styles.DRAFT;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${config.bg} ${config.text} border ${config.border} shadow-sm`}>
            <Receipt className="w-3 h-3" /> {status}
        </span>
    );
}
