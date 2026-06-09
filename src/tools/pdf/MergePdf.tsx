import React, { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadCloud, File as FileIcon, Trash2, Download, AlertCircle, FilePlus2 } from "lucide-react";

export function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((f: File) => f.type === "application/pdf");
      if (newFiles.length !== e.target.files.length) {
         setError("Some files were discarded. Only PDF files are supported.");
      } else {
         setError(null);
      }
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processMerge = async () => {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "ToolHub_Merged.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError("Error merging PDFs: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      {error && (
        <div className="w-full max-w-2xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {files.length === 0 ? (
        <div 
          className="w-full max-w-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:bg-stone-50 hover:border-blue-400 dark:hover:bg-stone-900 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-blue-600">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Upload PDF files</h3>
          <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-sm">
            Drag and drop your PDFs here or click to browse. Files stay private, processing happens locally in your browser.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">
            Select PDF files
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="bg-stone-50 dark:bg-stone-900/50 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-900 dark:text-white flex items-center">
                <FileIcon className="w-5 h-5 mr-2 text-stone-400" /> {files.length} {files.length === 1 ? 'file' : 'files'} selected
              </h3>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
              >
                <FilePlus2 className="w-4 h-4 mr-1" /> Add more
              </button>
            </div>
            
            <ul className="space-y-3">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-white dark:bg-stone-950 p-3 rounded-lg border border-stone-200 dark:border-stone-800 shadow-sm">
                  <div className="flex items-center truncate mr-4">
                    <div className="w-8 h-8 rounded shrink-0 bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center mr-3 font-bold text-xs">PDF</div>
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={processMerge}
              disabled={isProcessing || files.length < 2}
              className="flex-1 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-xl hover:bg-stone-800 dark:hover:bg-stone-100 focus:ring-4 focus:ring-stone-200 dark:focus:ring-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <><Download className="w-5 h-5 mr-2" /> Merge & Download PDF</>
              )}
            </button>
            <button 
              onClick={() => {setFiles([]); setError(null);}}
              className="px-6 py-4 border border-stone-300 dark:border-stone-700 font-medium rounded-xl hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors text-stone-700 dark:text-stone-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hidden inputs */}
      <input 
        type="file" 
        multiple 
        accept=".pdf" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
}
