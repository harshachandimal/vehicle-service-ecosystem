import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContact } from '../../api/contact.api';

interface ContactFormData {
    fullName: string;
    phone: string;
    email: string;
    message: string;
}

const EMPTY: ContactFormData = { fullName: '', phone: '', email: '', message: '' };

const fieldClass =
    'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-sm backdrop-blur-sm';

export default function ContactForm() {
    const [form, setForm] = useState<ContactFormData>(EMPTY);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await submitContact({
                name: form.fullName,
                email: form.email,
                phone: form.phone || undefined,
                message: form.message,
            });
            setSuccess(true);
            setForm(EMPTY);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle size={48} className="text-blue-400" />
                <p className="text-lg font-semibold text-blue-300">Message sent successfully!</p>
                <p className="text-sm text-slate-400">We'll get back to you at <span className="text-slate-200">{form.email || 'your email'}</span> shortly.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                required
                type="text"
                placeholder="Full Name *"
                className={fieldClass}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="tel"
                    placeholder="Phone Number"
                    className={fieldClass}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <input
                    required
                    type="email"
                    placeholder="Email Address *"
                    className={fieldClass}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
            </div>
            <textarea
                required
                rows={4}
                placeholder="Message *"
                className={`${fieldClass} resize-none`}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}
            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold text-sm shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_28px_rgba(59,130,246,0.6)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:active:scale-100"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending…
                    </>
                ) : (
                    <><Send size={15} /> Send Message</>
                )}
            </button>
        </form>
    );
}
