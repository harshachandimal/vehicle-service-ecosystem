import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ContactFormData {
    fullName: string;
    phone: string;
    email: string;
    message: string;
}

const fieldClass =
    'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-sm backdrop-blur-sm';

export default function ContactForm() {
    const [form, setForm] = useState<ContactFormData>({
        fullName: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Contact form payload:', form);
        alert('Message Sent!');
        setForm({ fullName: '', phone: '', email: '', message: '' });
    };

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
            <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold text-sm shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_28px_rgba(59,130,246,0.6)] transition-all duration-300"
            >
                <Send size={15} /> Send Message
            </button>
        </form>
    );
}
