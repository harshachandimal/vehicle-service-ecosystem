import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

/**
 * Callout component to direct service providers to business registration
 * @returns ProviderCallout component
 */
export default function ProviderCallout() {
    return (
        <div className="bg-blue-50 border-2 border-primary/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
                <Building2 className="text-primary mt-0.5" size={20} />
                <div className="flex-1">
                    <h3 className="font-semibold text-dark mb-1">Are you a service provider?</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        If you want to offer automotive services, register your business with our dedicated signup process.
                    </p>
                    <Link to="/register/business" className="text-primary text-sm font-semibold hover:underline">
                        Create Business Account →
                    </Link>
                </div>
            </div>
        </div>
    );
}
