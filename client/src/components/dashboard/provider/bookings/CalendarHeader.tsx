import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarHeaderProps {
    currentMonth: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
    currentMonth, 
    onPrevMonth, 
    onNextMonth, 
    onToday 
}) => {
    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                    <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium tracking-wide">Your service schedule at a glance</p>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                <button
                    onClick={onPrevMonth}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1"></div>
                <button
                    onClick={onToday}
                    className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                    Today
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1"></div>
                <button
                    onClick={onNextMonth}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CalendarHeader;
