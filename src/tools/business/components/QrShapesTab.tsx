import React from 'react';
import { Sparkles, Image as ImageIcon, Heart, MessageSquare, Tv, Shield, Music, Shapes } from 'lucide-react';
import { SHAPE_KEYS, MOCK_QR_PATTERN, paths } from '../qr-constants';

export function QrShapesTab({ state, setters }: any) {
  const { stickerMode, stickerTemplate, stickerCaption, sticker3D, shapeMode, shapePadding, eclPercent } = state;
  const { setStickerMode, setStickerTemplate, setStickerCaption, setSticker3D, setShapeMode, setShapePadding, setEclPercent } = setters;

  return (
     <div className="animate-in fade-in zoom-in-95 duration-400 space-y-8">
        {/* High-end Segmented Switch */}
        <div className="flex bg-slate-100 dark:bg-[#111111] p-1.5 rounded-full max-w-lg shadow-inner border border-slate-200/50 dark:border-[#2A2A2A]">
          <button
            onClick={() => setStickerMode('sticker')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold tracking-wide uppercase rounded-full transition-all duration-300 ${stickerMode === 'sticker' ? 'bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
             ✨ Graphic Sticker Frames
          </button>
          <button
            onClick={() => setStickerMode('silhouette')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold tracking-wide uppercase rounded-full transition-all duration-300 ${stickerMode === 'silhouette' ? 'bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
             👤 Silhouette Cut Masks
          </button>
          <button
            onClick={() => setStickerMode('container')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold tracking-wide uppercase rounded-full transition-all duration-300 ${stickerMode === 'container' ? 'bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
             📦 Container Shape
          </button>
        </div>

        {stickerMode === 'sticker' && (
           <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 px-6 py-5 rounded-[2rem] flex items-start md:items-center gap-4 text-amber-900 dark:text-amber-200 shadow-sm">
                 <div className="bg-amber-100 dark:bg-amber-500/20 p-2.5 rounded-2xl flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                 </div>
                 <span className="text-sm leading-relaxed font-medium">Embed your complete QR code safely inside creative, themed sticker frame vector silhouettes! This ensures 100% data preservation and professional physical print quality.</span>
              </div>

              {/* Grid of Sticker types */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                 {[
                   { id: 'polaroid', label: 'Vintage Polaroid', icon: ImageIcon, desc: 'Classic retro card featuring an elegant serif caption label' },
                   { id: 'balloon', label: 'Heart Balloon', icon: Heart, desc: 'Puffy pink heart balloon with gloss cartoon highlights and string' },
                   { id: 'speech', label: 'Chat Dialog Box', icon: MessageSquare, desc: 'Sleek communication bubble complete with dialogue tip' },
                   { id: 'computer', label: 'Retro Computer', icon: Tv, desc: 'Classic vintage PC terminal monitor enclosing the QR code' },
                   { id: 'shield', label: 'Golden Shield', icon: Shield, desc: 'Premium verified protection badge with golden sashes' },
                   { id: 'cat', label: 'Cute Kitty Cat', icon: Sparkles, desc: 'Playful orange feline template with whiskers and ears' },
                   { id: 'music', label: 'Vinyl Track Player', icon: Music, desc: 'Modern audio layout with linear scrubber line and media controllers' }
                 ].map(t => {
                    const IconComp = t.icon;
                    const isSelected = stickerTemplate === t.id;
                    return (
                       <button
                         key={t.id}
                         onClick={() => { setStickerTemplate(t.id as any); if (t.id === 'balloon') { setStickerCaption('TAP ME!'); } else if (t.id === 'cat') { setStickerCaption('MEOW!'); } else if (t.id === 'music') { setStickerCaption('PLAY MUSIC!'); } }}
                         className={`p-5 rounded-[2rem] border-[2px] text-left flex flex-col justify-between transition-all duration-300 outline-none hover:-translate-y-1 ${isSelected ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-500/10 dark:border-indigo-500 dark:bg-[#111111]' : 'border-slate-100 dark:border-[#2A2A2A] bg-[#FAFAFA] hover:bg-white hover:border-slate-300 hover:shadow-md dark:bg-[#161616] dark:hover:bg-[#1A1A1A] dark:hover:border-[#333]'}`}
                       >
                          <div className="flex items-center gap-4 mb-3">
                             <div className={`p-3 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-200 text-slate-600 dark:bg-[#2A2A2A] dark:text-slate-400'}`}>
                                <IconComp className="w-5 h-5" />
                             </div>
                             <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.label}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{t.desc}</p>
                       </button>
                    );
                 })}
              </div>

              {/* Dynamic Custom parameters for Stickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                 <div className="bg-[#FAFAFA] dark:bg-[#161616] border border-slate-100 dark:border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm">
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-3 tracking-wider">Sticker Caption Text</label>
                    <input
                      type="text"
                      value={stickerCaption}
                      onChange={e => setStickerCaption(e.target.value)}
                      placeholder="SCAN ME!"
                      className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white font-bold text-[13px] shadow-sm transition-all text-center tracking-wide uppercase"
                      maxLength={22}
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-medium">Personalize the text written on the sticker plate template.</p>
                 </div>

                 <div className="bg-[#FAFAFA] dark:bg-[#161616] border border-slate-100 dark:border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm flex flex-col justify-center">
                    <label className="flex items-center gap-4 cursor-pointer select-none group">
                       <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 transition duration-300 ease-in-out shrink-0">
                          <input type="checkbox" checked={sticker3D} onChange={e => setSticker3D(e.target.checked)} className="peer absolute left-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                          <span className={`absolute left-0 w-full h-full rounded-full transition-colors duration-300 ${sticker3D ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-[#333]'}`}></span>
                          <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 cubic-bezier(0.4,0.0,0.2,1) shadow-sm ${sticker3D ? 'transform translate-x-6' : ''}`}></span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Enable 3D Silhouette Outline</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Adds a sleek, physical die-cut white contour border and drop shadow.</span>
                       </div>
                    </label>
                 </div>
              </div>
           </div>
        )}
        {stickerMode === 'silhouette' && (
           <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-500/20 px-6 py-5 rounded-[2rem] flex items-start md:items-center gap-4 text-indigo-900 dark:text-indigo-200 shadow-sm">
                 <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2.5 rounded-2xl flex-shrink-0">
                    <Shapes className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <span className="text-sm leading-relaxed font-medium">Shape your QR code's actual pixel grid into a unique silhouette profile. Sets the ECL level to Maximum (H-30%) and shields finder squares for optimal scans.</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-4">
                {SHAPE_KEYS.map(s => (
                   <button 
                     key={s} 
                     title={s}
                     onClick={() => setShapeMode(s as any)}
                     className={`aspect-square rounded-[1.5rem] border-2 flex items-center justify-center p-3 sm:p-4 transition-all duration-300 outline-none hover:-translate-y-1 ${shapeMode === s ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-500/20 scale-[1.05] dark:bg-[#111111] dark:border-indigo-500' : 'border-slate-100 dark:border-[#2A2A2A] hover:border-slate-300 dark:hover:border-[#333] bg-[#FAFAFA] dark:bg-[#161616] hover:bg-white hover:shadow-md'}`}
                   >
                      <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-sm transition-colors ${shapeMode === s ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-300'}`}>
                        <defs>{MOCK_QR_PATTERN}</defs>
                        {s === 'default' && <rect x="5" y="5" width="90" height="90" fill="url(#qr-pattern)" stroke="currentColor" strokeWidth="4" rx="4" />}
                        {s === 'circle' && <circle cx="50" cy="50" r="45" fill="url(#qr-pattern)" stroke="currentColor" strokeWidth="4" />}
                        {s !== 'default' && s !== 'circle' && paths[s] && (
                           <path d={paths[s]} fill="url(#qr-pattern)" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                        )}
                      </svg>
                   </button>
                ))}
              </div>

              {shapeMode !== 'default' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className="bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-slate-100 dark:border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm">
                     <label className="flex justify-between items-center text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-4 tracking-wider">
                       <span>Shape Outer Margin</span>
                       <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-[#111111] px-3 py-1 rounded-full">{shapePadding}px</span>
                     </label>
                     <input type="range" min="0" max="40" step="1" value={shapePadding} onChange={e => setShapePadding(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                     <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">Adjust space around the outer silhouette boundary.</p>
                   </div>

                   <div className="bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-slate-100 dark:border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm">
                     <label className="flex justify-between items-center text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 mb-4 tracking-wider">
                       <span>ECL Max Masking Budget</span>
                       <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-[#111111] px-3 py-1 rounded-full">H-{eclPercent}%</span>
                     </label>
                     <input type="range" min="30" max="100" step="1" value={eclPercent} onChange={e => setEclPercent(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                     <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">Allows you to scale error correction level from 30% to 100% for ultimate mask detail control.</p>
                   </div>
                 </div>
              )}
           </div>
        )}
        {stickerMode === 'container' && (
           <div className="space-y-8 animate-in fade-in duration-300">
             <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-500/20 px-6 py-5 rounded-[2rem] flex items-start md:items-center gap-4 text-purple-900 dark:text-purple-200 shadow-sm">
                 <div className="bg-purple-100 dark:bg-purple-500/20 p-2.5 rounded-2xl flex-shrink-0">
                    <Shapes className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                 </div>
                 <span className="text-sm leading-relaxed font-medium">Place your QR code inside a larger thematic container.</span>
             </div>
             {/* Grid of Container types - reuse the same grid logic as sticker but with different templates if needed */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                 {[
                   { id: 'cat', label: 'Cat Container', icon: Sparkles },
                   { id: 'shield', label: 'Shield Container', icon: Shield },
                 ].map(t => {
                    const IconComp = t.icon;
                    const isSelected = stickerTemplate === t.id;
                    return (
                       <button
                         key={t.id}
                         onClick={() => setStickerTemplate(t.id as any)}
                         className={`p-5 rounded-[2rem] border-[2px] text-left flex flex-col justify-between transition-all duration-300 outline-none hover:-translate-y-1 ${isSelected ? 'border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-500/10 dark:border-purple-500 dark:bg-[#111111]' : 'border-slate-100 dark:border-[#2A2A2A] bg-[#FAFAFA] hover:bg-white hover:border-slate-300 hover:shadow-md dark:bg-[#161616] dark:hover:bg-[#1A1A1A] dark:hover:border-[#333]'}`}
                       >
                          <div className="flex items-center gap-4 mb-3">
                             <div className={`p-3 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-600 text-white dark:bg-purple-500' : 'bg-slate-200 text-slate-600 dark:bg-[#2A2A2A] dark:text-slate-400'}`}>
                                <IconComp className="w-5 h-5" />
                             </div>
                             <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.label}</span>
                          </div>
                       </button>
                    );
                 })}
             </div>
           </div>
        )}
     </div>
  );
}
