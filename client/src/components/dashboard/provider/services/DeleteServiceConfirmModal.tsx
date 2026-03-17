import { AlertTriangle, X } from 'lucide-react';

interface DeleteServiceConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    serviceName: string;
}

export default function DeleteServiceConfirmModal({ isOpen, onClose, onConfirm, serviceName }: DeleteServiceConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl shadow-red-900/10 border border-white animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-end p-4">
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="px-8 pb-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Delete Service?</h3>
                    <p className="text-slate-500 mb-8 font-medium">
                        Are you sure you want to remove <span className="text-slate-900 font-bold">"{serviceName}"</span>? This action cannot be undone.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-4 bg-red-600 text-white font-bold rounded-[20px] shadow-lg shadow-red-500/20 hover:bg-red-700 hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            Yes, Delete Service
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 text-slate-500 font-bold rounded-[20px] hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
