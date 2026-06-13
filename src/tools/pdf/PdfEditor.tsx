import { withPdfSafeBoundary } from "../../components/pdf/PdfSafeBoundary";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Download, PenTool, Type, MousePointer, Trash2, ArrowUp, ArrowDown, RotateCw, Loader2, FileSignature, Move } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type ToolType = "select" | "text" | "draw" | "sign";

interface PageState {
  id: string;
  originalIndex: number;
  rotation: number;
}

interface Point {
    x: number;
    y: number;
}

interface TextAnn {
  id: string;
  pageId: string;
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
}

interface DrawAnn {
  id: string;
  pageId: string;
  type: "draw";
  points: Point[];
  color: string;
  thickness: number;
}

interface ImageAnn {
  id: string;
  pageId: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl: string;
}

type Annotation = TextAnn | DrawAnn | ImageAnn;

const colors = ["#000000", "#dc2626", "#2563eb", "#16a34a", "#d97706", "#94a3b8", "#ffffff"];
const fontSizes = [10, 12, 14, 16, 18, 20, 24, 32, 48, 64];

function PdfEditorBase() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pdfDocProxy, setPdfDocProxy] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Document state
  const [pages, setPages] = useState<PageState[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Editor tools
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [activeColor, setActiveColor] = useState<string>("#dc2626");
  const [activeFontSize, setActiveFontSize] = useState<number>(18);
  const [renderScale, setRenderScale] = useState<number>(1.2);
  const [selectedAnnId, setSelectedAnnId] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  
  const activePage = pages[activePageIndex];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setIsLoading(true);
    try {
      const arrayBuffer = await f.arrayBuffer();
      setFileBytes(new Uint8Array(arrayBuffer));
      
      const fileUrl = URL.createObjectURL(f);
      const loadingTask = pdfjsLib.getDocument({ url: fileUrl });
      const pdf = await loadingTask.promise;
      
      setPdfDocProxy(pdf);
      
      const pgs: PageState[] = [];
      for (let i = 0; i < pdf.numPages; i++) {
        pgs.push({
            id: `page_${i}_${Date.now()}`,
            originalIndex: i,
            rotation: 0
        });
      }
      setPages(pgs);
      setActivePageIndex(0);
      setAnnotations([]);
      setFile(f);
    } catch (err) {
      console.error(err);
      console.error("Failed to load PDF.");
    }
    setIsLoading(false);
  };

  const handleExport = async () => {
    if (!fileBytes) return;
    setIsExporting(true);
    try {
      const srcDoc = await PDFDocument.load(fileBytes);
      const newDoc = await PDFDocument.create();
      
      const helvetica = await newDoc.embedFont(StandardFonts.Helvetica);
      
      // Copy pages in the specified sequential order
      const pageIndices = pages.map(p => p.originalIndex);
      const copiedPages = pageIndices.length > 0 ? await newDoc.copyPages(srcDoc, pageIndices) : [];
      
      for (let i = 0; i < copiedPages.length; i++) {
         const pageObj = copiedPages[i];
         const pState = pages[i];
         
         // Visual rotation in 90deg increments
         if (pState.rotation !== 0) {
            pageObj.setRotation(degrees(pageObj.getRotation().angle + pState.rotation));
         }
         
         const anns = annotations.filter(a => a.pageId === pState.id);
         const { width, height } = pageObj.getSize(); // unrotated dims
         
         for (const ann of anns) {
             if (ann.type === 'text') {
                 if (!ann.text.trim()) continue;
                 
                 const colorObj = rgb(
                    parseInt(ann.color.slice(1,3), 16)/255,
                    parseInt(ann.color.slice(3,5), 16)/255,
                    parseInt(ann.color.slice(5,7), 16)/255
                 );
                 
                 // drawText baseline approximation
                 pageObj.drawText(ann.text, {
                     x: ann.x,
                     y: height - ann.y - (ann.fontSize * 0.85),
                     size: ann.fontSize,
                     color: colorObj,
                     font: helvetica,
                     lineHeight: ann.fontSize * 1.2
                 });
             } else if (ann.type === 'draw') {
                 if (ann.points.length < 2) continue;
                 
                 let d = "";
                 ann.points.forEach((pt, j) => {
                     const py = height - pt.y; // invert Y for pdf-lib space
                     if (j === 0) d += `M ${pt.x} ${py} `;
                     else d += `L ${pt.x} ${py} `;
                 });
                 
                 const colorObj = rgb(
                    parseInt(ann.color.slice(1,3), 16)/255,
                    parseInt(ann.color.slice(3,5), 16)/255,
                    parseInt(ann.color.slice(5,7), 16)/255
                 );
                 
                 pageObj.drawSvgPath(d, {
                     borderColor: colorObj,
                     borderWidth: ann.thickness
                 });
             } else if (ann.type === 'image') {
                 let embedImage;
                 if (ann.dataUrl.startsWith('data:image/png')) {
                     embedImage = await newDoc.embedPng(ann.dataUrl);
                 }
                 if (embedImage) {
                     pageObj.drawImage(embedImage, {
                         x: ann.x,
                         y: height - ann.y - ann.height,
                         width: ann.width,
                         height: ann.height
                     });
                 }
             }
         }
         newDoc.addPage(pageObj);
      }
      
      const bytes = await newDoc.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `edited_${file?.name || 'document.pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      console.error("Failed to export PDF.");
    }
    setIsExporting(false);
  };

  // Page Operations
  const deletePage = (id: string) => {
    setPages(prev => {
        const next = prev.filter(p => p.id !== id);
        if (activePageIndex >= next.length && next.length > 0) {
            setActivePageIndex(next.length - 1);
        }
        return next;
    });
  };

  const movePage = (idx: number, dir: -1 | 1) => {
     setPages(prev => {
         const next = [...prev];
         const temp = next[idx];
         next[idx] = next[idx + dir];
         next[idx + dir] = temp;
         return next;
     });
     setActivePageIndex(idx + dir);
  };

  const rotatePage = (id: string) => {
     setPages(prev => prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };
  
  // Annotation Operations
  const handleUpdateAnn = (id: string, changes: Partial<Annotation>) => {
      setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...changes } as any : a));
  };
  
  const handleRemoveAnn = (id: string) => {
      setAnnotations(prev => prev.filter(a => a.id !== id));
      if (selectedAnnId === id) setSelectedAnnId(null);
  };

  // Initial State Screen
  if (!file || !pdfDocProxy) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] bg-slate-900 bg-slate-800 border-2 border-dashed border-slate-700 border-slate-700 rounded-xl p-8">
        <Upload className="w-16 h-16 text-blue-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-50 text-slate-50 mb-2">Advanced PDF Editor</h2>
        <p className="text-slate-400 text-slate-50 mb-8 max-w-md text-center">
           Add text, digitally sign, reorder pages, and fill forms. Everything runs 100% locally in your browser to process your documents securely.
        </p>
        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg">
          {isLoading ? "Loading..." : "Select PDF Document"}
          <input type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} disabled={isLoading} />
        </label>
        <p className="mt-4 text-xs text-slate-400">Strict privacy: Your files never leave your device.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[800px] border border-slate-700 border-slate-700 rounded-xl overflow-hidden bg-slate-800 bg-slate-800/50 shadow-sm">
      
      {/* Top Toolbar */}
      <div className="h-16 border-b border-slate-700 border-slate-700 bg-slate-800 bg-slate-800 flex items-center justify-between px-4 shrink-0">
         <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 bg-slate-800 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTool("select")}
                  className={`p-2 rounded-md transition-colors ${activeTool === 'select' ? 'bg-slate-800 shadow bg-slate-800 text-blue-600' : 'text-slate-50 hover:bg-slate-200 hover:bg-slate-700'}`}
                  title="Select & Move Objects"
                >
                    <MousePointer className="w-5 h-5 text-purple-500" />
                </button>
                <button 
                  onClick={() => { setActiveTool("text"); setSelectedAnnId(null); }}
                  className={`p-2 rounded-md transition-colors ${activeTool === 'text' ? 'bg-slate-800 shadow bg-slate-800 text-blue-600' : 'text-slate-50 hover:bg-slate-200 hover:bg-slate-700'}`}
                  title="Add Text"
                >
                    <Type className="w-5 h-5 text-purple-500" />
                </button>
                <button 
                  onClick={() => { setActiveTool("draw"); setSelectedAnnId(null); }}
                  className={`p-2 rounded-md transition-colors ${activeTool === 'draw' ? 'bg-slate-800 shadow bg-slate-800 text-blue-600' : 'text-slate-50 hover:bg-slate-200 hover:bg-slate-700'}`}
                  title="Freehand Draw"
                >
                    <PenTool className="w-5 h-5 text-purple-500" />
                </button>
                <button 
                  onClick={() => { 
                     setSelectedAnnId(null); 
                     if (!signatureData) {
                        setShowSignatureModal(true);
                     } else {
                        setActiveTool("sign");
                     }
                  }}
                  className={`p-2 rounded-md transition-colors ${activeTool === 'sign' ? 'bg-slate-800 shadow bg-slate-800 text-blue-600' : 'text-slate-50 hover:bg-slate-200 hover:bg-slate-700'}`}
                  title="Sign Document"
                >
                    <FileSignature className="w-5 h-5 text-purple-500" />
                </button>
            </div>

            <div className="w-px h-8 bg-slate-300 bg-slate-800 mx-2" />

            {/* Colors */}
            <div className="flex items-center gap-1.5">
               {colors.map(c => (
                   <button 
                     key={c}
                     onClick={() => { 
                         setActiveColor(c); 
                         if (selectedAnnId) handleUpdateAnn(selectedAnnId, { color: c });
                     }}
                     className={`w-6 h-6 rounded-full border-2 transition-transform ${activeColor === c ? 'scale-125 border-blue-500 shadow-sm' : 'border-slate-700 border-slate-700 hover:scale-110'}`}
                     style={{ backgroundColor: c }}
                   />
               ))}
            </div>

            <div className="w-px h-8 bg-slate-300 bg-slate-800 mx-2" />

            {/* Typography */}
            <div className="flex items-center gap-2">
               <select 
                 className="h-9 px-2 rounded-lg border border-slate-700 border-slate-700 bg-slate-800 bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                 value={activeFontSize}
                 onChange={(e) => {
                    const size = Number(e.target.value);
                    setActiveFontSize(size);
                    if (selectedAnnId) handleUpdateAnn(selectedAnnId, { fontSize: size });
                 }}
               >
                   {fontSizes.map(s => <option key={s} value={s}>{s}px</option>)}
               </select>
            </div>
         </div>

         <div className="flex items-center gap-4">
             <button
               onClick={() => {
                   setAnnotations([]);
               }}
               className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
             >
               Clear All
             </button>
             <button
               onClick={() => setFile(null)}
               className="text-sm font-medium text-slate-400 hover:text-slate-50 hover:text-slate-200"
             >
               Close
             </button>
             <button
               onClick={handleExport}
               disabled={isExporting || pages.length === 0}
               className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow"
             >
               {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-purple-500" /> : <Download className="w-4 h-4 text-purple-500" />}
               Save PDF
             </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Pages Management */}
          <div className="w-56 shrink-0 border-r border-slate-700 border-slate-700 bg-slate-900 bg-slate-800 flex flex-col pt-4 overflow-y-auto">
             <div className="px-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-900 bg-slate-800 z-10">Pages</div>
             <div className="flex flex-col gap-3 px-4 pb-12 pt-2">
                 {pages.map((p, idx) => (
                    <div key={p.id} className="relative group">
                       <div 
                         onClick={() => setActivePageIndex(idx)} 
                         className={`w-full relative aspect-[1/1.4] bg-slate-800 bg-slate-800 border-2 flex items-center justify-center text-slate-300 transition-all cursor-pointer rounded-sm overflow-hidden ${activePageIndex === idx ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' : 'border-slate-700 border-slate-700 hover:border-slate-700'}`}
                       >
                          <ThumbnailRenderer pdfDoc={pdfDocProxy} originalIndex={p.originalIndex} rotation={p.rotation} />
                          <span className="absolute top-1 right-1 bg-slate-900/60 text-white text-[10px] px-1.5 py-0.5 rounded shadow group-hover:opacity-0 transition-opacity">{idx + 1}</span>
                          {p.rotation !== 0 && <RotateCw className="absolute top-1 left-1 w-4 h-4 text-slate-50 text-slate-50 bg-slate-800/80 rounded" />}
                       </div>
                       
                       {/* Floating Actions on Hover */}
                       <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-20 shadow-sm pointer-events-none group-hover:pointer-events-auto">
                          <button onClick={(e) => { e.stopPropagation(); rotatePage(p.id) }} className="p-1 bg-slate-800/90 border border-slate-700 rounded hover:bg-slate-900 text-slate-50 shadow-sm"><RotateCw className="w-3.5 h-3.5" /></button>
                          <button onClick={(e) => { e.stopPropagation(); deletePage(p.id) }} disabled={pages.length <= 1} className="p-1 bg-slate-800/90 border border-slate-700 rounded hover:bg-red-50 text-red-500 disabled:opacity-50 shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                          <button onClick={(e) => { e.stopPropagation(); movePage(idx, -1) }} disabled={idx === 0} className="p-1 bg-slate-800/90 border border-slate-700 rounded hover:bg-slate-900 text-slate-50 disabled:opacity-50 shadow-sm"><ArrowUp className="w-3.5 h-3.5" /></button>
                          <button onClick={(e) => { e.stopPropagation(); movePage(idx, 1) }} disabled={idx === pages.length - 1} className="p-1 bg-slate-800/90 border border-slate-700 rounded hover:bg-slate-900 text-slate-50 disabled:opacity-50 shadow-sm"><ArrowDown className="w-3.5 h-3.5" /></button>
                       </div>
                    </div>
                 ))}
                 {pages.length === 0 && (
                     <div className="text-slate-400 text-sm italic text-center py-4">No pages left.</div>
                 )}
             </div>
          </div>

          {/* Main Viewer */}
          <div 
              className="flex-1 bg-slate-200/50 bg-slate-900 overflow-auto relative p-8 flex justify-center custom-scrollbar" 
              onPointerDown={(e) => {
                 if (e.target === e.currentTarget) {
                    setSelectedAnnId(null);
                 }
              }}
          >
             {activePage ? (
                 <div className="relative inline-block shadow-2xl h-max" style={{ transformOrigin: 'top center' }}>
                     <PdfPageRenderer 
                        pdfDoc={pdfDocProxy} 
                        originalIndex={activePage.originalIndex}
                        rotation={activePage.rotation}
                        renderScale={renderScale}
                     />
                     <AnnotationsOverlay 
                        pageId={activePage.id}
                        annotations={annotations}
                        scale={renderScale}
                        activeTool={activeTool}
                        activeColor={activeColor}
                        activeFontSize={activeFontSize}
                        onAddAnnotation={(ann: any) => setAnnotations(prev => [...prev, ann])}
                        onUpdateAnnotation={handleUpdateAnn}
                        onRemoveAnnotation={handleRemoveAnn}
                        selectedAnnId={selectedAnnId}
                        setSelectedAnnId={setSelectedAnnId}
                        signatureData={signatureData}
                     />
                 </div>
             ) : (
                 <div className="flex items-center justify-center text-slate-400">No active page</div>
             )}
          </div>
      </div>
      
      {showSignatureModal && (
          <SignatureModal 
              onClose={() => setShowSignatureModal(false)}
              onSave={(data) => {
                  setSignatureData(data);
                  setActiveTool("sign");
                  setShowSignatureModal(false);
              }}
          />
      )}
    </div>
  );
}

