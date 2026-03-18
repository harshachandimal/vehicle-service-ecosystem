import React from 'react';
import { History } from 'lucide-react';

const ServiceHistoryEmpty: React.FC = () => {
  return (
    <div className="bg-slate-900/50 border border-dashed border-white/10 rounded-3xl p-20 text-center flex flex-col items-center">
      <div className="inline-flex p-4 bg-slate-800/50 rounded-2xl mb-4 text-slate-600">
        <History size={32} />
      </div>
      <h3 className="text-lg font-bold text-white">No service history yet</h3>
      <p className="text-slate-500 mt-2 max-w-sm mx-auto">
        Once your service bookings are completed by providers, they will appear here as part of your vehicle's maintenance record.
      </p>
    </div>
  );
};

export default ServiceHistoryEmpty;
