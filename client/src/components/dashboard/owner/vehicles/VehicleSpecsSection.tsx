import React, { useState } from 'react';
import { Car, Calendar, Hash, CheckCircle2, Tractor as Chassis, Save, X } from 'lucide-react';
import type { Vehicle } from '../../../../api/vehicle.api';

interface VehicleSpecsSectionProps {
  vehicle: Vehicle;
  onDelete: () => Promise<void>;
  onUpdate: (data: Partial<Vehicle>) => Promise<any>;
}

const VehicleSpecsSection: React.FC<VehicleSpecsSectionProps> = ({ vehicle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    licensePlate: vehicle.licensePlate,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to remove this ${vehicle.make} ${vehicle.model}? This action cannot be undone.`
    );

    if (confirmed) {
      await onDelete();
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const success = await onUpdate(editForm);
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
    });
    setIsEditing(false);
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Technical Specifications</h2>
            <p className="text-xs text-slate-500 font-medium">Hardware and identification records</p>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                <Save size={14} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Verified Garage</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                <Car size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Manufacturer</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.make}
                    onChange={(e) => setEditForm({ ...editForm, make: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 mt-1 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                ) : (
                  <p className="text-lg font-bold text-white">{vehicle.make}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                <Chassis size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Model variant</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.model}
                    onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 mt-1 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                ) : (
                  <p className="text-lg font-bold text-white">{vehicle.model}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Registration Year</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 mt-1 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                ) : (
                  <p className="text-lg font-bold text-white">{vehicle.year}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-400 group-hover:scale-110 transition-transform">
                <Hash size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">License Plate</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.licensePlate}
                    onChange={(e) => setEditForm({ ...editForm, licensePlate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 mt-1 text-white font-mono focus:outline-none focus:border-blue-500 transition-all uppercase"
                  />
                ) : (
                  <p className="text-lg font-mono font-black text-white uppercase tracking-tight">{vehicle.licensePlate}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 text-slate-500 mb-6">
            <CheckCircle2 size={16} className="text-slate-600" />
            <p className="text-xs font-medium italic">Added to system on {new Date(vehicle.createdAt).toLocaleDateString()} • Last updated {new Date(vehicle.updatedAt).toLocaleDateString()}</p>
          </div>
          
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-2xl text-slate-300 font-bold text-sm transition-all"
              >
                Edit Specifications
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl text-red-400 font-bold text-sm transition-all"
              >
                Remove Vehicle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleSpecsSection;