const SignatureModal = ({ onClose, onSave }: { onClose: () => void, onSave: (dataUrl: string) => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);

    const getCoords = (e: React.PointerEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        return {
           x: (e.clientX - rect.left) * (canvas.width / rect.width),
           y: (e.clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const onPointerDown = (e: React.PointerEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { x, y } = getCoords(e, canvas);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        isDrawing.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDrawing.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { x, y } = getCoords(e, canvas);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const onPointerUp = (e: React.PointerEvent) => {
        isDrawing.current = false;
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold">Create Signature</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-50">Close</button>
                </div>
                <div className="p-4 bg-slate-900 bg-slate-800/50">
                    <canvas 
                        ref={canvasRef}
                        width={400}
                        height={200}
                        className="bg-slate-800 border border-slate-700 rounded-lg w-full cursor-crosshair touch-none"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                    />
                </div>
                <div className="p-4 flex justify-between border-t border-slate-700">
                    <button onClick={() => {
                        const canvas = canvasRef.current;
                        if (!canvas) return;
                        const ctx = canvas.getContext('2d');
                        if (ctx) ctx.clearRect(0,0,400,200);
                    }} className="text-slate-50 hover:text-slate-50">Clear</button>
                    <button onClick={() => {
                        const canvas = canvasRef.current;
                        if (!canvas) return;
                        onSave(canvas.toDataURL('image/png'));
                    }} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">Save & Use</button>
                </div>
            </div>
        </div>
    );
};

const PdfPageRenderer = ({ pdfDoc, originalIndex, rotation, renderScale }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    let renderTask: any;
    let active = true;

    async function renderPage() {
      if (!pdfDoc) return;
      try {
        const page = await pdfDoc.getPage(originalIndex + 1);
        if (!active) return;
        
        const baseRotation = page.rotate || 0;
        const visualViewport = page.getViewport({ scale: renderScale, rotation: baseRotation + rotation });
        const dpr = window.devicePixelRatio || 1;
        const renderViewport = page.getViewport({ scale: renderScale * dpr, rotation: baseRotation + rotation });
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        canvas.width = renderViewport.width;
        canvas.height = renderViewport.height;
        canvas.style.width = `${visualViewport.width}px`;
        canvas.style.height = `${visualViewport.height}px`;

        renderTask = page.render({ canvasContext: ctx, viewport: renderViewport });
        await renderTask.promise;
      } catch (e: any) {
         if (e?.name !== "RenderingCancelledException") {
             console.error("PDF Render error:", e);
         }
      }
    }
    renderPage();
    return () => {
       active = false;
       if (renderTask) renderTask.cancel();
    }
  }, [pdfDoc, originalIndex, rotation, renderScale]);

  return <canvas ref={canvasRef} className="block shadow-xl bg-slate-800 select-none" />;
};

const ThumbnailRenderer = ({ pdfDoc, originalIndex, rotation }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    let renderTask: any;
    let active = true;

    async function renderPage() {
      if (!pdfDoc) return;
      try {
        const page = await pdfDoc.getPage(originalIndex + 1);
        if (!active) return;
        
        const baseRotation = page.rotate || 0;
        const viewport = page.getViewport({ scale: 0.2, rotation: baseRotation + rotation });
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.objectFit = "contain";

        renderTask = page.render({ canvasContext: ctx, viewport });
        await renderTask.promise;
      } catch (e: any) {
         if (e?.name !== "RenderingCancelledException") {
             console.error("PDF Render error:", e);
         }
      }
    }
    renderPage();
    return () => {
       active = false;
       if (renderTask) renderTask.cancel();
    }
  }, [pdfDoc, originalIndex, rotation]);

  return <canvas ref={canvasRef} className="block pointer-events-none" />;
};

