import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { Upload, Download, EyeOff } from 'lucide-react';

export function PdfRedactor() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [yPosition, setYPosition] = useState(500);
  const [boxHeight, setBoxHeight] = useState(50);
  const [pageCount, setPageCount] = useState(1);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setDownloadUrl(null);
    
    // Quickly read page count
    try {
       const arrayBuffer = await uploadedFile.arrayBuffer();
       const doc = await PDFDocument.load(arrayBuffer);
       setPageCount(doc.getPageCount());
    } catch {
       setPageCount(1);
    }
  };

  const redactPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Blind redaction: draws a black box on ALL pages at specified Y position
      // Real redactors have visual drag/drop, but offline automated tools are helpful too
      for (const page of pages) {
        const { width, height } = page.getSize();
        
        // Ensure coordinates make sense
        const actualWidth = width * 0.8;
        const actualX = width * 0.1;
        const actualY = height - yPosition - boxHeight; // flip Y for standard cartesian

        page.drawRectangle({
          x: actualX,
          y: Math.max(0, actualY),
          width: actualWidth,
          height: boxHeight,
          color: rgb(0, 0, 0),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      alert('Error redacting PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
       <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl text-sm mb-8 flex gap-3 text-red-800 dark:text-red-300">
         <EyeOff className="w-5 h-5 shrink-0" />
         <div>
           <strong>Blind Redactor (Offline):</strong> Places a solid black box on all pages at the specified height. This destroys the underlying vector text locally in your browser.
         </div>
       </div>

       {!file ? (
         <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
           <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
           <Upload className="w-12 h-12 text-indigo-500 mb-4" />
           <span className="font-bold text-lg">Select PDF to Redact</span>
           <span className="text-sm text-slate-500 mt-1">100% Offline Processing</span>
         </label>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center">
             <div className="w-full aspect-[1/1.4] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative shadow-inner overflow-hidden flex flex-col">
                <span className="mt-4 font-bold opacity-50">{file.name}</span>
                <span className="text-xs opacity-50">{pageCount} pages</span>
                
                {/* Visualizer for the redaction box */}
                <div 
                  className="absolute bg-black/80 border-2 border-red-500 shadow-xl"
                  style={{
                    left: '10%',
                    right: '10%',
                    top: `${(yPosition / 800) * 100}%`,
                    height: `${(boxHeight / 800) * 100}%`
                  }}
                >
                   <span className="absolute inset-0 flex items-center justify-center text-red-500 text-[10px] font-black uppercase tracking-widest leading-none">Redacted</span>
                </div>
             </div>
             <button onClick={() => { setFile(null); setDownloadUrl(null); }} className="mt-4 text-sm text-slate-500 font-bold hover:underline">
               Deselect File
             </button>
           </div>

           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-center">
              <h3 className="font-bold text-lg mb-6">Redaction Zone</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Distance from Top: {yPosition}px</label>
                  <input type="range" min="0" max="800" value={yPosition} onChange={e => setYPosition(Number(e.target.value))} className="w-full accent-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Box Height: {boxHeight}px</label>
                  <input type="range" min="10" max="400" value={boxHeight} onChange={e => setBoxHeight(Number(e.target.value))} className="w-full accent-red-500" />
                </div>
              </div>

              <div className="mt-8">
                 {downloadUrl ? (
                   <a href={downloadUrl} download={`redacted_${file.name}`} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
                     <Download className="w-5 h-5" /> Download Redacted PDF
                   </a>
                 ) : (
                   <button 
                     onClick={redactPdf} 
                     disabled={isProcessing}
                     className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                   >
                     {isProcessing ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : <EyeOff className="w-5 h-5" />}
                     Apply Redaction
                   </button>
                 )}
              </div>
           </div>
         </div>
       )}
    </div>
  );
}
