import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import OwnerSidebar from '../../../components/dashboard/owner/layout/OwnerSidebar';
import VehiclePhotosSection from '../../../components/dashboard/owner/vehicles/VehiclePhotosSection';
import VehicleSpecsSection from '../../../components/dashboard/owner/vehicles/VehicleSpecsSection';
import { useVehicleDetails } from '../../../hooks/useVehicleDetails';

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    vehicle,
    loading,
    error,
    uploading,
    imageSuccess,
    updatePhoto
  } = useVehicleDetails(id);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#020617]">
        <OwnerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-medium">Fetching details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex min-h-screen bg-[#020617]">
        <OwnerSidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="p-4 bg-red-500/10 rounded-full mb-4">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Vehicle</h2>
          <p className="text-slate-400 max-w-md mb-8">{error || 'Vehicle not found'}</p>
          <button 
            onClick={() => navigate('/dashboard/owner/vehicles')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"
          >
            <ArrowLeft size={18} /> Back to Garage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <OwnerSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/owner/vehicles')}
            className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{vehicle.make} {vehicle.model}</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Vehicle Details & Documentation</p>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photos & Image Management */}
            <VehiclePhotosSection 
              photoUrl={vehicle.photoUrl}
              model={vehicle.model}
              uploading={uploading}
              imageSuccess={imageSuccess}
              onUpload={updatePhoto}
            />

            {/* Technical Specifications */}
            <VehicleSpecsSection vehicle={vehicle} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default VehicleDetails;
