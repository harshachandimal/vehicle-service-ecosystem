

interface MetricCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    bgClass: string;
    colorClass: string;
}

export default function MetricCard({ title, value, icon, bgClass, colorClass }: MetricCardProps) {
    return (
        <div className="group bg-white/80 w-full backdrop-blur-xl rounded-3xl p-6 border border-white shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700 ease-out bg-current ${colorClass}`}></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{title}</p>
                    <p className="text-4xl font-black text-slate-800 mt-2 tracking-tight">{value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${bgClass} shadow-inner border border-white/50`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
