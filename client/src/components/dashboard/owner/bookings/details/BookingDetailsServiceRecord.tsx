import React from 'react';
import { Gauge, FileText } from 'lucide-react';

interface Props {
    currentMileage?: number | null;
    serviceNote?: string | null;
}

export const BookingDetailsServiceRecord: React.FC<Props> = ({ currentMileage, serviceNote }) => {
    if (!currentMileage && !serviceNote) return null;

    return (
        <div className="border-t border-white/5 px-8 py-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Service Record
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentMileage != null && (
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-blue-500/10">
                            <Gauge className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-0.5">Mileage at Service</p>
                            <p className="text-white font-semibold text-sm">
                                {currentMileage.toLocaleString()} km
                            </p>
                        </div>
                    </div>
                )}
                {serviceNote && (
                    <div className="flex items-start gap-3 md:col-span-2">
                        <div className="mt-0.5 p-2 rounded-lg bg-emerald-500/10">
                            <FileText className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-0.5">Service Notes</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{serviceNote}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
