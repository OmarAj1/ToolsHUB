import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState, useRef } from 'react';
import { Copy, Upload, Image as ImageIcon, Check } from 'lucide-react';

function ImageToColorsBase() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<{ hex: string, percentage: number }[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const handleImageLoad = () => {
    extractColors();
  };

  const extractColors = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      // Draw image to canvas (scaled down to improve performance)
      const MAX_SIZE = 200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height).data;
      const colorCounts: Record<string, number> = {};

      // Basic Color Quantization (grouping similar colors)
      for (let i = 0; i < imageData.length; i += 16) { // step by 4 pixels to speed up
        const r = Math.round(imageData[i] / 24) * 24;
        const g = Math.round(imageData[i + 1] / 24) * 24;
        const b = Math.round(imageData[i + 2] / 24) * 24;
        const a = imageData[i + 3];

        if (a >= 125) { // ignore mostly transparent pixels
          const hex = rgbToHex(
            Math.min(255, r), 
            Math.min(255, g), 
            Math.min(255, b)
          );
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }
      }

      // Sort colors by count and take top 8
      let sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
      
      // Filter out grays/whites/blacks if possible to favor vibrant colors
      // A simple heuristic: check color saturation or difference between rgb
      const isVibrant = (hex: string) => {
         const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
         if (!result) return false;
         const r = parseInt(result[1], 16), g = parseInt(result[2], 16), b = parseInt(result[3], 16);
         const max = Math.max(r, g, b), min = Math.min(r, g, b);
         return (max - min) > 30 && max > 50 && min < 220;
      };

      const vibrantColors = sortedColors.filter(c => isVibrant(c[0]));
      // Fill the rest with popular colors if not enough vibrant ones
      const finalColorsRaw = [...vibrantColors.slice(0, 5), ...sortedColors].filter((v, i, a) => a.findIndex(t => (t[0] === v[0])) === i).slice(0, 8);

      const totalPixels = finalColorsRaw.reduce((sum, [_, count]) => sum + count, 0);
      
      const finalColors = finalColorsRaw.map(([hex, count]) => ({
        hex,
        percentage: Math.round((count / totalPixels) * 100)
      }));

      setColors(finalColors);
    };
    img.src = imageSrc;
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="p-6 md:p-8 text-slate-50 text-slate-50">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-xl font-bold mb-1">Image to Colors</h2>
            <p className="text-sm text-slate-400 text-slate-50">Extract dominant colors from an image fully offline.</p>
          </div>
          
          <label className="relative cursor-pointer group">
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            <div className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors">
              <Upload className="w-4 h-4 text-purple-500" />
              Upload Image
            </div>
          </label>
        </div>

        {imageSrc ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-4 rounded-2xl shadow-sm flex items-center justify-center min-h-[300px]">
               <img 
                 src={imageSrc} 
                 alt="Uploaded preview" 
                 className="max-h-[60vh] max-w-full rounded-lg object-contain" 
                 onLoad={handleImageLoad}
               />
               <canvas ref={canvasRef} className="hidden" />
             </div>

             <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold mb-6 text-lg">Dominant Colors</h3>
                {colors.length > 0 ? (
                  <div className="space-y-4">
                    {colors.map((c, i) => (
                      <div key={i} className="flex flex-col">
                        <div className="flex items-center justify-between mb-1.5 px-1">
                          <span className="font-mono font-bold uppercase">{c.hex}</span>
                          <span className="text-xs font-bold text-slate-400">{c.percentage}%</span>
                        </div>
                        <div className="flex items-stretch h-12 rounded-lg overflow-hidden border border-slate-700 border-slate-700 shadow-sm relative group cursor-pointer" onClick={() => copyToClipboard(c.hex)}>
                           <div className="flex-1 transition-opacity group-hover:opacity-90" style={{ backgroundColor: c.hex }}></div>
                           <button className="flex items-center justify-center w-12 bg-slate-900 bg-slate-800 border-l border-slate-700 border-slate-700 text-slate-400 group-hover:text-blue-500 transition-colors">
                             {copied === c.hex ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-purple-500" />}
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-400 gap-3">
                    <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-sm font-bold animate-pulse">Extracting colors...</span>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-700 border-slate-700 rounded-2xl h-[40vh] flex flex-col items-center justify-center text-slate-400 gap-4">
             <ImageIcon className="w-16 h-16 opacity-50 text-purple-500" />
             <div className="text-center">
               <p className="font-bold text-lg text-slate-400 text-slate-50">No image selected</p>
               <p className="text-sm mt-1">Upload an image to extract its color palette.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

export const ImageToColors = () => <GenericToolWrapper toolName="ImageToColors"><ImageToColorsBase /></GenericToolWrapper>;
