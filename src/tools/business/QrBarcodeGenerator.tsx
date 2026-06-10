import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';

export function QrBarcodeGenerator() {
  const [text, setText] = useState('https://10015.io');
  const [size, setSize] = useState(200);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('Q'); // Error correction level

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;
    
    // serialize to string
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
         ctx.fillStyle = bgColor;
         ctx.fillRect(0, 0, size, size);
         ctx.drawImage(img, 0, 0);
         const pngFile = canvas.toDataURL('image/png');
         const downloadLink = document.createElement('a');
         downloadLink.download = 'qrcode.png';
         downloadLink.href = pngFile;
         downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 text-slate-800 dark:text-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-6">
           <div>
             <label className="block text-sm font-bold mb-2">QR Content</label>
             <textarea 
               value={text} 
               onChange={e => setText(e.target.value)} 
               placeholder="Enter URL, text, or data..."
               className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
             />
           </div>

           <div>
             <label className="block text-sm font-bold mb-2">Size: {size}px</label>
             <input type="range" min="100" max="600" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full accent-indigo-500" />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-bold mb-2">Foreground</label>
                 <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
              </div>
              <div>
                 <label className="block text-sm font-bold mb-2">Background</label>
                 <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
              </div>
           </div>

           <div>
             <label className="block text-sm font-bold mb-2">Error Correction Level</label>
             <select value={level} onChange={e => setLevel(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
               <option value="L">L - Low (7%)</option>
               <option value="M">M - Medium (15%)</option>
               <option value="Q">Q - Quartile (25%)</option>
               <option value="H">H - High (30%)</option>
             </select>
           </div>
        </div>

        {/* Preview */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
           <div className="bg-white p-4 rounded-xl shadow-lg mb-8 transition-all" style={{ backgroundColor: bgColor }}>
              <QRCodeSVG 
                id="qr-code"
                value={text || ' '} 
                size={Math.min(size, 300)} 
                fgColor={fgColor}
                bgColor={bgColor}
                level={level}
                includeMargin={false}
              />
           </div>

           <button 
             onClick={downloadQR}
             disabled={!text}
             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg transition-colors"
           >
             <Download className="w-5 h-5" /> Download PNG
           </button>
        </div>

      </div>
    </div>
  );
}
