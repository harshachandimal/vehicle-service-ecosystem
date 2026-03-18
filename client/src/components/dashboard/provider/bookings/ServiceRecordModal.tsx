import React, { useState } from 'react';
import { Gauge, FileText, X, AlertCircle } from 'lucide-react';
import { bookingApi } from '../../../../api/booking.api';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    existingMileage?: number | null;
    existingNote?: string | null;
    onSuccess: () => void;
}

export const ServiceRecordModal: React.FC<Props> = ({
    isOpen, onClose, bookingId, existingMileage, existingNote, onSuccess,
}) => {
    const [mileage, setMileage] = useState<string>(existingMileage ? String(existingMileage) : '');
    const [note, setNote] = useState<string>(existingNote ?? '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const parsedMileage = parseInt(mileage, 10);
        if (!mileage || isNaN(parsedMileage) || parsedMileage <= 0) {
            setError('Please enter a valid mileage value.');
            return;
        }
        try {
            setLoading(true);
            await bookingApi.updateServiceRecord(bookingId, parsedMileage, note.trim() || undefined);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to save service record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Service Record</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Enter vehicle details before creating the invoice</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/80 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Mileage Input */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                            <Gauge size={15} className="text-blue-500" />
                            Current Mileage (km)
                            <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={mileage}
                            onChange={e => setMileage(e.target.value)}
                            placeholder="e.g. 45000"
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-gray-400"
                        />
                        <p className="text-xs text-gray-400 mt-1">Record the vehicle's odometer reading at the time of service.</p>
                    </div>

                    {/* Service Note Input */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                            <FileText size={15} className="text-blue-500" />
                            Service Note
                            <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
                        </label>
                        <textarea
                            rows={4}
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Briefly describe the work performed, e.g. 'Full engine oil change with filter replacement, brake pads inspected and found OK.'"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            {loading ? 'Saving...' : 'Save & Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
