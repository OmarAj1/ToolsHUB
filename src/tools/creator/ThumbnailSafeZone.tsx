import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState } from 'react';
import { Upload, AlertTriangle, Monitor, Smartphone } from 'lucide-react';

function ThumbnailSafeZoneBase() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showDesktop, setShowDesktop] = useState(true);
  const [showMobile, setShowMobile] = useState(true);
  const [showTv, setShowTv] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-slate-50 text-slate-50">
      
      <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl mb-8 flex flex-wrap gap-6 items-center justify-between shadow-sm">
         <div>
           <h2 className="font-bold mb-1">YouTube Thumbnail Safe Zones</h2>
           <p className="text-sm text-slate-400">Preview how UI elements cover your thumbnail across devices.</p>
         </div>

         <div className="flex gap-4">
           <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
             <input type="checkbox" checked={showDesktop} onChange={e => setShowDesktop(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
             <Monitor className="w-4 h-4 text-slate-400" /> Desktop Overlays
           </label>
           <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
             <input type="checkbox" checked={showMobile} onChange={e => setShowMobile(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
             <Smartphone className="w-4 h-4 text-slate-400" /> Mobile Overlays
           </label>
         </div>
         
         <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
           <Upload className="w-4 h-4 text-purple-500" />
           <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
           Upload Thumbnail
         </label>
      </div>

      <div className="relative w-full aspect-video bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
         
         {!imageSrc ? (
            <div className="text-slate-400 text-center">
               <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50 text-purple-500" />
               <p className="font-bold">No Image Uploaded</p>
               <p className="text-sm mt-1">Upload a 1280x720 or 1920x1080 image.</p>
            </div>
         ) : (
            <>
              <img src={imageSrc} alt="Thumbnail Preview" className="absolute inset-0 w-full h-full object-cover" />
              
              {/* Overlays Wrapper */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                
                {/* Desktop Timestamp */}
                {showDesktop && (
                  <div className="absolute bottom-[2%] right-[1%] bg-black/80 text-white text-[1cqw] font-bold px-[0.5cqw] py-[0.2cqw] rounded shadow">
                    12:34
                  </div>
                )}
                
                {/* Mobile End Screen Elements (Rough Approximation) */}
                {showMobile && (
                  <>
                    <div className="absolute top-[2%] right-[2%] w-[10cqw] h-[10cqw] bg-red-500/50 border-2 border-red-500 border-dashed rounded-full flex items-center justify-center">
                      <span className="text-[1cqw] font-bold text-red-100 bg-red-900/50 px-[0.5cqw]">Profile</span>
                    </div>
                    <div className="absolute bottom-[20%] right-[2%] w-[40cqw] h-[22.5cqw] bg-red-500/50 border-2 border-red-500 border-dashed flex items-center justify-center">
                      <span className="text-[1.5cqw] font-bold text-red-100 bg-red-900/50 px-[1cqw]">Next Video</span>
                    </div>
                  </>
                )}

              </div>
            </>
         )}

         <style>{`
           /* Container queries for responsive typography scale */
           .aspect-video { container-type: inline-size; }
         `}</style>
      </div>
      
      <div className="mt-4 text-center text-xs text-slate-400 text-slate-50">
         * Note: YouTube's UI overlay positions change frequently. These boxes represent the danger zones where you shouldn't place critical text or faces.
      </div>
    </div>
  );
}

export const ThumbnailSafeZone = () => <GenericToolWrapper toolName="ThumbnailSafeZone"><ThumbnailSafeZoneBase /></GenericToolWrapper>;
