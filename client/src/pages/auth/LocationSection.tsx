import Input from '../../components/ui/Input';

/** Available districts in Sri Lanka */
const districts = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Galle', 'Matara', 'Kurunegala'];

/**
 * Location section props
 */
interface LocationSectionProps {
    /** Form data */
    formData: {
        district: string;
        city: string;
        streetAddress: string;
    };
    /** Field change handler */
    onChange: (field: string, value: string) => void;
}

/**
 * Business location information form section
 * @param props - Component props
 * @returns LocationSection component
 */
export default function LocationSection({ formData, onChange }: LocationSectionProps) {
    return (
        <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-bold text-dark flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                    2
                </span>
                Business Location
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                        District <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-primary outline-none"
                        value={formData.district}
                        onChange={(e) => onChange('district', e.target.value)}
                    >
                        <option value="">Select your district</option>
                        {districts.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <Input
                    label="City"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => onChange('city', e.target.value)}
                />
            </div>

            <Input
                label="Street Address"
                placeholder="123 Main Street, Colombo"
                value={formData.streetAddress}
                onChange={(e) => onChange('streetAddress', e.target.value)}
            />

        </div>
    );
}
