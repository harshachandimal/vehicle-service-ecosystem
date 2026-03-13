import React from 'react';

interface Props {
    description?: string | null;
}

export const ProviderBookingNotes: React.FC<Props> = ({ description }) => {
    return (
        <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Service Notes</h3>
            {description ? (
                <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100/50 text-slate-700 leading-relaxed italic">
                    "{description}"
                </div>
            ) : (
                <p className="text-slate-500 italic">No additional notes provided by the customer.</p>
            )}
        </div>
    );
};
