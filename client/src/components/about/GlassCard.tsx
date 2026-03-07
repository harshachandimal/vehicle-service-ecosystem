import React from 'react';

interface GlassCardProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

export default function GlassCard({ icon: Icon, title, children }: GlassCardProps) {
    return (
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-blue-500/40 hover:bg-white/10 transition-all duration-300 group">
            {/* Blue glow accent */}
            <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
                    <Icon size={20} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            {children}
        </div>
    );
}
