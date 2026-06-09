import React, { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, Trash2, FilePlus2, AlertCircle } from "lucide-react";

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
        className="w-full border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
          <UploadCloud className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 mb-8 max-w-sm">
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
    <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 flex items-center">
          <FileIcon className="w-5 h-5 mr-2 text-slate-400" /> {files.length} {files.length === 1 ? 'file' : 'files'} selected
        </h3>
        {multiple && (
          <button 
            onClick={() => inputRef.current?.click()}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center"
          >
            <FilePlus2 className="w-4 h-4 mr-1" /> Add more
          </button>
        )}
      </div>
      <ul className="space-y-3">
        {files.map((file, index) => (
          <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center truncate mr-4">
              <div className="w-8 h-8 rounded-lg shrink-0 bg-blue-50 text-blue-600 flex items-center justify-center mr-3 font-bold text-xs uppercase">
                {file.name.split('.').pop()}
              </div>
              <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
            </div>
            <button 
              onClick={() => onRemoveFile(index)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
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

  const processAndDownload = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await onProcess(files);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      {error && (
         <div className="w-full max-w-2xl bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl mb-6 flex items-start">
           <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
           <p className="text-sm font-medium">{error}</p>
         </div>
      )}

      <div className="w-full max-w-2xl">
        <PdfDropzone 
          files={files} 
          onAddFiles={f => setFiles(multiple ? [...files, ...f] : [...f])} 
          onRemoveFile={i => setFiles(files.filter((_, idx) => idx !== i))}
          accept={accept}
          multiple={multiple}
          title={title}
        />

        {(files.length > 0 || allowEmpty) && (
          <>
            {optionsComponent && <div className="mb-6">{optionsComponent(files)}</div>}
            
            <div className="flex space-x-4">
              <button 
                onClick={processAndDownload}
                disabled={isProcessing || (files.length === 0 && !allowEmpty)}
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-blue-500/20"
              >
                {isProcessing ? "Processing locally..." : buttonText}
              </button>
              <button 
                onClick={() => { setFiles([]); setError(null); }}
                className="px-6 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
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
