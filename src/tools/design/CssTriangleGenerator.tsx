import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function CssTriangleGeneratorBase() {
  const [direction, setDirection] = useState<'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('top');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState(false);

  const getTriangleStyles = () => {
    let styles: any = {
      width: 0,
      height: 0,
      borderStyle: 'solid',
    };

    switch (direction) {
      case 'top':
        styles.borderWidth = `0 ${width / 2}px ${height}px ${width / 2}px`;
        styles.borderColor = `transparent transparent ${color} transparent`;
        break;
      case 'right':
        styles.borderWidth = `${height / 2}px 0 ${height / 2}px ${width}px`;
        styles.borderColor = `transparent transparent transparent ${color}`;
        break;
      case 'bottom':
        styles.borderWidth = `${height}px ${width / 2}px 0 ${width / 2}px`;
        styles.borderColor = `${color} transparent transparent transparent`;
        break;
      case 'left':
        styles.borderWidth = `${height / 2}px ${width}px ${height / 2}px 0`;
        styles.borderColor = `transparent ${color} transparent transparent`;
        break;
      case 'top-right':
        styles.borderWidth = `0 ${width}px ${height}px 0`;
        styles.borderColor = `transparent ${color} transparent transparent`;
        break;
      case 'top-left':
        styles.borderWidth = `${height}px ${width}px 0 0`;
        styles.borderColor = `${color} transparent transparent transparent`;
        break;
      case 'bottom-right':
        styles.borderWidth = `0 0 ${height}px ${width}px`;
        styles.borderColor = `transparent transparent ${color} transparent`;
        break;
      case 'bottom-left':
        styles.borderWidth = `${height}px 0 0 ${width}px`;
        styles.borderColor = `transparent transparent transparent ${color}`;
        break;
    }
    return styles;
  };

  const getCssString = () => {
    const styles: any = getTriangleStyles();
    return `.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: ${styles.borderWidth};
  border-color: ${styles.borderColor};
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCssString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const directions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top', label: 'Top' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'left', label: 'Left' },
    { value: '', label: '', empty: true },
    { value: 'right', label: 'Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[60vh] text-slate-50 text-slate-50">
      {/* Visual Editor (Preview) */}
      <div className="flex-1 p-8 flex shadow-inner items-center justify-center relative overflow-hidden bg-slate-900 bg-slate-900/50">
        <div style={getTriangleStyles()} />
      </div>

      {/* Controls */}
      <div className="w-full md:w-96 bg-slate-800 bg-slate-800 border-l border-slate-700 border-slate-700 p-6 flex flex-col gap-6">
        <div>
          <label className="text-sm font-bold block mb-4">Direction</label>
          <div className="grid grid-cols-3 gap-2">
            {directions.map((d, i) => (
              d.empty ? <div key={i} /> : (
                <button
                  key={i}
                  onClick={() => setDirection(d.value as any)}
                  className={`h-10 rounded border text-xs font-bold transition-colors ${direction === d.value ? 'bg-blue-50 border-blue-200 text-blue-700 bg-blue-900/30 border-blue-800 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-900 bg-slate-800 border-slate-700 text-slate-50'}`}
                >
                  {d.label}
                </button>
              )
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Width: {width}px</label>
          <input type="range" min="10" max="300" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Height: {height}px</label>
          <input type="range" min="10" max="300" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>

        <div>
           <label className="text-sm font-bold block mb-2">Color</label>
           <div className="flex items-center gap-4">
             <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded cursor-pointer" />
           </div>
        </div>

        <div className="mt-4 flex-1">
          <label className="text-sm font-bold block mb-2 text-blue-600 text-blue-400">CSS Code</label>
          <div className="relative group">
            <pre className="p-4 bg-slate-800 bg-slate-900 rounded-lg text-sm font-mono text-slate-50 text-slate-50 overflow-x-auto border border-slate-700 border-slate-700">
              <code>{getCssString()}</code>
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

export const CssTriangleGenerator = () => <GenericToolWrapper toolName="CssTriangleGenerator"><CssTriangleGeneratorBase /></GenericToolWrapper>;
