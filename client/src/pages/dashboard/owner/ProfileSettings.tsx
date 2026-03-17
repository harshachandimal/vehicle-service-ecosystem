import { 
    Save, 
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useProfileSettings } from '../../../hooks/useProfileSettings';
import OwnerSidebar from '../../../components/dashboard/owner/layout/OwnerSidebar';
import PersonalInfoSection from '../../../components/dashboard/shared/profile/PersonalInfoSection';
import SecuritySection from '../../../components/dashboard/shared/profile/SecuritySection';

export default function OwnerProfileSettings() {
    const {
        loading,
        saving,
        message,
        profileData,
        setProfileData,
        passwordData,
        setPasswordData,
        handleProfileSubmit,
        handlePasswordSubmit,
    } = useProfileSettings();

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#020617]">
                 <OwnerSidebar />
                 <div className="flex-1 flex items-center justify-center">
                     <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                 </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#020617] text-slate-200">
            <OwnerSidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <header className="sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-6">
                    <div className="max-w-5xl mx-auto">
                        <h1 className="text-2xl font-black text-white tracking-tight">Account Settings</h1>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-1">Manage your profile and security</p>
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto w-full space-y-8 mb-10">
                    {message && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
                            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span className="font-medium text-sm">{message.text}</span>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Profile Information */}
                        <div className="space-y-6">
                            <form onSubmit={handleProfileSubmit}>
                                <PersonalInfoSection 
                                    data={profileData}
                                    onChange={setProfileData}
                                    isDark={true}
                                />

                                <div className="flex justify-end pt-8">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        Save Profile Changes
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Security Section */}
                        <SecuritySection 
                            data={passwordData}
                            onChange={setPasswordData}
                            onSubmit={handlePasswordSubmit}
                            saving={saving}
                            isDark={true}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
