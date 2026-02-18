import Input from '../../components/ui/Input';

/**
 * Details section props
 */
interface DetailsSectionProps {
    /** Form data */
    formData: {
        businessDescription: string;
        registrationNumber: string;
    };
    /** Field change handler */
    onChange: (field: string, value: string) => void;
}

/**
 * Business details form section
 * @param props - Component props
 * @returns DetailsSection component
 */
export default function DetailsSection({ formData, onChange }: DetailsSectionProps) {
    return (
        <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-bold text-dark flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                    3
                </span>
                Business Details
            </h3>

            <div>
                <label className="block text-sm font-medium text-dark mb-2">Business Description</label>
                <textarea
                    className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-primary outline-none resize-none"
                    rows={3}
                    placeholder="Tell customers about your business, experience, and services..."
                    value={formData.businessDescription}
                    onChange={(e) => onChange('businessDescription', e.target.value)}
                />
            </div>

            <Input
                label="Business Registration Number"
                placeholder="Optional: BR12345678 or N/A for certificate"
                value={formData.registrationNumber}
                onChange={(e) => onChange('registrationNumber', e.target.value)}
            />
        </div>
    );
}
