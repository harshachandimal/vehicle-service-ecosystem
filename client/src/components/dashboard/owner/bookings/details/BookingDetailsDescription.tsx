import React from 'react';
import { Wrench } from 'lucide-react';

interface Props {
  description: string;
}

export const BookingDetailsDescription: React.FC<Props> = ({ description }) => {
  return (
    <div className="p-8 border-t border-white/5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
          <Wrench size={18} />
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Service Description</h3>
      </div>
      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-slate-300 leading-relaxed shadow-inner">
        {description}
      </div>
    </div>
  );
};
