import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    error: string;
}

export const ProviderBookingError: React.FC<Props> = ({ error }) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <main className="flex-1 p-8 md:p-12 lg:p-16">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center max-w-2xl mx-auto mt-12">
                    <h3 className="text-lg font-bold mb-2">Error</h3>
                    <p>{error || 'Booking not found'}</p>
                    <button 
                        onClick={() => navigate('/dashboard/provider')}
                        className="mt-4 px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </main>
        </div>
    );
};
