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
  onError,
  accept = ".pdf", 
  multiple = false,
  title = "Upload files",
  maxSizeMB = 10
}: { 
  files: File[], 
  onAddFiles: (f: File[]) => void, 
  onRemoveFile: (i: number) => void,
  onError?: (msg: string) => void,
  accept?: string, 
  multiple?: boolean,
  title?: string,
  maxSizeMB?: number
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      const MAX_SIZE_BYTES = maxSizeMB * 1024 * 1024;
      
      let hasError = false;
      for (const file of selectedFiles) {
        if (file.size > MAX_SIZE_BYTES) {
          hasError = true;
          if (onError) onError(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        } else {
          validFiles.push(file);
        }
      }
      
      if (validFiles.length > 0) {
        onAddFiles(validFiles);
      }
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  if (files.length === 0) {
    return (
      <div 
        className="w-full border-2 border-dashed border-slate-700 border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-900 hover:bg-slate-700/50 hover:border-blue-400 hover:border-blue-500 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-20 h-20 bg-blue-50 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 text-blue-600 text-blue-400">
          <UploadCloud className="w-10 h-10 text-purple-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-50 text-slate-50 mb-2">{title}</h3>
        <p className="text-slate-400 text-slate-50 mb-8 max-w-sm">
          Files stay secure. All processing happens locally in your browser.
        </p>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors">
          Select files
        </button>
        <input type="file" multiple={multiple} accept={accept} ref={inputRef} onChange={handleFileChange} className="hidden" />
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 bg-slate-800/50 rounded-2xl p-6 border border-slate-700 border-slate-700 mb-6 flex items-center justify-between">
      <h3 className="font-bold text-slate-50 text-slate-50 flex items-center">
        <FileIcon className="w-5 h-5 mr-2 text-slate-400 text-slate-50" /> {files.length} {files.length === 1 ? 'file' : 'files'} uploaded
      </h3>
      {multiple && (
        <button 
          onClick={() => inputRef.current?.click()}
          className="text-sm px-4 py-2 bg-slate-800 bg-slate-900 rounded-lg font-bold text-blue-600 text-blue-400 border border-blue-200 border-blue-900 hover:bg-blue-50 hover:bg-slate-700 flex items-center shadow-sm"
        >
          <FilePlus2 className="w-4 h-4 mr-1 text-purple-500" /> Add more files
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
  const [mergeProgress, setMergeProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<Error | null>(null);
  
  if (renderError) throw renderError;

  const isPdfMode = accept === ".pdf";
  const { pages, setPages, isLoading: isPagesLoading, progress } = usePdfPages(isPdfMode ? files : []);

  const processAndDownload = async () => {
    setIsProcessing(true);
    setMergeProgress(0);
    setError(null);
    try {
      let finalFiles = files;

      if (isPdfMode && files.length > 0 && pages.length > 0) {
        // Rebuild the final PDF sequence based on the drag and drop arrangement
        const mergedPdf = await PDFDocument.create();
        const loadedDocs = new Map<number, PDFDocument>();

        const includedPages = pages.filter(p => !p.isExcluded);
        let processedCount = 0;

        for (const page of includedPages) {
          if (!loadedDocs.has(page.fileIndex)) {
            const buffer = await files[page.fileIndex].arrayBuffer();
            const doc = await PDFDocument.load(buffer);
            loadedDocs.set(page.fileIndex, doc);
          }
          
          const sourceDoc = loadedDocs.get(page.fileIndex)!;
          const [copiedPage] = await mergedPdf.copyPages(sourceDoc, [page.pageIndex]);
          mergedPdf.addPage(copiedPage);

          processedCount++;
          setMergeProgress(Math.round((processedCount / includedPages.length) * 100));
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
      console.error(e);
      setRenderError(e);
    } finally {
      setIsProcessing(false);
      setMergeProgress(0);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      {error && (
         <div className="w-full max-w-4xl bg-red-50 bg-red-900/20 text-red-600 text-red-400 border border-red-100 border-red-900/50 p-4 rounded-xl mb-6 flex items-start">
           <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-purple-500" />
           <p className="text-sm font-medium">{error}</p>
         </div>
      )}

      <div className="w-full max-w-4xl">
        <PdfDropzone 
          files={files} 
          onAddFiles={f => { setFiles(multiple ? [...files, ...f] : [...f]); setError(null); }} 
          onRemoveFile={i => setFiles(files.filter((_, idx) => idx !== i))}
          onError={msg => setError(msg)}
          accept={accept}
          multiple={multiple}
          title={title}
          maxSizeMB={10}
        />

        {isPdfMode && files.length > 0 && (
          <PdfPageGrid pages={pages} setPages={setPages} isLoading={isPagesLoading} progress={progress} />
        )}

        {(files.length > 0 || allowEmpty) && (
          <>
            {optionsComponent && <div className="mb-6">{optionsComponent(files)}</div>}
            
            <div className="flex flex-col space-y-4">
              {isProcessing && mergeProgress > 0 && (
                <div className="w-full">
                  <div className="flex justify-between text-sm text-stone-600 text-stone-400 mb-1 font-medium">
                    <span>Merging Pages...</span>
                    <span>{mergeProgress}%</span>
                  </div>
                  <div className="w-full bg-stone-200 bg-stone-700 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${mergeProgress}%` }}></div>
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                <button 
                  onClick={processAndDownload}
                  disabled={isProcessing || isPagesLoading || (files.length === 0 && !allowEmpty)}
                  className="flex-1 py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-blue-500/20"
                >
                  {isProcessing ? "Processing locally..." : buttonText}
                </button>
                <button 
                  onClick={() => { setFiles([]); setError(null); }}
                  className="px-6 border border-slate-700 border-slate-700 font-bold rounded-xl hover:bg-slate-900 hover:bg-slate-700 transition-colors text-slate-50 text-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
