import React, { useEffect, useState } from 'react';
import { Plus, Car, Loader2, AlertCircle } from 'lucide-react';
import OwnerSidebar from '../../../components/dashboard/owner/layout/OwnerSidebar';
import VehicleCard from '../../../components/dashboard/owner/vehicles/VehicleCard';
import AddVehicleForm from '../../../components/vehicles/AddVehicleForm';
import { vehicleApi } from '../../../api/vehicle.api';
import type { Vehicle } from '../../../api/vehicle.api';

const MyVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleApi.getMyVehicles();
      setVehicles(data);
    } catch (err) {
      setError('Failed to load your garage. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <OwnerSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">My Garage</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Manage your registered vehicles</p>
          </div>
          <button 
            onClick={() => setIsAddVehicleModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={18} />
            Add New Vehicle
          </button>
        </header>

        <div className="p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-2 mb-6">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading your garage...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-white/10 rounded-3xl p-20 text-center flex flex-col items-center group cursor-pointer hover:border-blue-500/30 transition-all" onClick={() => setIsAddVehicleModalOpen(true)}>
              <div className="inline-flex p-4 bg-slate-800/50 rounded-2xl mb-4 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all">
                <Car className="text-slate-600 group-hover:text-blue-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">Your garage is empty</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">You haven't added any vehicles yet. Add a vehicle to start booking services with trusted providers.</p>
              <button className="mt-6 text-blue-400 font-bold text-sm hover:text-blue-300 flex items-center gap-2">
                <Plus size={16} /> Add your first vehicle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Vehicle Modal */}
      {isAddVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddVehicleModalOpen(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-black/20">
              <h2 className="text-xl font-bold text-white tracking-tight">Add New Vehicle</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Register a new car to your AutoFix garage</p>
            </div>
            <div className="p-6">
              <AddVehicleForm 
                onAdded={() => {
                  setIsAddVehicleModalOpen(false);
                  fetchVehicles();
                }}
                onCancel={() => setIsAddVehicleModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVehicles;
