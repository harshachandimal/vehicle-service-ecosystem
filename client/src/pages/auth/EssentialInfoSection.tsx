import { Building2 } from 'lucide-react';
import Input from '../../components/ui/Input';

/**
 * Essential info section props
 */
interface EssentialInfoSectionProps {
    /** Form data */
    formData: {
        businessName: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
    };
    /** Form validation errors */
    errors: Record<string, string>;
    /** Field change handler */
    onChange: (field: string, value: string) => void;
}

/**
 * Essential business information form section
 * @param props - Component props
 * @returns EssentialInfoSection component
 */
export default function EssentialInfoSection({ formData, errors, onChange }: EssentialInfoSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary mb-3">
                <Building2 size={20} />
                <h3 className="font-bold text-dark">Essential Business Information</h3>
            </div>

            <Input
                label="Business Name"
                placeholder="Ex: AutoFix Garage"
                value={formData.businessName}
                onChange={(e) => onChange('businessName', e.target.value)}
                error={errors.businessName}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Business Email"
                    type="email"
                    placeholder="business@example.com"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    error={errors.email}
                    required
                />
                <Input
                    label="Business Phone"
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={formData.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Password"
                    type="password"
                    placeholder="Create password (min. 8 chars)"
                    value={formData.password}
                    onChange={(e) => onChange('password', e.target.value)}
                    error={errors.password}
                    required
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={(e) => onChange('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    required
                />
            </div>
        </div>
    );
}
