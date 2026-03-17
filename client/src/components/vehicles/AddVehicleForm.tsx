import { useState } from 'react';
import { Car, Loader2 } from 'lucide-react';
import { vehicleApi } from '../../api/vehicle.api';
import type { CreateVehicleDTO, Vehicle } from '../../api/vehicle.api';

interface AddVehicleFormProps {
    onAdded: (vehicle: Vehicle) => void;
    onCancel: () => void;
}

export default function AddVehicleForm({ onAdded, onCancel }: AddVehicleFormProps) {
    const [formData, setFormData] = useState<CreateVehicleDTO>({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const vehicle = await vehicleApi.addVehicle({
                ...formData,
                year: Number(formData.year),
            });
            onAdded(vehicle);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add vehicle. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-dark rounded-2xl p-6 border border-white/10 shadow-2xl mt-4 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Car size={20} className="text-primary-light text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight">
                    Add New Vehicle
                </h3>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                        Vehicle Make
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Toyota"
                        className="w-full bg-dark/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300"
                        value={formData.make}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                        Vehicle Model
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Corolla"
                        className="w-full bg-dark/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                        Manufacturing Year
                    </label>
                    <input
                        type="number"
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full bg-dark/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                        License Plate
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. ABC-1234"
                        className="w-full bg-dark/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 uppercase font-mono tracking-widest"
                        value={formData.licensePlate}
                        onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary group relative overflow-hidden text-sm px-8 py-2.5 flex items-center gap-2"
                    disabled={isLoading}
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            <span>Save Vehicle</span>
                            <Car size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
