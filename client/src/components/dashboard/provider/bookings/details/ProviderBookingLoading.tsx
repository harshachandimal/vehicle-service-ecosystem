import React from 'react';
import { Loader2 } from 'lucide-react';

export const ProviderBookingLoading: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <main className="flex-1 p-8 md:p-12 lg:p-16 flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </main>
        </div>
    );
};
