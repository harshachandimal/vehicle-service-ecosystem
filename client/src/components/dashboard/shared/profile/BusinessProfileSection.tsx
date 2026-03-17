import { Briefcase, MapPin, FileText } from 'lucide-react';

interface BusinessProfileSectionProps {
    data: {
        businessName: string;
        category: string;
        streetAddress: string;
        businessDescription: string;
        registrationNumber: string;
    };
    onChange: (data: any) => void;
}

export default function BusinessProfileSection({ data, onChange }: BusinessProfileSectionProps) {
    return (
        <section className="mt-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Business Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Business Name</label>
                    <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            value={data.businessName}
                            onChange={(e) => onChange({...data, businessName: e.target.value})}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="Business Name"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Category</label>
                    <select 
                        value={data.category}
                        onChange={(e) => onChange({...data, category: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                        <option value="GARAGE">Auto Garage</option>
                        <option value="CARRIER">Transport & Carrier</option>
                        <option value="DETAILER">Detailing Studio</option>
                        <option value="TYRE_HOUSE">Tyre House</option>
                    </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Street Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            value={data.streetAddress}
                            onChange={(e) => onChange({...data, streetAddress: e.target.value})}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="Street Address"
                        />
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Business Description</label>
                    <textarea 
                        value={data.businessDescription}
                        onChange={(e) => onChange({...data, businessDescription: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all min-h-[100px]"
                        placeholder="Tell customers about your business..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Registration Number (Optional)</label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            value={data.registrationNumber}
                            onChange={(e) => onChange({...data, registrationNumber: e.target.value})}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="BRN Number"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
