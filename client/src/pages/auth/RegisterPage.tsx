import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import ProviderCallout from './ProviderCallout';
import CustomerFormFields from './CustomerFormFields';

/**
 * Customer registration page component
 * @returns RegisterPage component
 */
export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', district: '', city: '', password: '', agreeToTerms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    /**
     * Updates form field values
     * @param field - Field name to update
     * @param value - New value for the field
     */
    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Handles form submission and user registration
     * @param e - Form event
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password || formData.password.length < 8)
            newErrors.password = 'Password must be at least 8 characters';
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await register({ ...formData, role: 'OWNER' });
            navigate('/');
        } catch (error: any) {
            setErrors({ general: error.response?.data?.error || error.message || 'Registration failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Join AutoFix to book vehicle services from trusted providers">
            <form onSubmit={handleSubmit} className="space-y-4">
                <ProviderCallout />

                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {errors.general}
                    </div>
                )}

                <CustomerFormFields formData={formData} errors={errors} onChange={handleChange} />

                <Button type="submit" className="w-full" loading={loading}>
                    Create Account
                </Button>

                <p className="text-center text-sm text-black mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
