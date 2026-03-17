export default function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, { bg: string, text: string, dot: string }> = {
        PENDING: { bg: 'bg-amber-100/80', text: 'text-amber-800', dot: 'bg-amber-500' },
        ACCEPTED: { bg: 'bg-emerald-100/80', text: 'text-emerald-800', dot: 'bg-emerald-500' },
        IN_PROGRESS: { bg: 'bg-cyan-100/80', text: 'text-cyan-800', dot: 'bg-cyan-500' },
        COMPLETED: { bg: 'bg-blue-100/80', text: 'text-blue-800', dot: 'bg-blue-500' },
        REJECTED: { bg: 'bg-rose-100/80', text: 'text-rose-800', dot: 'bg-rose-500' },
        CANCELLED: { bg: 'bg-slate-100/80', text: 'text-slate-800', dot: 'bg-slate-500' },
    };

    const config = styles[status] || styles.CANCELLED;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${config.bg} ${config.text} border border-white shadow-sm`}>
            {status === 'PENDING' ? (
                <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
                </span>
            ) : (
                <span className={`rounded-full h-2 w-2 shadow-sm ${config.dot}`}></span>
            )}
            {status}
        </span>
    );
}
