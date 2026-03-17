import { Lock } from 'lucide-react';

interface SecuritySectionProps {
    data: any;
    onChange: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    saving: boolean;
}

export default function SecuritySection({ data, onChange, onSubmit, saving }: SecuritySectionProps) {
    return (
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Security</h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Current Password</label>
                        <input 
                            type="password"
                            value={data.currentPassword}
                            onChange={(e) => onChange({...data, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">New Password</label>
                            <input 
                                type="password"
                                value={data.newPassword}
                                onChange={(e) => onChange({...data, newPassword: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Confirm New Password</label>
                            <input 
                                type="password"
                                value={data.confirmPassword}
                                onChange={(e) => onChange({...data, confirmPassword: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all disabled:opacity-50"
                >
                    Update Password
                </button>
            </form>
        </section>
    );
}
