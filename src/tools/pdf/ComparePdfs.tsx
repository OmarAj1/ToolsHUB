import React, { useState } from 'react';
import { Upload, Columns } from 'lucide-react';

export function ComparePdfs() {
  const [file1, setFile1] = useState<string | null>(null);
  const [file2, setFile2] = useState<string | null>(null);

  const handleUpload1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile1(URL.createObjectURL(f));
  };

  const handleUpload2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile2(URL.createObjectURL(f));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200 h-[calc(100vh-80px)] flex flex-col">
       <div className="text-center mb-6 shrink-0">
          <h2 className="font-bold flex items-center justify-center gap-2 text-xl">
             <Columns className="w-6 h-6 text-indigo-500" /> Basic Side-by-Side PDF Viewer
          </h2>
          <p className="text-sm text-slate-500">Fast local side-by-side rendering using your browser's native PDF engine.</p>
       </div>

       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* File 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col h-full">
             <div className="flex justify-between items-center mb-4 shrink-0">
               <h3 className="font-bold text-sm">Version A</h3>
               <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1">
                 <Upload className="w-3.5 h-3.5" /> Upload File
                 <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload1} />
               </label>
             </div>
             
             <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden relative">
                {file1 ? (
                  <iframe src={`${file1}#toolbar=0`} className="w-full h-[100%] absolute inset-0 border-none" title="PDF 1" />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                     <span className="font-bold italic">No PDF loaded</span>
                  </div>
                )}
             </div>
          </div>

          {/* File 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col h-full">
             <div className="flex justify-between items-center mb-4 shrink-0">
               <h3 className="font-bold text-sm">Version B</h3>
               <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1">
                 <Upload className="w-3.5 h-3.5" /> Upload File
                 <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload2} />
               </label>
             </div>
             
             <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden relative">
                {file2 ? (
                  <iframe src={`${file2}#toolbar=0`} className="w-full h-[100%] absolute inset-0 border-none" title="PDF 2" />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                     <span className="font-bold italic">No PDF loaded</span>
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}
