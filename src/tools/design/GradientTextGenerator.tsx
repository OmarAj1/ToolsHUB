import React, { useState } from 'react';
import { Copy } from 'lucide-react';

export function GradientTextGenerator() {
  const [text, setText] = useState('Gradient Text Styles');
  const [color1, setColor1] = useState('#8B5CF6');
  const [color2, setColor2] = useState('#EC4899');
  const [color3, setColor3] = useState(''); // Optional third color
  const [angle, setAngle] = useState(45);
  const [fontSize, setFontSize] = useState(64);
  const [fontWeight, setFontWeight] = useState('800');

  const gradientCSS = `linear-gradient(${angle}deg, ${color1}, ${color2}${color3 ? `, ${color3}` : ''})`;

  const cssOutput = `background: ${gradientCSS};
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`.${text.replace(/\s+/g, '-').toLowerCase()} {\n  font-size: ${fontSize}px;\n  font-weight: ${fontWeight};\n  ${cssOutput.replace(/\n/g, '\n  ')}\n}`);
  };

  return (
    <div className="max-w-5xl animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Preview Text</label>
              <input 
                type="text" 
                value={text} 
                onChange={e => setText(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Color 1</label>
                <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden p-1">
                  <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-8 h-8 rounded border-0 p-0 cursor-pointer" />
                  <input type="text" value={color1} onChange={e => setColor1(e.target.value)} className="w-full px-2 text-xs uppercase bg-transparent outline-none text-slate-700 dark:text-slate-300" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Color 2</label>
                <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden p-1">
                  <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-8 h-8 rounded border-0 p-0 cursor-pointer" />
                  <input type="text" value={color2} onChange={e => setColor2(e.target.value)} className="w-full px-2 text-xs uppercase bg-transparent outline-none text-slate-700 dark:text-slate-300" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Color 3 (Optional)</label>
                <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden p-1">
                  <input type="color" value={color3 || '#ffffff'} onChange={e => setColor3(e.target.value)} className="w-8 h-8 rounded border-0 p-0 cursor-pointer" />
                  <input type="text" placeholder="Hex" value={color3} onChange={e => setColor3(e.target.value)} className="w-full px-2 text-xs uppercase bg-transparent outline-none text-slate-700 dark:text-slate-300" />
                </div>
                {color3 && <button onClick={() => setColor3('')} className="text-[10px] uppercase text-red-500 font-bold block w-full text-right mt-1">Clear</button>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex justify-between text-slate-700 dark:text-slate-300">
                Gradient Angle <span>{angle}°</span>
              </label>
              <input 
                type="range" min="0" max="360" 
                value={angle} 
                onChange={e => setAngle(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex justify-between text-slate-700 dark:text-slate-300">
                  Font Size <span>{fontSize}px</span>
                </label>
                <input 
                  type="range" min="16" max="120" 
                  value={fontSize} 
                  onChange={e => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Font Weight</label>
                <select 
                  value={fontWeight} 
                  onChange={e => setFontWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                >
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button onClick={() => {setColor1('#FACC15'); setColor2('#E11D48'); setColor3(''); setAngle(45)}} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" style={{ background: 'linear-gradient(45deg, #FACC15, #E11D48)' }}></button>
              <button onClick={() => {setColor1('#38BDF8'); setColor2('#3B82F6'); setColor3('#4F46E5'); setAngle(90)}} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" style={{ background: 'linear-gradient(90deg, #38BDF8, #3B82F6, #4F46E5)' }}></button>
              <button onClick={() => {setColor1('#10B981'); setColor2('#047857'); setColor3(''); setAngle(135)}} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" style={{ background: 'linear-gradient(135deg, #10B981, #047857)' }}></button>
            </div>
          </div>
        </div>

        {/* Preview & Code */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 min-h-[300px] flex items-center justify-center text-center overflow-hidden">
            <span style={{ 
              backgroundImage: gradientCSS,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight,
              lineHeight: 1.2,
            }}>
              {text}
            </span>
          </div>

          <div className="relative group">
            <pre className="w-full p-4 bg-slate-900 text-slate-50 rounded-2xl text-sm overflow-x-auto font-mono custom-scrollbar">
              {cssOutput.split('\n').map((line, i) => (
                <div key={i}>
                  <code className="text-pink-400">{line.split(':')[0]}</code>
                  <code className="text-slate-300">: </code>
                  <code className="text-teal-300">{line.split(':')[1]?.replace(';', '')}</code>
                  <code className="text-slate-300">;</code>
                </div>
              ))}
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2"
              title="Copy CSS"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
