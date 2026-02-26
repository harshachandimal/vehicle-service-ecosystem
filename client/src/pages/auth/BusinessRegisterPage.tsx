import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import EssentialInfoSection from './EssentialInfoSection';
import LocationSection from './LocationSection';
import DetailsSection from './DetailsSection';

/**
 * Business registration page component for service providers
 * @returns BusinessRegisterPage component
 */
export default function BusinessRegisterPage() {
    const navigate = useNavigate();
    const { registerBusiness } = useAuth();
    const [formData, setFormData] = useState({
        businessName: '', email: '', phone: '', password: '', confirmPassword: '',
        district: '', city: '', streetAddress: '', category: '' as 'GARAGE' | 'CARRIER' | 'DETAILER' | '',
        businessDescription: '', registrationNumber: '', agreeToTerms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    /**
     * Updates form field values
     * @param field - Field name to update
     * @param value - New value for the field
     */
    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Handles form submission and business registration
     * @param e - Form event
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: Record<string, string> = {};
        if (!formData.businessName) newErrors.businessName = 'Business name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password || formData.password.length < 8)
            newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await registerBusiness({
                name: formData.businessName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                district: formData.district,
                city: formData.city,
                role: 'PROVIDER',
                businessName: formData.businessName,
                category: formData.category as 'GARAGE' | 'CARRIER' | 'DETAILER',
                streetAddress: formData.streetAddress,
                businessDescription: formData.businessDescription,
                registrationNumber: formData.registrationNumber,
            });
            navigate('/');
        } catch (error: any) {
            setErrors({ general: error.response?.data?.error || error.message || 'Registration failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Your Business Account" subtitle="Join Autofix as a service provider and grow your business">
            <form onSubmit={handleSubmit} className="space-y-5">
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {errors.general}
                    </div>
                )}

                <EssentialInfoSection formData={formData} errors={errors} onChange={handleChange} />
                <LocationSection formData={formData} onChange={handleChange} />
                <DetailsSection formData={formData} onChange={handleChange} />

                <div className="flex items-start gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="terms" className="text-sm text-black">
                        I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

                <Button type="submit" className="w-full" loading={loading}>
                    Create Business Account
                </Button>

                <p className="text-center text-sm text-black mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                    <br />
                    <span className="text-black">Just looking for services? </span>
                    <Link to="/register" className="text-primary font-semibold hover:underline">Create customer account</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
