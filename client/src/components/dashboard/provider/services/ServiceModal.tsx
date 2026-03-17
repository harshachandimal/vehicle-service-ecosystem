import { useState, useEffect } from 'react';
import { X, Save, Clock, Truck, FileText } from 'lucide-react';
import type { ProviderService } from '../../../../api/providers.api';

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    service?: ProviderService | null;
}

export default function ServiceModal({ isOpen, onClose, onSave, service }: ServiceModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        vehicleType: 'Car',
        duration: '',
    });

    useEffect(() => {
        if (service) {
            setFormData({
                name: service.name,
                price: service.price.toString(),
                description: service.description || '',
                vehicleType: service.vehicleType || 'Car',
                duration: service.duration?.toString() || '',
            });
        } else {
            setFormData({
                name: '',
                price: '',
                description: '',
                vehicleType: 'Car',
                duration: '',
            });
        }
    }, [service, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            price: parseFloat(formData.price),
            duration: formData.duration ? parseInt(formData.duration) : undefined,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl shadow-slate-900/20 border border-white translate-y-0 opacity-100 transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-8">
                <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                        {service ? 'Edit Service' : 'Add New Service'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2 text-left">
                        <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Service Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
                                <FileText className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Full Service, Oil Change, etc."
                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-700 placeholder-slate-400 font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 text-left">
                            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Price (LKR)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
                                    <span className="text-slate-400 font-bold">Rs.</span>
                                </div>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="5000"
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-700 font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Est. Duration (mins)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
                                    <Clock className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="60"
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-700 font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Target Vehicle Type</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
                                <Truck className="w-5 h-5 text-slate-400" />
                            </div>
                            <select
                                value={formData.vehicleType}
                                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-700 font-semibold appearance-none"
                            >
                                <option value="Car">Car</option>
                                <option value="Van">Van</option>
                                <option value="Truck">Truck</option>
                                <option value="SUV">SUV</option>
                                <option value="Sports Car">Sports Car</option>
                                <option value="Any">Any Vehicle</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Description (Optional)</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Briefly describe what's included in this service..."
                            className="block w-full px-6 py-4 bg-slate-50 border border-transparent rounded-[24px] focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-700 placeholder-slate-400 font-medium resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 text-slate-600 font-bold rounded-[20px] hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 px-6 bg-blue-600 text-white font-bold rounded-[20px] shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" /> Save Service
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
