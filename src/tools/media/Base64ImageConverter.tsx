import React, { useState } from 'react';
import { Upload, Copy, Check, Download } from 'lucide-react';

export function Base64ImageConverter() {
  const [base64, setBase64] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [copied, setCopied] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setBase64(result);
        setImageSrc(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBase64(value);
    
    // Automatically add data URI prefix if it looks like raw base64 but missing it
    if (value && !value.startsWith('data:image') && value.length > 20) {
      setImageSrc(`data:image/png;base64,${value}`);
      return;
    }
    setImageSrc(value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setBase64('');
    setImageSrc('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-50 text-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Textarea */}
        <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col h-full">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold">Base64 String</h3>
             {base64 && (
               <button onClick={clear} className="text-xs text-red-500 hover:underline">Clear</button>
             )}
           </div>
           <textarea
             value={base64}
             onChange={handleBase64Change}
             placeholder="Paste base64 string here..."
             className="flex-1 w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded-lg p-3 font-mono text-sm resize-none min-h-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
           <button 
             onClick={handleCopy} 
             disabled={!base64}
             className="mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
           >
             {copied ? <Check className="w-5 h-5 text-purple-500" /> : <Copy className="w-5 h-5 text-purple-500" />}
             {copied ? 'Copied to Clipboard' : 'Copy Base64'}
           </button>
        </div>

        {/* Right Side: Image Preview & Upload */}
        <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col h-full">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold">Image Preview</h3>
             <label className="cursor-pointer bg-slate-800 hover:bg-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">
               <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
               Upload Image
             </label>
           </div>
           
           <div className="flex-1 bg-slate-900 bg-slate-900 border border-slate-700 border-slate-700 border-dashed rounded-lg flex items-center justify-center p-4 overflow-hidden min-h-[300px]">
             {imageSrc ? (
                <img src={imageSrc} alt="Preview" className="max-w-full max-h-[400px] object-contain rounded" onError={() => setImageSrc('')} />
             ) : (
                <div className="text-center text-slate-400">
                  <Upload className="w-10 h-10 mx-auto mb-2 opacity-50 text-purple-500" />
                  <p className="text-sm font-bold">No Image</p>
                  <p className="text-xs mt-1">Upload an image or paste a base64 string</p>
                </div>
             )}
           </div>

           {imageSrc && (
             <a 
               href={imageSrc} 
               download="converted-image.png"
               className="mt-4 flex items-center justify-center gap-2 bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 hover:bg-slate-900 hover:bg-slate-700 font-bold py-3 rounded-lg transition-colors"
             >
               <Download className="w-5 h-5 text-purple-500" />
               Download Image
             </a>
           )}
        </div>

      </div>
    </div>
  );
}
