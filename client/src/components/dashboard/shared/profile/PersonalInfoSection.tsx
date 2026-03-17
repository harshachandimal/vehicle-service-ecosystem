import { User, Mail, Phone } from 'lucide-react';

interface PersonalInfoSectionProps {
    data: {
        name: string;
        email: string;
        phone: string;
        district: string;
        city: string;
    };
    onChange: (data: any) => void;
    isDark?: boolean;
}

export default function PersonalInfoSection({ data, onChange, isDark = false }: PersonalInfoSectionProps) {
    const cardClasses = isDark 
        ? "bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl"
        : "bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50";
    
    const labelClasses = isDark ? "text-slate-400" : "text-slate-700";
    const headerClasses = isDark ? "text-white" : "text-slate-800";
    const borderClasses = isDark ? "border-white/5" : "border-slate-100";
    const inputClasses = isDark
        ? "w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
        : "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all";
    
    const readOnlyInputClasses = isDark
        ? "w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-white/5 rounded-2xl text-slate-500 cursor-not-allowed"
        : "w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed";

    const smallInputClasses = isDark
        ? "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
        : "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all";

    return (
        <section className={cardClasses}>
            <div className={`flex items-center gap-3 mb-8 pb-4 border-b ${borderClasses}`}>
                <div className={`w-10 h-10 ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'} rounded-xl flex items-center justify-center`}>
                    <User className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h2 className={`text-xl font-bold ${headerClasses}`}>Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className={`text-sm font-semibold ${labelClasses} ml-1`}>Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text"
                            value={data.name}
                            onChange={(e) => onChange({...data, name: e.target.value})}
                            className={inputClasses}
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className={`text-sm font-semibold ${labelClasses} ml-1 opacity-60`}>Email Address (Read-only)</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="email"
                            value={data.email}
                            disabled
                            className={readOnlyInputClasses}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className={`text-sm font-semibold ${labelClasses} ml-1`}>Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="tel"
                            value={data.phone}
                            onChange={(e) => onChange({...data, phone: e.target.value})}
                            className={inputClasses}
                            placeholder="e.g. 077 123 4567"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className={`text-sm font-semibold ${labelClasses} ml-1`}>District</label>
                        <input 
                            type="text"
                            value={data.district}
                            onChange={(e) => onChange({...data, district: e.target.value})}
                            className={smallInputClasses}
                            placeholder="District"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={`text-sm font-semibold ${labelClasses} ml-1`}>City</label>
                        <input 
                            type="text"
                            value={data.city}
                            onChange={(e) => onChange({...data, city: e.target.value})}
                            className={smallInputClasses}
                            placeholder="City"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
