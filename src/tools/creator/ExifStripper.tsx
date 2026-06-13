import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';

function ExifStripperBase() {
  const [cleanedImage, setCleanedImage] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setOriginalName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      // Simplest way to strip EXIF from a JPEG offline in the browser
      // is to draw it to a canvas and re-export it.
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Exporting as JPEG without EXIF metadata
          const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', 1.0);
          setCleanedImage(dataUrl);
        }
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setCleanedImage(null);
    setOriginalName('');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 text-slate-50 text-slate-50">
      <div className="bg-blue-50 bg-blue-900/20 border border-blue-200 border-blue-800 rounded-xl p-4 mb-8 flex gap-3 text-sm">
        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
           <strong>100% Offline Privacy:</strong> This tool strips location data, camera models, and timestamps from your photos by drawing them to an invisible canvas and exporting a fresh image. Your photos never leave your device.
        </div>
      </div>

      {!cleanedImage ? (
        <label className="border-2 border-dashed border-slate-700 border-slate-700 bg-slate-800 bg-slate-800 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 hover:bg-slate-700 transition-colors shadow-sm">
          <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleImageUpload} />
          <Upload className="w-16 h-16 text-blue-500 mb-4" />
          <span className="font-bold text-xl mb-2">Click or Drag Image Here</span>
          <span className="text-slate-400">Supports JPG, PNG, WebP</span>
          
          {isProcessing && (
            <div className="mt-6 flex items-center justify-center gap-2 text-blue-500 font-bold">
               <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
               Cleaning Metadata...
            </div>
          )}
        </label>
      ) : (
        <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl p-8 shadow-sm text-center">
            <div className="w-20 h-20 bg-green-100 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Metadata Removed!</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">All unseen metadata (EXIF) has been successfully scrubbed from <strong>{originalName}</strong>.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={cleanedImage} 
                download={`cleaned_${originalName}`}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                <Download className="w-5 h-5 text-purple-500" /> Download Safe Image
              </a>
              <button 
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-200 bg-slate-800 hover:bg-slate-700 font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Clean Another
              </button>
            </div>
        </div>
      )}
    </div>
  );
}

export const ExifStripper = () => <GenericToolWrapper toolName="ExifStripper"><ExifStripperBase /></GenericToolWrapper>;