const DraggableText = ({ ann, scale, isSelected, onSelect, onUpdate, onRemove }: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;
    onUpdate({ x: ann.x + dx, y: ann.y + dy });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className={`absolute select-none ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50/20 z-30' : 'hover:ring-1 hover:ring-slate-400/50 z-20'}`}
      style={{ left: ann.x * scale, top: ann.y * scale }}
      onPointerDown={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {isSelected && (
        <div 
           className="absolute -top-3 -left-3 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full shadow flex items-center justify-center cursor-move text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-slate-900 z-40 transition-colors"
           onPointerDown={handlePointerDown}
           onPointerMove={handlePointerMove}
           onPointerUp={handlePointerUp}
           onPointerCancel={handlePointerUp}
        >
           <Move className="w-3 h-3 text-purple-500" />
        </div>
      )}
      
      {isSelected && (
           <div className="absolute -top-12 left-0 flex bg-slate-800 shadow-xl rounded-lg p-1 gap-1 z-40 border border-slate-700">
               <button className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Delete Text">
                 <Trash2 className="w-4 h-4 text-purple-500"/>
               </button>
           </div>
      )}

      {isSelected ? (
           <textarea 
             autoFocus
             className="bg-transparent outline-none border-none resize-none m-0 p-0 block overflow-hidden leading-[1.2]"
             style={{ 
                 color: ann.color, 
                 fontSize: `${ann.fontSize * scale}px`, 
                 fontFamily: ann.fontFamily, 
                 minWidth: '50px',
                 width: `${ann.text.length > 0 ? ann.text.length * (ann.fontSize * scale * 0.6) + 40 : 100}px` 
             }}
             value={ann.text}
             onChange={e => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
                onUpdate({ text: e.target.value });
             }}
             onFocus={e => {
                const len = e.target.value.length;
                e.target.setSelectionRange(len, len);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
             }}
             onPointerDown={e => {
                e.stopPropagation(); 
             }}
           />
      ) : (
        <div 
          className="p-0 whitespace-pre cursor-pointer leading-[1.2]"
          style={{ color: ann.color, fontSize: `${ann.fontSize * scale}px`, fontFamily: ann.fontFamily }}
        >
          {ann.text || "Type text here"}
        </div>
      )}
    </div>
  );
};

