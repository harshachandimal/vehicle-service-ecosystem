import React from 'react';
import { Car, Calendar, Hash, CheckCircle2, Tractor as Chassis } from 'lucide-react';
import type { Vehicle } from '../../../../api/vehicle.api';

interface VehicleSpecsSectionProps {
  vehicle: Vehicle;
}

const VehicleSpecsSection: React.FC<VehicleSpecsSectionProps> = ({ vehicle }) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Technical Specifications</h2>
            <p className="text-xs text-slate-500 font-medium">Hardware and identification records</p>
          </div>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Verified Garage</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                <Car size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Manufacturer</p>
                <p className="text-lg font-bold text-white">{vehicle.make}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                <Chassis size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Model variant</p>
                <p className="text-lg font-bold text-white">{vehicle.model}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Registration Year</p>
                <p className="text-lg font-bold text-white">{vehicle.year}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-400 group-hover:scale-110 transition-transform">
                <Hash size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">License Plate</p>
                <p className="text-lg font-mono font-black text-white uppercase tracking-tight">{vehicle.licensePlate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 text-slate-500 mb-6">
            <CheckCircle2 size={16} className="text-slate-600" />
            <p className="text-xs font-medium italic">Added to system on {new Date(vehicle.createdAt).toLocaleDateString()} • Last updated {new Date(vehicle.updatedAt).toLocaleDateString()}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-2xl text-slate-300 font-bold text-sm transition-all">
              Edit Specifications
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl text-red-400 font-bold text-sm transition-all">
              Remove Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSpecsSection;
