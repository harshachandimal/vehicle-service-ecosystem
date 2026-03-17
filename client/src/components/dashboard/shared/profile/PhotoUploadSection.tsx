import { User, Camera, Loader2 } from 'lucide-react';

interface PhotoUploadSectionProps {
    photoUrl: string;
    uploading: boolean;
    onPhotoUpload: (file: File) => void;
    serverUrl: string;
}

export default function PhotoUploadSection({ 
    photoUrl, 
    uploading, 
    onPhotoUpload, 
    serverUrl 
}: PhotoUploadSectionProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onPhotoUpload(file);
    };

    return (
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-lg relative">
                        {photoUrl ? (
                            <img 
                                src={`${serverUrl}${photoUrl}`} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-400">
                                <User size={48} />
                            </div>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center text-white">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all border-4 border-white">
                        <Camera size={18} />
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-bold text-slate-800">Profile Photo</h2>
                    <p className="text-slate-500 mt-1 max-w-sm">
                        Click the camera icon to upload a professional photo for your business profile.
                    </p>
                    <p className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-wider">
                        Supported: JPG, PNG, WEBP (Max 5MB)
                    </p>
                </div>
            </div>
        </section>
    );
}