const DraggableImage = ({ ann, scale, isSelected, onSelect, onUpdate, onRemove }: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;
    onUpdate({ x: ann.x + dx, y: ann.y + dy });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className={`absolute select-none ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50/20 z-30' : 'hover:ring-1 hover:ring-slate-400/50 z-20'}`}
      style={{ left: ann.x * scale, top: ann.y * scale, width: ann.width * scale, height: ann.height * scale }}
      onPointerDown={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {isSelected && (
        <div 
           className="absolute -top-3 -left-3 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full shadow flex items-center justify-center cursor-move text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-slate-900 z-40 transition-colors"
           onPointerDown={handlePointerDown}
           onPointerMove={handlePointerMove}
           onPointerUp={handlePointerUp}
           onPointerCancel={handlePointerUp}
        >
           <Move className="w-3 h-3 text-purple-500" />
        </div>
      )}
      
      {isSelected && (
           <div className="absolute -top-12 left-0 flex bg-slate-800 shadow-xl rounded-lg p-1 gap-1 z-40 border border-slate-700">
               <button className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Delete Image">
                 <Trash2 className="w-4 h-4 text-purple-500"/>
               </button>
           </div>
      )}

      <img src={ann.dataUrl} alt="Annotation preview" className="w-full h-full object-contain pointer-events-none" />
    </div>
  );
};

