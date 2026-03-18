import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Eye } from 'lucide-react';
import type { Vehicle } from '../../../../api/vehicle.api';
import { API_URL } from '../../../../api/auth.api';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/dashboard/owner/vehicles/${vehicle.id}`)}
      className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden hover:bg-[#1e293b]/60 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group cursor-pointer flex flex-col h-full"
    >
      {/* Hero Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        {vehicle.photoUrl ? (
          <img 
            src={vehicle.photoUrl.startsWith('http') ? vehicle.photoUrl : `${API_URL}${vehicle.photoUrl}`} 
            alt={vehicle.model} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors">
            <Car className="text-blue-500/20 group-hover:text-blue-500/40 group-hover:scale-110 transition-all duration-700" size={64} strokeWidth={1} />
          </div>
        )}
        
        {/* Subtle Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        
        {/* Year Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600/20 backdrop-blur-md border border-white/10 rounded-full">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{vehicle.year}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-6">
          <h3 className="text-xl font-black text-white group-hover:text-blue-300 transition-colors tracking-tight leading-tight">
            {vehicle.make}
          </h3>
          <p className="text-slate-500 text-sm font-semibold tracking-tight uppercase tracking-[0.05em]">{vehicle.model}</p>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Registration</span>
             <span className="text-sm font-mono text-white/80 group-hover:text-blue-300 transition-colors uppercase font-bold">{vehicle.licensePlate}</span>
          </div>
          
          <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 text-slate-500 shadow-xl">
            <Eye size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
