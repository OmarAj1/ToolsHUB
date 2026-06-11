import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, File as FileIcon, Trash2, FilePlus2, AlertCircle } from "lucide-react";
import { usePdfPages, PdfPageInfo } from "../../hooks/usePdfPages";
import { PdfPageGrid } from "./PdfPageGrid";
import { PDFDocument } from "pdf-lib";

export function downloadFile(buffer: Uint8Array | ArrayBuffer | Blob, filename: string, mime: string) {
  const blob = buffer instanceof Blob ? buffer : new Blob([buffer], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function PdfDropzone({ 
  files, 
  onAddFiles, 
  onRemoveFile, 
  accept = ".pdf", 
  multiple = false,
  title = "Upload files"
}: { 
  files: File[], 
  onAddFiles: (f: File[]) => void, 
  onRemoveFile: (i: number) => void, 
  accept?: string, 
  multiple?: boolean,
  title?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onAddFiles(Array.from(e.target.files));
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  if (files.length === 0) {
    return (
      <div 
        className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
          <UploadCloud className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
          Files stay secure. All processing happens locally in your browser.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Select files
        </button>
        <input type="file" multiple={multiple} accept={accept} ref={inputRef} onChange={handleFileChange} className="hidden" />
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-6 flex items-center justify-between">
      <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center">
        <FileIcon className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-500" /> {files.length} {files.length === 1 ? 'file' : 'files'} uploaded
      </h3>
      {multiple && (
        <button 
          onClick={() => inputRef.current?.click()}
          className="text-sm px-4 py-2 bg-white dark:bg-slate-950 rounded-lg font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-slate-900 flex items-center shadow-sm"
        >
          <FilePlus2 className="w-4 h-4 mr-1" /> Add more files
        </button>
      )}
      <input type="file" multiple={multiple} accept={accept} ref={inputRef} onChange={handleFileChange} className="hidden" />
    </div>
  );
}

export function PdfActionContainer({ 
  title = "Upload PDF file", 
  accept = ".pdf", 
  multiple = false, 
  onProcess, 
  optionsComponent,
  buttonText = "Process PDF",
  allowEmpty = false
}: {
  title?: string,
  accept?: string,
  multiple?: boolean,
  onProcess: (files: File[]) => Promise<void>,
  optionsComponent?: (files: File[]) => React.ReactNode,
  buttonText?: string,
  allowEmpty?: boolean
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isPdfMode = accept === ".pdf";
  const { pages, setPages, isLoading: isPagesLoading, progress } = usePdfPages(isPdfMode ? files : []);

  const processAndDownload = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      let finalFiles = files;

      if (isPdfMode && files.length > 0 && pages.length > 0) {
        // Rebuild the final PDF sequence based on the drag and drop arrangement
        const mergedPdf = await PDFDocument.create();
        const loadedDocs = new Map<number, PDFDocument>();

        for (const page of pages) {
          if (page.isExcluded) continue;

          if (!loadedDocs.has(page.fileIndex)) {
            const buffer = await files[page.fileIndex].arrayBuffer();
            const doc = await PDFDocument.load(buffer);
            loadedDocs.set(page.fileIndex, doc);
          }
          
          const sourceDoc = loadedDocs.get(page.fileIndex)!;
          const [copiedPage] = await mergedPdf.copyPages(sourceDoc, [page.pageIndex]);
          mergedPdf.addPage(copiedPage);
        }

        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const rebuiltFile = new File([blob], "custom_arranged.pdf", { type: "application/pdf" });
        finalFiles = [rebuiltFile];
      } else if (isPdfMode && files.length > 0 && pages.length === 0 && !isPagesLoading) {
        throw new Error("All pages were removed. Nothing to process.");
      }

      await onProcess(finalFiles);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      {error && (
         <div className="w-full max-w-4xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 p-4 rounded-xl mb-6 flex items-start">
           <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
           <p className="text-sm font-medium">{error}</p>
         </div>
      )}

      <div className="w-full max-w-4xl">
        <PdfDropzone 
          files={files} 
          onAddFiles={f => setFiles(multiple ? [...files, ...f] : [...f])} 
          onRemoveFile={i => setFiles(files.filter((_, idx) => idx !== i))}
          accept={accept}
          multiple={multiple}
          title={title}
        />

        {isPdfMode && files.length > 0 && (
          <PdfPageGrid pages={pages} setPages={setPages} isLoading={isPagesLoading} progress={progress} />
        )}

        {(files.length > 0 || allowEmpty) && (
          <>
            {optionsComponent && <div className="mb-6">{optionsComponent(files)}</div>}
            
            <div className="flex space-x-4">
              <button 
                onClick={processAndDownload}
                disabled={isProcessing || isPagesLoading || (files.length === 0 && !allowEmpty)}
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-blue-500/20"
              >
                {isProcessing ? "Processing locally..." : buttonText}
              </button>
              <button 
                onClick={() => { setFiles([]); setError(null); }}
                className="px-6 border border-slate-200 dark:border-slate-800 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
