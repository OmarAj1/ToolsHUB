import React from 'react';

export function QrPatternsTab({ state, setters }: any) {
  const { customPattern, customEyeFrame, customEyeBall } = state;
  const { setCustomPattern, setCustomEyeFrame, setCustomEyeBall } = setters;

  return (
     <div className="space-y-10 max-w-4xl animate-in fade-in zoom-in-95 duration-400">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 ml-1">Matrix Style</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
             {[
               { id: 'square', icon: <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor"/>, label: 'Square' },
               { id: 'dots', icon: <circle cx="12" cy="12" r="8" fill="currentColor"/>, label: 'Dots' },
               { id: 'rounded', icon: <rect x="3" y="3" width="18" height="18" rx="6" fill="currentColor"/>, label: 'Rounded' },
               { id: 'extra-rounded', icon: <rect x="3" y="3" width="18" height="18" rx="9" fill="currentColor"/>, label: 'Smooth' },
               { id: 'classy', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>, label: 'Classy' },
               { id: 'classy-rounded', icon: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 15a5 5 0 1 1 5-5 5 5 0 0 1-5 5z" fill="currentColor"/>, label: 'Classy Round' },
               { id: 'vertical', icon: <rect x="6" y="2" width="12" height="20" rx="3" fill="currentColor"/>, label: 'Vertical' },
               { id: 'horizontal', icon: <rect x="2" y="6" width="20" height="12" rx="3" fill="currentColor"/>, label: 'Horizontal' },
               { id: 'cross', icon: <path d="M16 8h-2V6c0-1.1-.9-2-2-2s-2 .9-2 2v2H8c-1.1 0-2 .9-2 2s.9 2 2 2h2v2c0 1.1.9 2 2 2s2-.9 2-2v-2h2c1.1 0 2-.9 2-2s-.9-2-2-2z" fill="currentColor"/>, label: 'Cross' },
               { id: 'diamond', icon: <path d="M12 2L2 12l10 10 10-10L12 2z" fill="currentColor"/>, label: 'Diamond' },
               { id: 'heart', icon: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>, label: 'Heart' },
               { id: 'leaf', icon: <path d="M17 3H7c-1.1 0-2 .9-2 2v14l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>, label: 'Leaf' },
               { id: 'circle-clusters', icon: <g fill="currentColor"><circle cx="7" cy="7" r="3.5"/><circle cx="17" cy="7" r="3.5"/><circle cx="7" cy="17" r="3.5"/><circle cx="17" cy="17" r="3.5"/></g>, label: 'Clusters' },
               { id: 'target', icon: <g fill="currentColor"><circle cx="12" cy="12" r="10" fillOpacity="0.3"/><circle cx="12" cy="12" r="5"/></g>, label: 'Target' },
               { id: 'ninja', icon: <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/>, label: 'Ninja' }
             ].map(pat => (
                 <button
                   key={pat.id}
                   onClick={() => setCustomPattern(pat.id as any)}
                   className={`flex items-center justify-center p-4 md:p-5 rounded-[1.5rem] border-[2px] transition-all duration-300 group outline-none hover:-translate-y-1 hover:shadow-lg ${customPattern === pat.id ? 'border-indigo-600 bg-indigo-50 shadow-indigo-500/20 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400 scale-[1.05]' : 'border-slate-100 dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#161616] hover:border-slate-300 dark:hover:border-[#444] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                   <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-sm transition-transform group-hover:scale-110">
                      {pat.icon}
                   </svg>
                </button>
             ))}
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 text-[13px] font-extrabold uppercase text-slate-800 dark:text-slate-200 mb-5 tracking-widest pl-2 mt-6">Outer Eye</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
             {[
               { id: 'square', icon: <path d="M3 3h18v18H3V3zm4 4v10h10V7H7z" fill="currentColor"/>, label: 'Square' },
               { id: 'dot', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="currentColor"/>, label: 'Circle' },
               { id: 'extra-rounded', icon: <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm0 4v10h10V7H7z" fill="currentColor"/>, label: 'Rounded' },
               { id: 'leaf', icon: <path d="M3 12c0-4.97 4.03-9 9-9 0 0 9 0 9 9s-4.03 9-9 9c0 0-9 0-9-9zM7 12c0 2.76 2.24 5 5 5h5c0-2.76-2.24-5-5-5H7z" fill="currentColor"/>, label: 'Leaf' },
               { id: 'shield', icon: <path d="M3 3h18v9c0 4.97-4.03 9-9 9s-9-4.03-9-9V3zm4 4v5c0 2.76 2.24 5 5 5s5-2.24 5-5V7H7z" fill="currentColor"/>, label: 'Shield' },
               { id: 'octagon', icon: <path d="M8 2h8l6 6v8l-6 6H8l-6-6V8l6-6zm1.66 4L6 9.66v4.68L9.66 18h4.68L18 14.34V9.66L14.34 6H9.66z" fill="currentColor"/>, label: 'Octagon' },
               { id: 'rotate-square', icon: <path d="M12 2L2 12l10 10 10-10L12 2zm0 5.66L18.34 12 12 18.34 5.66 12 12 7.66z" fill="currentColor"/>, label: 'Diamond' },
               { id: 'double-ring', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm0 2c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="currentColor"/>, label: 'Double Ring' },
               { id: 'stitched', icon: <path d="M3 3h4v4H3V3zm7 0h4v4h-4V3zm7 0h4v4h-4V3zM3 10h4v4H3v-4zm14 0h4v4h-4v-4zM3 17h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4z" fill="currentColor"/>, label: 'Stitched' },
               { id: 'brackets', icon: <path d="M9 3H5v18h4v-4H7V7h2V3zm6 0h4v18h-4v-4h2V7h-2V3z" fill="currentColor"/>, label: 'Brackets' },
               { id: 'fluid', icon: <path d="M12 2v20c-5.52 0-10-4.48-10-10S6.48 2 12 2zm-6 10c0 3.31 2.69 6 6 6V6c-3.31 0-6 2.69-6 6z" fill="currentColor"/>, label: 'Fluid' },
               { id: 'minimalist', icon: <path d="M5 5h14v14H5V5zm2 2v10h10V7H7z" fill="currentColor"/>, label: 'Minimalist' },
               { id: 'microwave', icon: <path d="M4 4h16v16H4V4zm4 4v8h8V8H8z" fill="currentColor"/>, label: 'Microwave' }
             ].map(cor => (
                 <button
                   key={cor.id}
                   onClick={() => setCustomEyeFrame(cor.id)}
                   className={`flex items-center justify-center p-4 md:p-5 rounded-[1.5rem] border-[2px] transition-all duration-300 group outline-none hover:-translate-y-1 hover:shadow-lg ${customEyeFrame === cor.id ? 'border-indigo-600 bg-indigo-50 shadow-indigo-500/20 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400 scale-[1.05]' : 'border-slate-100 dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#161616] hover:border-slate-300 dark:hover:border-[#444] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                   <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 drop-shadow-sm transition-transform group-hover:scale-110">
                      {cor.icon}
                   </svg>
                </button>
             ))}
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 text-[13px] font-extrabold uppercase text-slate-800 dark:text-slate-200 mb-5 tracking-widest pl-2 mt-6">Inner Eye</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
             {[
               { id: 'square', icon: <path d="M6 6h12v12H6z" fill="currentColor"/>, label: 'Square' },
               { id: 'dot', icon: <circle cx="12" cy="12" r="6" fill="currentColor"/>, label: 'Circle' },
               { id: 'rounded', icon: <rect x="6" y="6" width="12" height="12" rx="3" fill="currentColor"/>, label: 'Rounded' },
               { id: 'diamond', icon: <path d="M12 4L4 12l8 8 8-8-8-8z" fill="currentColor"/>, label: 'Diamond' },
               { id: 'leaf', icon: <path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6c0 0-6 0-6-6z" fill="currentColor"/>, label: 'Leaf' },
               { id: 'pillow', icon: <path d="M12 4c-1.1 2.2-2.8 3.9-5 5 2.2 1.1 3.9 2.8 5 5 1.1-2.2 2.8-3.9 5-5-2.2-1.1-3.9-2.8-5-5z" fill="currentColor"/>, label: 'Pillow' },
               { id: 'vertical-capsule', icon: <rect x="8" y="4" width="8" height="16" rx="4" fill="currentColor"/>, label: 'Vertical' },
               { id: 'horizontal-capsule', icon: <rect x="4" y="8" width="16" height="8" rx="4" fill="currentColor"/>, label: 'Horizontal' },
               { id: 'right-triangle', icon: <path d="M8 5v14l11-7z" fill="currentColor"/>, label: 'Right Tri' },
               { id: 'up-triangle', icon: <path d="M12 5l-7 11h14z" fill="currentColor"/>, label: 'Up Tri' },
               { id: 'heart', icon: <path d="M12 20.1l-1.2-1.1C6.4 15.1 3.6 12.5 3.6 9.3 3.6 6.8 5.6 4.8 8.1 4.8c1.4 0 2.8.7 3.9 1.7 1-.9 2.4-1.7 3.9-1.7 2.5 0 4.5 2 4.5 4.5 0 3.2-2.8 5.8-7.2 9.7L12 20.1z" fill="currentColor"/>, label: 'Heart' },
               { id: 'star', icon: <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>, label: 'Star' },
               { id: 'cross', icon: <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" fill="currentColor"/>, label: 'Cross' },
               { id: 'fluid', icon: <path d="M12 3S5 9 5 14.5C5 18.09 8.13 21 12 21s7-2.91 7-6.5C19 9 12 3 12 3z" fill="currentColor"/>, label: 'Drop' },
               { id: 'target', icon: <g fill="currentColor"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="white"/></g>, label: 'Target' },
               { id: 'sliced', icon: <path d="M12 4v7h7c0-3.87-3.13-7-7-7zM5 12h7v7c-3.87 0-7-3.13-7-7zM19 13h-6v6h6v-6zM11 5H5v6h6V5z" fill="currentColor"/>, label: 'Sliced' },
               { id: 'ninja', icon: <path d="M12 4C9 8 8 9 4 12C8 15 9 16 12 20C15 16 16 15 20 12C16 9 15 8 12 4Z" fill="currentColor"/>, label: 'Ninja' },
               { id: 'teardrop', icon: <path d="M12 4C12 4 6 10.36 6 14.5C6 17.54 8.69 20 12 20C15.31 20 18 17.54 18 14.5C18 10.36 12 4 12 4Z" fill="currentColor"/>, label: 'Teardrop' },
               { id: 'heavy-plus', icon: <path d="M18 10h-4V6c0-1.1-.9-2-2-2s-2 .9-2 2v4H6c-1.1 0-2 .9-2 2s.9 2 2 2h4v4c0 1.1.9 2 2 2s2-.9 2-2v-4h4c1.1 0 2-.9 2-2s-.9-2-2-2z" fill="currentColor"/>, label: 'Heavy+' }
             ].map(cor => (
                 <button
                   key={cor.id}
                   onClick={() => setCustomEyeBall(cor.id)}
                   className={`flex items-center justify-center p-4 md:p-5 rounded-[1.5rem] border-[2px] transition-all duration-300 group outline-none hover:-translate-y-1 hover:shadow-lg ${customEyeBall === cor.id ? 'border-indigo-600 bg-indigo-50 shadow-indigo-500/20 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400 scale-[1.05]' : 'border-slate-100 dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#161616] hover:border-slate-300 dark:hover:border-[#444] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                   <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-sm transition-transform group-hover:scale-110">
                      {cor.icon}
                   </svg>
                </button>
             ))}
          </div>
        </div>
     </div>
  );
}
