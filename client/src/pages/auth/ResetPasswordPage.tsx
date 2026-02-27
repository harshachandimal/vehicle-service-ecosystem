import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authApi } from '../../api/auth.api';

/**
 * Reset Password page — accepts new password and submits it with the URL token
 * Route: /reset-password/:token
 * @returns ResetPasswordPage component
 */
export default function ResetPasswordPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    /**
     * Validates and submits the reset-password form
     * @param e - Form event
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: Record<string, string> = {};
        if (!newPassword || newPassword.length < 8)
            newErrors.newPassword = 'Password must be at least 8 characters.';
        if (newPassword !== confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match.';

        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        setLoading(true);
        try {
            await authApi.resetPassword(token!, newPassword);
            navigate('/login', { state: { message: 'Password reset successful. Please sign in.' } });
        } catch (error: any) {
            setErrors({ general: error.response?.data?.error || 'Reset failed. The link may have expired.' });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <AuthLayout title="Invalid Link" subtitle="This reset link is invalid or missing a token.">
                <p className="text-center text-sm">
                    <Link to="/forgot-password" className="text-primary hover:underline">
                        Request a new link
                    </Link>
                </p>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Reset Password" subtitle="Enter and confirm your new password">
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {errors.general}
                    </div>
                )}
                <Input
                    label="New Password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={errors.newPassword}
                    required
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    required
                />
                <Button type="submit" className="w-full" loading={loading}>
                    Reset Password
                </Button>
                <p className="text-center text-sm text-black mt-4">
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Back to Sign In
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
