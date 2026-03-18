import React from 'react';
import { Search } from 'lucide-react';

interface ServiceHistorySearchEmptyProps {
  searchTerm: string;
}

const ServiceHistorySearchEmpty: React.FC<ServiceHistorySearchEmptyProps> = ({ searchTerm }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-slate-600" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No records found</h3>
      <p className="text-slate-400 max-w-xs">
        We couldn't find any service records matching "{searchTerm}".
      </p>
    </div>
  );
};

export default ServiceHistorySearchEmpty;
