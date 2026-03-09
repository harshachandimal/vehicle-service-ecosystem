import { Car } from 'lucide-react';

import type { Vehicle } from '../../api/vehicle.api';

interface VehicleSelectionProps {
    vehicles: Vehicle[];
    selectedVehicleId: string;
    onVehicleSelect: (id: string) => void;
}

export default function VehicleSelection({
    vehicles,
    selectedVehicleId,
    onVehicleSelect
}: VehicleSelectionProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2 font-semibold text-dark">
                <Car size={18} className="text-primary" />
                Select Vehicle
            </div>

            <div className="flex gap-3">
                <select
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/30 outline-none"
                    value={selectedVehicleId}
                    onChange={(e) => onVehicleSelect(e.target.value)}
                    required
                >
                    <option value="" disabled>Choose a vehicle...</option>
                    {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                            {v.make} {v.model} ({v.year}) - {v.licensePlate}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
