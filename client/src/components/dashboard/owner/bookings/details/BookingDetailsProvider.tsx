import React from 'react';
import { User, Mail } from 'lucide-react';

interface Props {
  provider?: {
    name: string;
    email: string;
  };
}

export const BookingDetailsProvider: React.FC<Props> = ({ provider }) => {
  if (!provider) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
          <User size={18} />
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Service Provider</h3>
      </div>
      <div className="space-y-4">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <p className="text-lg font-bold text-white mb-3">{provider.name}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Mail size={14} className="text-slate-500" />
              <span>{provider.email}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
