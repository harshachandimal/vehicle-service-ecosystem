interface TabButtonProps {
    label: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
    activeColor: string;
}

export default function TabButton({ label, count, isActive, onClick, activeColor }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200
                ${isActive 
                    ? `${activeColor} shadow-sm ring-1 ring-inset ring-black/5` 
                    : 'bg-white/60 text-slate-500 hover:bg-white/90 hover:text-slate-700 hover:shadow-sm border border-white'}
            `}
        >
            <span>{label}</span>
            <span className={`
                flex items-center justify-center min-w-[24px] h-[24px] px-1.5 rounded-full text-xs font-bold
                ${isActive ? 'bg-white/50' : 'bg-slate-200/70 text-slate-600'}
            `}>
                {count}
            </span>
        </button>
    );
}
