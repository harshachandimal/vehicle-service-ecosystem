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
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group cursor-pointer flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        {vehicle.photoUrl ? (
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
            <img 
              src={vehicle.photoUrl.startsWith('http') ? vehicle.photoUrl : `${API_URL}${vehicle.photoUrl}`} 
              alt={vehicle.model} 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <div className="p-2.5 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 group-hover:scale-110 transition-all shrink-0">
            <Car className="text-blue-400" size={20} />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors truncate">
            {vehicle.year} {vehicle.make}
          </h3>
          <p className="text-slate-500 text-xs font-medium truncate">{vehicle.model}</p>
        </div>
      </div>
      
      <div className="mt-auto space-y-4">
        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 group-hover:bg-blue-500/5 group-hover:border-blue-500/10 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Plate</span>
            <span className="text-xs font-mono text-blue-300/80 font-bold tracking-tighter group-hover:text-blue-300 transition-colors uppercase">{vehicle.licensePlate}</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
          <Eye size={14} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