const AnnotationsOverlay = ({ 
  annotations, 
  pageId, 
  scale, 
  activeTool, 
  activeColor, 
  activeFontSize,
  onAddAnnotation, 
  onUpdateAnnotation, 
  onRemoveAnnotation,
  selectedAnnId,
  setSelectedAnnId,
  signatureData
}: any) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  const handlePointerDown = (e: React.PointerEvent) => {    
    if (e.target !== overlayRef.current) return;
    
    e.stopPropagation();

    if (activeTool === "select") {
       setSelectedAnnId(null);
       return;
    }
    
    const rect = overlayRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (activeTool === "text") {
       const newAnn: TextAnn = { 
           id: Date.now().toString() + Math.random(), 
           type: 'text', 
           pageId, 
           x, 
           y, 
           text: '', 
           fontSize: activeFontSize, 
           color: activeColor, 
           fontFamily: 'Helvetica, sans-serif' // mapping closely to StandardFonts.Helvetica
       };
       onAddAnnotation(newAnn);
       setSelectedAnnId(newAnn.id);
    } else if (activeTool === "draw") {
       setIsDrawing(true);
       setCurrentPath([{x, y}]);
       (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else if (activeTool === "sign" && signatureData) {
       const newAnn: ImageAnn = {
           id: Date.now().toString() + Math.random(),
           type: 'image',
           pageId,
           x,
           y,
           width: 150,
           height: 75,
           dataUrl: signatureData
       };
       onAddAnnotation(newAnn);
       setSelectedAnnId(newAnn.id);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const rect = overlayRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    setCurrentPath(prev => [...prev, {x, y}]);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDrawing && currentPath.length > 1) {
       const newAnn: DrawAnn = { 
           id: Date.now().toString() + Math.random(), 
           type: 'draw', 
           pageId, 
           points: currentPath, 
           thickness: 2, 
           color: activeColor 
       };
       onAddAnnotation(newAnn);
    }
    setIsDrawing(false);
    setCurrentPath([]);
    if (overlayRef.current && overlayRef.current.hasPointerCapture(e.pointerId)) {
        overlayRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const drawAnns = annotations.filter((a: any) => a.type === 'draw' && a.pageId === pageId) as DrawAnn[];
  const textAnns = annotations.filter((a: any) => a.type === 'text' && a.pageId === pageId) as TextAnn[];
  const imageAnns = annotations.filter((a: any) => a.type === 'image' && a.pageId === pageId) as ImageAnn[];

  return (
    <div 
      ref={overlayRef}
      className={`absolute inset-0 z-10 ${activeTool === 'text' ? 'cursor-text' : activeTool === 'draw' ? 'cursor-crosshair' : activeTool === 'sign' ? 'cursor-copy' : 'cursor-default'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: "none" }}
    >
      <svg className="absolute inset-0 z-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
         {drawAnns.map(ann => (
             <polyline key={ann.id} points={ann.points.map(p => `${p.x * scale},${p.y * scale}`).join(' ')} stroke={ann.color} strokeWidth={ann.thickness * scale} fill="none" strokeLinecap="round" strokeLinejoin="round" />
         ))}
         {isDrawing && currentPath.length > 0 && (
             <polyline points={currentPath.map(p => `${p.x * scale},${p.y * scale}`).join(' ')} stroke={activeColor} strokeWidth={2 * scale} fill="none" strokeLinecap="round" strokeLinejoin="round" />
         )}
      </svg>
      
      {textAnns.map(ann => (
          <DraggableText 
             key={ann.id}
             ann={ann}
             scale={scale}
             isSelected={selectedAnnId === ann.id}
             onSelect={() => setSelectedAnnId(ann.id)}
             onUpdate={(changes: any) => onUpdateAnnotation(ann.id, changes)}
             onRemove={() => onRemoveAnnotation(ann.id)}
          />
      ))}
      {imageAnns.map(ann => (
          <DraggableImage 
             key={ann.id}
             ann={ann}
             scale={scale}
             isSelected={selectedAnnId === ann.id}
             onSelect={() => setSelectedAnnId(ann.id)}
             onUpdate={(changes: any) => onUpdateAnnotation(ann.id, changes)}
             onRemove={() => onRemoveAnnotation(ann.id)}
          />
      ))}
    </div>
  )
}

export const PdfEditor = withPdfSafeBoundary(PdfEditorBase);
