import React from 'react';
import { Car } from 'lucide-react';

interface Props {
    make?: string;
    model?: string;
    licensePlate?: string;
}

export const ProviderVehicleInfo: React.FC<Props> = ({ make, model, licensePlate }) => {
    const isProvided = make && model;

    return (
        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-400" /> Vehicle Information
            </h3>
            <div className="space-y-4">
                <div>
                    <span className="text-sm font-medium text-slate-500 block mb-1">Make & Model</span>
                    <span className="font-semibold text-slate-700 text-lg">
                        {isProvided ? `${make} ${model}` : "Not provided"}
                    </span>
                </div>
                <div>
                    <span className="text-sm font-medium text-slate-500 block mb-1">License Plate</span>
                    <span className="font-mono bg-white px-3 py-1 rounded-md border border-slate-200 font-bold text-slate-700 inline-block">
                        {licensePlate || "N/A"}
                    </span>
                </div>
            </div>
        </div>
    );
};
