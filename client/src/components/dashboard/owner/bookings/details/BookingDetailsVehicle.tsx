import React from 'react';
import { Car } from 'lucide-react';

interface Props {
  vehicle?: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
}

export const BookingDetailsVehicle: React.FC<Props> = ({ vehicle }) => {
  if (!vehicle) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
          <Car size={18} />
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Vehicle Details</h3>
      </div>
      <div className="space-y-4">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Make & Model</p>
          <p className="text-lg font-bold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">License Plate</p>
          <p className="text-lg font-bold text-blue-400 uppercase tracking-wider">{vehicle.licensePlate}</p>
        </div>
      </div>
    </section>
  );
};
