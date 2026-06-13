import React, { useState } from 'react';
import { Image as ImageIcon, X, Globe, Search, Loader2 } from 'lucide-react';

export function QrLogosTab({ state, setters, handlers }: any) {
  const { logoImage, logoMargin } = state;
  const { setLogoImage, setLogoMargin } = setters;
  const { handleLogoUpload } = handlers;
  const [logoUrl, setLogoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogo = async () => {
    if (!logoUrl) return;
    setIsLoading(true);
    try {
      let domain = logoUrl;
      if (domain.startsWith('http')) {
        const urlObj = new URL(domain);
        domain = urlObj.hostname;
      }
      
      // Try to fetch through proxy to avoid CORS issues if we need to convert to base64,
      // but clearbit allows CORS which is great for canvas. We can try to load it into an image
      // to convert it to base64 so we don't ever have CORS canvas taint issues.
      let clearbitUrl = `https://logo.clearbit.com/${domain}`;
      
      let response;
      try {
        response = await fetch(clearbitUrl);
      } catch (err) {
        // Fallback to proxy if fetch fails due to CORS or other network errors
        response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(clearbitUrl)}`);
      }

      if (!response || !response.ok) throw new Error('Logo not found or blocked');
      
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(blob);

    } catch (error) {
      setIsLoading(false);
      // Fallback if clearbit fails
      alert("Could not automatically fetch the logo for this URL. Please try uploading it manually.");
    }
  };

  return (
     <div className="max-w-2xl animate-in fade-in duration-300 space-y-8">
       
       <div className="w-full bg-[#FAFAFA] bg-[#1A1A1A] border border-slate-700 border-[#2A2A2A] p-6 rounded-3xl shadow-sm">
         <h3 className="text-sm font-bold text-slate-50 text-white mb-4 flex items-center gap-2">
           <Globe className="w-5 h-5 text-blue-500" /> Auto-Fetch Logo from URL
         </h3>
         <div className="flex gap-3">
           <div className="relative flex-1">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Search className="h-4 w-4 text-slate-400" />
             </div>
             <input
               type="text"
               placeholder="e.g. apple.com or https://stripe.com"
               value={logoUrl}
               onChange={(e) => setLogoUrl(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && fetchLogo()}
               className="w-full pl-11 pr-4 py-3 bg-slate-800 bg-[#111111] border border-slate-700 border-[#333] rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white"
             />
           </div>
           <button
             onClick={fetchLogo}
             disabled={!logoUrl || isLoading}
             className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-purple-500" /> : 'Fetch Base Logo'}
           </button>
         </div>
         <p className="text-xs text-slate-400 text-slate-50 mt-3">
           Type any website URL to automatically generate a QR code with its logo drawn in the middle. (Powered by Clearbit)
         </p>
       </div>

       <div className="flex flex-col sm:flex-row gap-6 items-start">
         {!logoImage ? (
           <label className="flex flex-col items-center justify-center w-full sm:w-40 h-40 border-2 border-dashed border-slate-700 border-slate-700 bg-[#FAFAFA] bg-[#161616] rounded-3xl hover:border-blue-500 hover:border-blue-500 hover:bg-slate-800 hover:bg-[#1A1A1A] cursor-pointer transition-all hover:shadow-md">
             <div className="w-12 h-12 bg-blue-50 bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
               <ImageIcon className="w-6 h-6 text-blue-600 text-blue-400" />
             </div>
             <span className="text-xs text-slate-400 text-slate-50 font-extrabold uppercase tracking-widest mt-2">Upload</span>
             <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
           </label>
         ) : (
           <div className="relative w-full sm:w-40 h-40 border border-slate-700 border-[#2A2A2A] rounded-3xl overflow-hidden bg-slate-800 bg-[#111111] flex items-center justify-center p-4 group shadow-sm">
             <img src={logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
             <div className="absolute inset-0 bg-slate-900/60 bg-slate-900/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setLogoImage(null)} className="bg-slate-800 text-slate-50 p-3 rounded-full mb-2 hover:bg-red-500 hover:text-white transition-colors shadow-lg">
                 <X className="w-6 h-6" />
               </button>
             </div>
           </div>
         )}

         {logoImage && (
           <div className="flex-1 w-full bg-[#FAFAFA] bg-[#1A1A1A] border border-slate-700 border-[#2A2A2A] p-6 rounded-3xl shadow-sm">
             <label className="flex justify-between items-center text-xs font-bold uppercase text-slate-400 text-slate-50 mb-5 tracking-wider">
               <span>Logo Edge Margin</span>
               <span className="text-blue-600 text-blue-400 bg-blue-50 bg-[#111111] px-3 py-1 rounded-full">{logoMargin}px</span>
             </label>
             <input type="range" min="0" max="40" value={logoMargin} onChange={e => setLogoMargin(Number(e.target.value))} className="w-full h-2 bg-slate-200 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
           </div>
         )}
       </div>
     </div>
  );
}
