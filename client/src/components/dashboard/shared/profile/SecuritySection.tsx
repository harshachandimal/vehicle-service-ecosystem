import { Lock } from 'lucide-react';

interface SecuritySectionProps {
    data: any;
    onChange: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    saving: boolean;
    isDark?: boolean;
}

export default function SecuritySection({ data, onChange, onSubmit, saving, isDark = false }: SecuritySectionProps) {
    const cardClasses = isDark 
        ? "bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl"
        : "bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50";
    
    const labelClasses = isDark ? "text-slate-400" : "text-slate-700";
    const headerClasses = isDark ? "text-white" : "text-slate-800";
    const borderClasses = isDark ? "border-white/5" : "border-slate-100";
    const inputClasses = isDark
        ? "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
        : "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all";
    
    const buttonClasses = isDark
        ? "px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
        : "px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all disabled:opacity-50";

    return (
        <section className={cardClasses}>
            <div className={`flex items-center gap-3 mb-8 pb-4 border-b ${borderClasses}`}>
                <div className={`w-10 h-10 ${isDark ? 'bg-slate-500/10' : 'bg-slate-100'} rounded-xl flex items-center justify-center`}>
                    <Lock className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                </div>
                <h2 className={`text-xl font-bold ${headerClasses}`}>Security</h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className={`text-sm font-semibold ${labelClasses} ml-1`}>Current Password</label>
                        <input 
                            type="password"
                            value={data.currentPassword}
                            onChange={(e) => onChange({...data, currentPassword: e.target.value})}
                            className={inputClasses}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={`text-sm font-semibold ${labelClasses} ml-1`}>New Password</label>
                            <input 
                                type="password"
                                value={data.newPassword}
                                onChange={(e) => onChange({...data, newPassword: e.target.value})}
                                className={inputClasses}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-sm font-semibold ${labelClasses} ml-1`}>Confirm New Password</label>
                            <input 
                                type="password"
                                value={data.confirmPassword}
                                onChange={(e) => onChange({...data, confirmPassword: e.target.value})}
                                className={inputClasses}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className={buttonClasses}
                >
                    Update Password
                </button>
            </form>
        </section>
    );
}
