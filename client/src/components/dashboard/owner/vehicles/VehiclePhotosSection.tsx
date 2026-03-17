import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { API_URL } from '../../../../api/auth.api';

interface VehiclePhotosSectionProps {
  photoUrl?: string | null;
  model: string;
  uploading: boolean;
  imageSuccess: boolean;
  onUpload: (file: File) => Promise<boolean | undefined>;
}

const VehiclePhotosSection: React.FC<VehiclePhotosSectionProps> = ({
  photoUrl,
  model,
  uploading,
  imageSuccess,
  onUpload
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http')) return photoUrl;
    return `${API_URL}${photoUrl}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      const success = await onUpload(selectedFile);
      if (success) {
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    }
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-slate-900 aspect-square">
        {previewUrl || photoUrl ? (
          <img 
            src={getImageUrl()} 
            alt={model} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-900/50">
            <Camera size={64} className="mb-4 opacity-20" />
            <p className="text-sm font-bold uppercase tracking-tighter opacity-20">No Vehicle Photo</p>
          </div>
        )}
        
        {previewUrl && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg">
            Preview
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
          <p className="text-xs text-white/50 font-medium">Professional high-quality images help providers assess your vehicle.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Camera size={16} className="text-blue-500" />
          Vehicle Photo
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video bg-black/40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {selectedFile ? (
              <>
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <ImageIcon size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-slate-800 rounded-xl text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Select Photo</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">PNG, JPG or WebP up to 5MB</p>
                </div>
              </>
            )}
          </div>

          <button 
            type="submit"
            disabled={uploading || !selectedFile}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${
              imageSuccess 
                ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:bg-slate-800 disabled:text-slate-600'
            }`}
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : imageSuccess ? (
              <>
                <CheckCircle2 size={18} /> Updated Successfully
              </>
            ) : (
              <>
                <Upload size={18} /> Upload Photo
              </>
            )}
          </button>
          
          {selectedFile && !uploading && !imageSuccess && (
            <button 
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="w-full text-[10px] text-slate-500 font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Cancel Selection
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default VehiclePhotosSection;
