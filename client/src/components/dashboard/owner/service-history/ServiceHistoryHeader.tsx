import React from 'react';
import { Search } from 'lucide-react';

interface ServiceHistoryHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ServiceHistoryHeader: React.FC<ServiceHistoryHeaderProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Service History</h1>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-0.5">View your completed vehicle services</p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-64 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-9 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        />
      </div>
    </header>
  );
};

export default ServiceHistoryHeader;
