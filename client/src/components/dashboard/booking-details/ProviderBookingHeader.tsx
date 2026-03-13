import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface Props {
    serviceName: string;
    dateString: string;
    timeSlot?: string | null;
}

export const ProviderBookingHeader: React.FC<Props> = ({ serviceName, dateString, timeSlot }) => {
    return (
        <div className="border-b border-slate-100 pb-8 mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-4">
                {serviceName}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <span>{dateString}</span>
                </div>
                {timeSlot && (
                    <div className="flex items-center gap-2">
                        <div className="bg-amber-50 p-2 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-500" />
                        </div>
                        <span>{timeSlot}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
