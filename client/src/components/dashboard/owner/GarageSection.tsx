import React from 'react';
import { Car } from 'lucide-react';
import VehicleCard from './vehicles/VehicleCard';
import type { Vehicle } from '../../../api/vehicle.api';

interface GarageSectionProps {
  vehicles: Vehicle[];
}

const GarageSection: React.FC<GarageSectionProps> = ({ vehicles }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Car className="text-blue-500" size={20} />
        <h2 className="text-lg font-bold text-white tracking-tight">My Garage</h2>
        <span className="bg-slate-800 text-slate-500 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ml-2 tracking-widest">
          {vehicles.length}
        </span>
      </div>
      
      {vehicles.length === 0 ? (
        <div className="bg-slate-900/50 border border-dashed border-white/10 rounded-3xl p-10 text-center group">
          <div className="inline-flex p-3 bg-slate-800/50 rounded-xl mb-3">
            <Car className="text-slate-600" size={24} />
          </div>
          <h3 className="text-sm font-bold text-white">No vehicles yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">Add your first vehicle to start scheduling services.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </section>
  );
};

export default GarageSection;
