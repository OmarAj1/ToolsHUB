import React, { useState } from 'react';
import { Upload, Download } from 'lucide-react';

export function WebpConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [converting, setConverting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      convertToWebp(event.target?.result as string, quality);
    };
    reader.readAsDataURL(file);
  };

  const convertToWebp = (src: string, q: number) => {
    setConverting(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const webpDataUrl = canvas.toDataURL('image/webp', q);
        setConvertedImage(webpDataUrl);
      }
      setConverting(false);
    };
    img.src = src;
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = parseFloat(e.target.value);
    setQuality(q);
    if (originalImage) {
      convertToWebp(originalImage, q);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
      <div className="text-center mb-8">
         <p className="text-slate-500">Fully client-side. Convert PNG/JPG to WebP offline without uploading your images to a server.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6">
        <label className="text-sm font-bold block mb-2">Quality: {Math.round(quality * 100)}%</label>
        <div className="flex items-center gap-4">
          <input 
            type="range" min="0.1" max="1" step="0.1" 
            value={quality} 
            onChange={handleQualityChange} 
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {!originalImage ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
          <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
          <Upload className="w-12 h-12 text-indigo-500 mb-4" />
          <span className="font-bold text-lg">Click or Drag to Upload</span>
          <span className="text-sm text-slate-500 mt-1">Supports PNG, JPG, JPEG</span>
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-center flex flex-col">
             <h3 className="font-bold mb-4">Original Image</h3>
             <div className="flex-1 flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
               <img src={originalImage} alt="Original" className="max-h-[300px] object-contain p-2" />
             </div>
           </div>

           <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-center flex flex-col">
             <h3 className="font-bold mb-4">WebP Output</h3>
             <div className="flex-1 flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 relative">
               {converting && <div className="absolute inset-0 bg-white/80 dark:bg-black/50 flex items-center justify-center z-10"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>}
               {convertedImage && <img src={convertedImage} alt="WebP Output" className="max-h-[300px] object-contain p-2" />}
             </div>
             {convertedImage && (
               <a 
                 href={convertedImage} 
                 download="converted.webp"
                 className="mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
               >
                 <Download className="w-4 h-4" /> Download WebP
               </a>
             )}
           </div>
        </div>
      )}
      
      {originalImage && (
        <div className="mt-8 text-center">
           <button onClick={() => { setOriginalImage(null); setConvertedImage(null); }} className="text-sm text-slate-500 hover:underline">
             Convert Another Image
           </button>
        </div>
      )}
    </div>
  );
}
