import React from 'react';
import { User, Phone } from 'lucide-react';

interface Props {
    ownerName?: string;
    ownerPhone?: string | null;
}

export const ProviderCustomerInfo: React.FC<Props> = ({ ownerName, ownerPhone }) => {
    return (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" /> Customer Details
            </h3>
            <div className="space-y-4">
                <div>
                    <span className="text-sm font-medium text-slate-500 block mb-1">Name</span>
                    <span className="font-semibold text-slate-700 text-lg">{ownerName || "Unknown Customer"}</span>
                </div>
                {ownerPhone && (
                    <div>
                        <span className="text-sm font-medium text-slate-500 block mb-1">Contact</span>
                        <span className="font-semibold text-slate-700 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" /> {ownerPhone}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
