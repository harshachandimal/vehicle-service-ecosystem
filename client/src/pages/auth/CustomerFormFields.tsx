import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';

/** Available districts in Sri Lanka */
const districts = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Galle', 'Matara', 'Kurunegala'];
/** Cities mapped by district */
const citiesByDistrict: Record<string, string[]> = {
    Colombo: ['Colombo', 'Dehiwala', 'Moratuwa', 'Kotte'],
    Gampaha: ['Gampaha', 'Negombo', 'Ja-Ela', 'Kadawatha'],
    Kalutara: ['Kalutara', 'Panadura', 'Horana', 'Beruwala'],
};

/**
 * Customer form fields props
 */
interface CustomerFormFieldsProps {
    /** Form data */
    formData: {
        name: string;
        email: string;
        phone: string;
        district: string;
        city: string;
        password: string;
        agreeToTerms: boolean;
    };
    /** Form validation errors */
    errors: Record<string, string>;
    /** Field change handler */
    onChange: (field: string, value: any) => void;
}

/**
 * Customer registration form fields component
 * @param props - Component props
 * @returns CustomerFormFields component
 */
export default function CustomerFormFields({ formData, errors, onChange }: CustomerFormFieldsProps) {
    return (
        <>
            <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => onChange('name', e.target.value)}
                error={errors.name}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    error={errors.email}
                    required
                />
                <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-dark mb-2">District</label>
                    <select
                        className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-primary outline-none"
                        value={formData.district}
                        onChange={(e) => {
                            onChange('district', e.target.value);
                            onChange('city', '');
                        }}
                    >
                        <option value="">Select district</option>
                        {districts.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-dark mb-2">City</label>
                    <select
                        className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-primary outline-none"
                        value={formData.city}
                        onChange={(e) => onChange('city', e.target.value)}
                        disabled={!formData.district}
                    >
                        <option value="">Select city</option>
                        {formData.district &&
                            citiesByDistrict[formData.district]?.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <Input
                label="Password"
                type="password"
                placeholder="Create a strong password (min. 8 characters)"
                value={formData.password}
                onChange={(e) => onChange('password', e.target.value)}
                error={errors.password}
                required
            />

            <div className="flex items-start gap-2">
                <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => onChange('agreeToTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="terms" className="text-sm text-black">
                    I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </label>
            </div>
            {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}
        </>
    );
}
