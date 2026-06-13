import { withPdfSafeBoundary } from "../../components/pdf/PdfSafeBoundary";
import React, { useState } from 'react';
import { PdfDropzone, downloadFile } from '../../components/pdf/PdfToolsBuilder';
import { usePdfPages } from '../../hooks/usePdfPages';
import { PDFDocument } from 'pdf-lib';
import ReactCrop, { type PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { AlertCircle, MousePointer2, Copy } from 'lucide-react';

function CropPdfBase() {
  const [files, setFiles] = useState<File[]>([]);
  const { pages, isLoading, progress } = usePdfPages(files);
  const [crops, setCrops] = useState<Record<string, PercentCrop>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<Error | null>(null);

  if (renderError) throw renderError;
  
  const handleCropChange = (id: string, percentCrop: PercentCrop) => {
    setCrops(prev => ({
      ...prev,
      [id]: percentCrop
    }));
  };

  const applyCropToAll = (sourceId: string) => {
    const sourceCrop = crops[sourceId];
    if (!sourceCrop) return;
    
    const newCrops = { ...crops };
    pages.forEach(p => {
      newCrops[p.id] = sourceCrop;
    });
    setCrops(newCrops);
  };

  const removeCrop = (id: string) => {
    const newCrops = { ...crops };
    delete newCrops[id];
    setCrops(newCrops);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const file = files[0];
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      
      pages.forEach(pageInfo => {
        const crop = crops[pageInfo.id];
        if (crop && crop.width > 0 && crop.height > 0) {
          const pdfPage = pdfDoc.getPage(pageInfo.pageIndex);
          const { x, y, width, height } = pdfPage.getCropBox();
          
          const cropX = x + (width * (crop.x / 100));
          const cropWidth = width * (crop.width / 100);
          const cropHeight = height * (crop.height / 100);
          const cropY = (y + height) - (height * (crop.y / 100)) - cropHeight;
          
          pdfPage.setCropBox(cropX, cropY, cropWidth, cropHeight);
        }
      });

      const pdfBytes = await pdfDoc.save();
      downloadFile(pdfBytes, `cropped_${file.name}`, "application/pdf");
    } catch(err: any) {
      console.error(err);
      setRenderError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      {error && (
        <div className="w-full max-w-5xl bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-purple-500" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <PdfDropzone 
          files={files} 
          onAddFiles={f => setFiles([f[0]])} 
          onRemoveFile={() => { setFiles([]); setCrops({}); }}
          accept=".pdf"
          multiple={false}
          title="Upload PDF to Crop"
        />

        {isLoading && (
          <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 border-stone-700 rounded-2xl bg-stone-50 bg-stone-900/50 mt-6">
            <div className="w-64 max-w-full mb-6">
              <div className="flex justify-between text-sm text-stone-600 text-stone-400 mb-2 font-medium">
                <span>Extracting Pages...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-stone-200 bg-stone-700 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <p className="text-stone-500 text-stone-500 text-sm">Parsing PDF document layers securely in browser</p>
          </div>
        )}

        {files.length > 0 && !isLoading && pages.length > 0 && (
          <div className="w-full bg-stone-50 bg-stone-900/50 rounded-2xl p-6 border border-stone-200 border-stone-800 mb-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <h3 className="font-bold text-stone-900 text-white flex items-center">
                    <MousePointer2 className="w-5 h-5 mr-2 text-stone-400" />
                    Crop Pages ({pages.length})
                  </h3>
                  <span className="ml-3 px-2 py-0.5 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded text-xs font-bold uppercase tracking-wider">
                    This is experimental
                  </span>
                </div>
                <p className="text-sm text-stone-500 text-stone-400 mt-1">
                  Draw a rectangle on any page to crop it. You can apply the same crop to all pages. May take 30-60 seconds.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[700px] overflow-y-auto px-2 py-4">
              {pages.map(page => (
                <div key={page.id} className="relative group bg-slate-800 bg-stone-800 rounded-xl p-3 border-2 border-transparent shadow-sm hover:border-blue-300 hover:border-blue-700 transition-colors flex flex-col items-center">
                  <div className="absolute top-1 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10 pointer-events-none">
                    Page {page.pageIndex + 1}
                  </div>
                  
                  {crops[page.id] && crops[page.id]?.width > 0 && (
                    <div className="absolute top-2 right-2 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => applyCropToAll(page.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg shadow-lg flex items-center gap-1 text-[10px] font-bold"
                        title="Apply this crop to all pages"
                      >
                        <Copy className="w-3 h-3 text-purple-500" /> All
                      </button>
                      <button 
                        onClick={() => removeCrop(page.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-lg flex items-center gap-1 text-[10px] font-bold"
                        title="Remove crop from this page"
                      >
                         Clear
                      </button>
                    </div>
                  )}

                  <div className="w-full relative shadow border border-stone-200 border-stone-700 select-none">
                    <ReactCrop 
                      crop={crops[page.id]} 
                      onChange={(_, percentCrop) => handleCropChange(page.id, percentCrop)}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <img 
                        src={page.thumbnailUrl} 
                        alt={`Page ${page.pageIndex + 1}`} 
                        className="w-full h-auto block pointer-events-none" 
                        onDragStart={(e) => e.preventDefault()}
                      />
                    </ReactCrop>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4 pt-4 border-t border-stone-200 border-stone-800">
              <button 
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex-1 py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-blue-500/20"
              >
                {isProcessing ? "Cropping PDF..." : "Crop & Download PDF"}
              </button>
              <button 
                onClick={() => { setFiles([]); setCrops({}); }}
                className="px-6 border border-slate-700 font-bold rounded-xl hover:bg-slate-900 transition-colors text-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const CropPdf = withPdfSafeBoundary(CropPdfBase);
