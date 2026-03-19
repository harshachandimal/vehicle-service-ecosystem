import { LayoutList, Calendar as CalendarIcon, Search } from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface DashboardControlsProps {
    viewMode: 'list' | 'calendar';
    setViewMode: (mode: 'list' | 'calendar') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function DashboardControls({ 
    viewMode, 
    setViewMode, 
    searchQuery, 
    setSearchQuery 
}: DashboardControlsProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Schedule</h2>
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                            viewMode === 'list' 
                                ? "bg-white text-blue-600 shadow-md ring-1 ring-slate-200" 
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                    >
                        <LayoutList className="w-4 h-4" />
                        <span>List</span>
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                            viewMode === 'calendar' 
                                ? "bg-white text-blue-600 shadow-md ring-1 ring-slate-200" 
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        <span>Calendar</span>
                    </button>
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full md:w-80 pl-11 pr-4 py-3 border-transparent rounded-2xl leading-5 bg-white shadow-sm ring-1 ring-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                />
            </div>
        </div>
    );
}
