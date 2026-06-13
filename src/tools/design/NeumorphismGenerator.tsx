import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

function colorLuminance(hex: string, lum: number) {
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  let rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }
  return rgb;
}

function NeumorphismGeneratorBase() {
  const [size, setSize] = useState(200);
  const [radius, setRadius] = useState(50);
  const [distance, setDistance] = useState(20);
  const [intensity, setIntensity] = useState(0.15);
  const [blur, setBlur] = useState(40);
  const [shape, setShape] = useState<'flat' | 'concave' | 'convex' | 'pressed'>('flat');
  const [color, setColor] = useState('#e0e5ec');
  const [copied, setCopied] = useState(false);

  const lightColor = colorLuminance(color, intensity);
  const darkColor = colorLuminance(color, -intensity);

  let boxShadow = '';
  let background = color;

  if (shape === 'flat') {
    boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  } else if (shape === 'pressed') {
    boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
  } else if (shape === 'concave') {
    background = `linear-gradient(145deg, ${darkColor}, ${lightColor})`;
    boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  } else if (shape === 'convex') {
    background = `linear-gradient(145deg, ${lightColor}, ${darkColor})`;
    boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  }

  const cssString = `border-radius: ${radius}px;
background: ${background};
box-shadow: ${boxShadow};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[60vh] text-slate-50 text-slate-50">
      {/* Visual Editor (Preview) */}
      <div 
        className="flex-1 p-8 flex items-center justify-center relative overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: color }}
      >
        <div 
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${radius}px`,
            background,
            boxShadow,
            transition: 'all 0.3s ease'
          }}
        />
      </div>

      {/* Controls */}
      <div className="w-full md:w-96 bg-slate-800 bg-slate-800 border-l border-slate-700 border-slate-700 p-6 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div>
          <label className="text-sm font-bold block mb-2">Base Color</label>
          <div className="flex items-center gap-4">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Shape</label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {['flat', 'pressed', 'concave', 'convex'].map((s) => (
              <button
                key={s}
                onClick={() => setShape(s as any)}
                className={`py-2 rounded border transition-colors ${shape === s ? 'bg-blue-50 border-blue-200 text-blue-700 bg-blue-900/30 border-blue-800 text-blue-400 font-bold' : 'bg-slate-800 border-slate-700 text-slate-50 hover:bg-slate-900 bg-slate-800 border-slate-700 text-slate-50'}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Size</label>
          <input type="range" min="10" max="400" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Radius</label>
          <input type="range" min="0" max="200" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Distance</label>
          <input type="range" min="1" max="50" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Intensity</label>
          <input type="range" min="0.01" max="0.6" step="0.01" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Blur</label>
          <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>

        <div className="mt-4 flex-1">
          <label className="text-sm font-bold block mb-2 text-blue-600 text-blue-400">CSS Code</label>
          <div className="relative group">
            <pre className="p-4 bg-slate-800 bg-slate-900 rounded-lg text-sm font-mono text-slate-50 text-slate-50 overflow-x-auto border border-slate-700 border-slate-700">
              <code>{cssString}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-slate-800 bg-slate-800 text-slate-50 text-slate-50 hover:text-blue-600 hover:text-blue-400 rounded-md shadow-sm border border-slate-700 border-slate-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-purple-500" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const NeumorphismGenerator = () => <GenericToolWrapper toolName="NeumorphismGenerator"><NeumorphismGeneratorBase /></GenericToolWrapper>;
