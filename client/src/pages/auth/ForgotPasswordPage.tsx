import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authApi } from '../../api/auth.api';

/**
 * Forgot Password page — accepts an email and requests a reset token
 * @returns ForgotPasswordPage component
 */
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    /**
     * Submits the forgot-password form
     * @param e - Form event
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setSubmitted(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset link">
            {submitted ? (
                <div className="space-y-4 text-center">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        A password reset link has been sent to <strong>{email}</strong>. Please check your inbox (and spam folder).
                    </div>
                    <Link to="/login" className="block text-sm text-primary hover:underline mt-2">
                        Back to Sign In
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full" loading={loading}>
                        Send Reset Link
                    </Button>
                    <p className="text-center text-sm text-black mt-4">
                        Remember your password?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </form>
            )}
        </AuthLayout>
    );
}
