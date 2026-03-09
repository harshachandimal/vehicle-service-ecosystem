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
        <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-md rounded-xl p-5 border border-white/40 shadow-sm mt-3">
            <div className="flex items-center gap-2 mb-4 text-dark font-medium">
                <Car size={18} className="text-primary" />
                Add New Vehicle
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Toyota"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={formData.make}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Corolla"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                        type="number"
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. ABC-1234"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"
                        value={formData.licensePlate}
                        onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                    />
                </div>
            </div>

            <div className="flex gap-3 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary text-sm px-6 flex items-center gap-2"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save Vehicle'}
                </button>
            </div>
        </form>
    );
}
