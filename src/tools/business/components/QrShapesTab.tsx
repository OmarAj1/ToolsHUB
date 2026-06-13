import React from 'react';
import { Sparkles, Image as ImageIcon, Heart, MessageSquare, Tv, Shield, Music, Shapes, Hexagon, Leaf, Home, Camera, Beaker, Book, Star, Diamond, PawPrint } from 'lucide-react';
import { SHAPE_KEYS, MOCK_QR_PATTERN, paths } from '../qr-constants';

export function QrShapesTab({ state, setters }: any) {
  const { stickerMode, stickerTemplate, stickerCaption, sticker3D, shapeMode, shapePadding, eclPercent } = state;
  const { setStickerMode, setStickerTemplate, setStickerCaption, setSticker3D, setShapeMode, setShapePadding, setEclPercent } = setters;

  return (
     <div className="animate-in fade-in zoom-in-95 duration-400 space-y-8">
        {/* High-end Segmented Switch */}
        <div className="flex bg-slate-800 bg-[#111111] p-1.5 rounded-full max-w-lg shadow-inner border border-slate-700/50 border-[#2A2A2A]">
          <button
            onClick={() => setStickerMode('sticker')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold tracking-wide uppercase rounded-full transition-all duration-300 ${stickerMode === 'sticker' ? 'bg-slate-800 bg-[#222] text-blue-600 text-blue-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)] shadow-[0_4px_12px_rgba(0,0,0,0.4)] scale-[1.02]' : 'text-slate-400 text-slate-50 hover:text-slate-50 hover:text-slate-200'}`}
          >
             ✨ Stickers
          </button>
          <button
            onClick={() => setStickerMode('silhouette')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold tracking-wide uppercase rounded-full transition-all duration-300 ${stickerMode === 'silhouette' ? 'bg-slate-800 bg-[#222] text-blue-600 text-blue-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)] shadow-[0_4px_12px_rgba(0,0,0,0.4)] scale-[1.02]' : 'text-slate-400 text-slate-50 hover:text-slate-50 hover:text-slate-200'}`}
          >
             👤 Silhouettes
          </button>
          <button
            onClick={() => setStickerMode('container')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold tracking-wide uppercase rounded-full transition-all duration-300 ${stickerMode === 'container' ? 'bg-slate-800 bg-[#222] text-blue-600 text-blue-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)] shadow-[0_4px_12px_rgba(0,0,0,0.4)] scale-[1.02]' : 'text-slate-400 text-slate-50 hover:text-slate-50 hover:text-slate-200'}`}
          >
             📦 Containers
          </button>
        </div>

        {stickerMode === 'sticker' && (
           <div className="space-y-8 animate-in fade-in duration-300">
              {/* Grid of Sticker types */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5">
                 {[
                   { id: 'polaroid', label: 'Polaroid', icon: ImageIcon },
                   { id: 'balloon', label: 'Balloon', icon: Heart },
                   { id: 'speech', label: 'Dialog', icon: MessageSquare },
                   { id: 'computer', label: 'Computer', icon: Tv },
                   { id: 'shield', label: 'Shield', icon: Shield },
                   { id: 'cat', label: 'Cat', icon: Sparkles },
                   { id: 'music', label: 'Music', icon: Music }
                 ].map(t => {
                    const IconComp = t.icon;
                    const isSelected = stickerTemplate === t.id;
                    return (
                       <button
                         key={t.id}
                         onClick={() => { setStickerTemplate(t.id as any); if (t.id === 'balloon') { setStickerCaption('TAP ME!'); } else if (t.id === 'cat') { setStickerCaption('MEOW!'); } else if (t.id === 'music') { setStickerCaption('PLAY MUSIC!'); } }}
                         className={`p-4 rounded-[2rem] border-[2px] flex flex-col items-center justify-center transition-all duration-300 outline-none hover:-translate-y-1 ${isSelected ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10 border-blue-500 bg-[#111111]' : 'border-slate-700 border-[#2A2A2A] bg-[#FAFAFA] hover:bg-slate-800 hover:border-slate-700 hover:shadow-md bg-[#161616] hover:bg-[#1A1A1A] hover:border-[#333]'}`}
                       >
                          <div className={`p-4 rounded-2xl flex items-center justify-center transition-colors mb-2 ${isSelected ? 'bg-blue-500 text-white bg-blue-500' : 'bg-slate-200 text-slate-50 bg-[#2A2A2A] text-slate-50'}`}>
                             <IconComp className="w-6 h-6 text-purple-500" />
                          </div>
                          <span className="font-bold text-xs text-slate-50 text-slate-50">{t.label}</span>
                       </button>
                    );
                 })}
              </div>

              {/* Dynamic Custom parameters for Stickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                 <div className="bg-[#FAFAFA] bg-[#161616] border border-slate-700 border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm">
                    <label className="block text-[11px] font-bold uppercase text-slate-400 text-slate-50 mb-3 tracking-wider">Caption</label>
                    <input
                      type="text"
                      value={stickerCaption}
                      onChange={e => setStickerCaption(e.target.value)}
                      placeholder="SCAN ME!"
                      className="w-full bg-slate-800 bg-[#111111] border border-slate-700 border-[#333] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white font-bold text-[13px] shadow-sm transition-all text-center tracking-wide uppercase"
                      maxLength={22}
                    />
                 </div>

                 <div className="bg-[#FAFAFA] bg-[#161616] border border-slate-700 border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm flex flex-col justify-center">
                    <label className="flex items-center gap-4 cursor-pointer select-none group">
                       <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 bg-slate-800 transition duration-300 ease-in-out shrink-0">
                          <input type="checkbox" checked={sticker3D} onChange={e => setSticker3D(e.target.checked)} className="peer absolute left-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                          <span className={`absolute left-0 w-full h-full rounded-full transition-colors duration-300 ${sticker3D ? 'bg-blue-500' : 'bg-slate-200 bg-[#333]'}`}></span>
                          <span className={`absolute top-1 left-1 w-4 h-4 bg-slate-800 rounded-full transition-transform duration-300 cubic-bezier(0.4,0.0,0.2,1) shadow-sm ${sticker3D ? 'transform translate-x-6' : ''}`}></span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-slate-50 text-slate-50 group-hover:text-blue-600 group-hover:text-blue-400 transition-colors">3D Outline</span>
                       </div>
                    </label>
                 </div>
              </div>
           </div>
        )}
        {stickerMode === 'silhouette' && (
           <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-4">
                {SHAPE_KEYS.map(s => (
                   <button 
                     key={s} 
                     title={s}
                     onClick={() => setShapeMode(s as any)}
                     className={`aspect-square rounded-[1.5rem] border-2 flex items-center justify-center p-3 sm:p-4 transition-all duration-300 outline-none hover:-translate-y-1 ${shapeMode === s ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/20 scale-[1.05] bg-[#111111] border-blue-500' : 'border-slate-700 border-[#2A2A2A] hover:border-slate-700 hover:border-[#333] bg-[#FAFAFA] bg-[#161616] hover:bg-slate-800 hover:shadow-md'}`}
                   >
                      <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-sm transition-colors ${shapeMode === s ? 'text-blue-600 text-blue-400' : 'text-slate-50 text-slate-50'}`}>
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
                   <div className="bg-[#FAFAFA] bg-[#1A1A1A] border border-slate-700 border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm">
                     <label className="flex justify-between items-center text-xs font-bold uppercase text-slate-400 text-slate-50 mb-4 tracking-wider">
                       <span>Shape Outer Margin</span>
                       <span className="text-blue-600 text-blue-400 bg-blue-50 bg-[#111111] px-3 py-1 rounded-full">{shapePadding}px</span>
                     </label>
                     <input type="range" min="0" max="40" step="1" value={shapePadding} onChange={e => setShapePadding(Number(e.target.value))} className="w-full h-2 bg-slate-200 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                   </div>

                   <div className="bg-[#FAFAFA] bg-[#1A1A1A] border border-slate-700 border-[#2A2A2A] p-6 rounded-[2rem] shadow-sm">
                     <label className="flex justify-between items-center text-[11px] font-extrabold uppercase text-slate-400 text-slate-50 mb-4 tracking-wider">
                       <span>ECL Max Masking Budget</span>
                       <span className="text-blue-600 text-blue-400 bg-blue-50 bg-[#111111] px-3 py-1 rounded-full">H-{eclPercent}%</span>
                     </label>
                     <input type="range" min="30" max="100" step="1" value={eclPercent} onChange={e => setEclPercent(Number(e.target.value))} className="w-full h-2 bg-slate-200 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                   </div>
                 </div>
              )}
           </div>
        )}
        {stickerMode === 'container' && (
           <div className="space-y-8 animate-in fade-in duration-300">
             {/* Grid of Container types - reuse the same grid logic as sticker but with different templates if needed */}
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                 {[
                   { id: 'cat', label: 'Cat', icon: Sparkles },
                   { id: 'shield', label: 'Shield', icon: Shield },
                   { id: 'heart', label: 'Heart', icon: Heart },
                   { id: 'star', label: 'Star', icon: Star },
                   { id: 'diamond', label: 'Diamond', icon: Diamond },
                   { id: 'hexagon', label: 'Hexagon', icon: Hexagon },
                   { id: 'leaf', label: 'Leaf', icon: Leaf },
                   { id: 'house', label: 'House', icon: Home },
                   { id: 'camera', label: 'Camera', icon: Camera },
                   { id: 'flask', label: 'Flask', icon: Beaker },
                   { id: 'book', label: 'Book', icon: Book },
                   { id: 'paw', label: 'Paw', icon: PawPrint },
                 ].map(t => {
                    const IconComp = t.icon;
                    const isSelected = stickerTemplate === t.id;
                    return (
                       <button
                         key={t.id}
                         onClick={() => setStickerTemplate(t.id as any)}
                         className={`p-4 rounded-[2rem] border-[2px] flex flex-col items-center justify-center transition-all duration-300 outline-none hover:-translate-y-1 ${isSelected ? 'border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-500/10 border-purple-500 bg-[#111111]' : 'border-slate-700 border-[#2A2A2A] bg-[#FAFAFA] hover:bg-slate-800 hover:border-slate-700 hover:shadow-md bg-[#161616] hover:bg-[#1A1A1A] hover:border-[#333]'}`}
                       >
                          <div className={`p-4 rounded-2xl flex items-center justify-center transition-colors mb-2 ${isSelected ? 'bg-purple-600 text-white bg-purple-500' : 'bg-slate-200 text-slate-50 bg-[#2A2A2A] text-slate-50'}`}>
                             <IconComp className="w-6 h-6 text-purple-500" />
                          </div>
                          <span className="font-bold text-xs text-slate-50 text-slate-50">{t.label}</span>
                       </button>
                    );
                 })}
             </div>
           </div>
        )}
     </div>
  );
}
