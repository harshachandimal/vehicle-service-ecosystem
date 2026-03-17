import { Edit2, Trash2, Clock, Truck } from 'lucide-react';
import type { ProviderService } from '../../../api/providers.api';

interface ServiceRowProps {
    service: ProviderService;
    onEdit: (service: ProviderService) => void;
    onDelete: (service: ProviderService) => void;
}

export default function ServiceRow({ service, onEdit, onDelete }: ServiceRowProps) {
    return (
        <div className="group bg-white/80 backdrop-blur-xl rounded-[28px] p-5 border border-white shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6">
            {/* Service Icon */}
            <div className="p-4 bg-blue-50 rounded-2xl flex-shrink-0 w-fit">
                <WrenchIcon className="w-6 h-6 text-blue-600" />
            </div>

            {/* Service Info Main */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    <h3 className="text-xl font-bold text-slate-900 truncate">{service.name}</h3>
                    <div className="flex gap-2">
                        {service.vehicleType && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                                <Truck className="w-3 h-3 mr-1" /> {service.vehicleType}
                            </span>
                        )}
                        {service.duration && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wider">
                                <Clock className="w-3 h-3 mr-1" /> {service.duration} mins
                            </span>
                        )}
                    </div>
                </div>
                {service.description && (
                    <p className="text-slate-500 text-sm line-clamp-1">
                        {service.description}
                    </p>
                )}
            </div>

            {/* Price */}
            <div className="md:px-8 md:border-l md:border-r border-slate-100">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price</div>
                <div className="text-2xl font-black text-blue-600 whitespace-nowrap">
                    LKR {service.price.toLocaleString()}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEdit(service)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-slate-600 font-bold hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100"
                    title="Edit Service"
                >
                    <Edit2 className="w-4 h-4" /> <span className="md:hidden">Edit</span>
                </button>
                <button
                    onClick={() => onDelete(service)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-slate-600 font-bold hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                    title="Delete Service"
                >
                    <Trash2 className="w-4 h-4" /> <span className="md:hidden">Delete</span>
                </button>
            </div>
        </div>
    );
}

function WrenchIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    );
}
