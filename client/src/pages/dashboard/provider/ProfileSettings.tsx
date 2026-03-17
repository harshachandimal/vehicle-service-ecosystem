import { 
    Save, 
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useProfileSettings } from '../../../hooks/useProfileSettings';
import Sidebar from '../../../components/dashboard/provider/layout/ProviderSidebar';
import PhotoUploadSection from '../../../components/dashboard/shared/profile/PhotoUploadSection';
import PersonalInfoSection from '../../../components/dashboard/shared/profile/PersonalInfoSection';
import BusinessProfileSection from '../../../components/dashboard/shared/profile/BusinessProfileSection';
import SecuritySection from '../../../components/dashboard/shared/profile/SecuritySection';

const SERVER_URL = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

export default function ProfileSettings() {
    const {
        loading,
        saving,
        uploading,
        message,
        profileData,
        setProfileData,
        passwordData,
        setPasswordData,
        handlePhotoUpload,
        handleProfileSubmit,
        handlePasswordSubmit,
        isProvider,
    } = useProfileSettings();

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#f8fafc]">
                 <Sidebar />
                 <div className="flex-1 flex items-center justify-center">
                     <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                 </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-100">
            <Sidebar />

            <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto mb-10 relative z-0">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 mt-2">Manage your profile information and security preferences.</p>
                </header>

                {message && (
                    <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
                        message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                <div className="space-y-8">
                    {/* Profile Photo Section (Provider Only) */}
                    {isProvider && (
                        <PhotoUploadSection 
                            photoUrl={profileData.photoUrl}
                            uploading={uploading}
                            onPhotoUpload={handlePhotoUpload}
                            serverUrl={SERVER_URL}
                        />
                    )}

                    {/* Profile Information & Business Section */}
                    <section className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50">
                        <form onSubmit={handleProfileSubmit}>
                            <PersonalInfoSection 
                                data={profileData}
                                onChange={setProfileData}
                            />

                            {isProvider && (
                                <BusinessProfileSection 
                                    data={profileData}
                                    onChange={setProfileData}
                                />
                            )}

                            <div className="flex justify-end pt-8 mt-8 border-t border-slate-100">
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
                    </section>

                    {/* Security Section */}
                    <SecuritySection 
                        data={passwordData}
                        onChange={setPasswordData}
                        onSubmit={handlePasswordSubmit}
                        saving={saving}
                    />
                </div>
            </main>
        </div>
    );
}
