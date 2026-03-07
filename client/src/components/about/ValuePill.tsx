import React from 'react';

interface ValuePillProps {
    icon: React.ElementType;
    text: string;
}

export default function ValuePill({ icon: Icon, text }: ValuePillProps) {
    return (
        <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm">
            <Icon size={16} className="text-blue-400 shrink-0" />
            <span className="text-sm font-medium text-slate-200">{text}</span>
        </div>
    );
}
