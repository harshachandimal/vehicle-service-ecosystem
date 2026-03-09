import type { ServiceListItem } from '../../api/services.api';

interface ServiceSummaryCardProps {
    service: ServiceListItem | null;
}

export default function ServiceSummaryCard({ service }: ServiceSummaryCardProps) {
    if (!service) return null;
    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
            <div>
                <h3 className="font-semibold text-dark">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.providerName}</p>
            </div>
            <div className="text-right">
                <div className="text-lg font-bold text-primary">LKR {Number(service.price).toLocaleString()}</div>
                <div className="text-xs text-gray-500">Est. {service.duration} mins</div>
            </div>
        </div>
    );
}
