import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Safe worker URL loading for Vite
const workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export interface PdfPageInfo {
  id: string; // Document ID + Page Index
  fileId: string;
  fileIndex: number;
  pageIndex: number; // 0-based
  thumbnailUrl: string;
  pdfDoc: any; // PDFDocumentProxy
  isExcluded?: boolean;
  originalWidth: number;
  originalHeight: number;
}

export function usePdfPages(files: File[]) {
  const [pages, setPages] = useState<PdfPageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let active = true;
    
    async function load() {
      setIsLoading(true);
      setProgress(0);
      const newPages: PdfPageInfo[] = [];
      try {
        let totalPages = 0;
        const loadedPdfs = [];
        
        // First pass: load PDFs to count total pages
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          const file = files[fileIndex];
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          totalPages += pdf.numPages;
          loadedPdfs.push({ file, pdf, fileIndex });
        }

        setProgress(10);
        let processedPages = 0;

        // Second pass: render pages
        for (const { file, pdf, fileIndex } of loadedPdfs) {
          const fileId = `${file.name}-${fileIndex}-${file.size}`;
          
          for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex++) {
            if (!active) return;
            const page = await pdf.getPage(pageIndex + 1);
            const originalViewport = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({ scale: 0.5 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d');
            if (context) {
              await page.render({ canvasContext: context, viewport }).promise;
              const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
              newPages.push({
                id: `${fileId}-page${pageIndex}`,
                fileId,
                fileIndex,
                pageIndex,
                thumbnailUrl,
                pdfDoc: pdf,
                originalWidth: originalViewport.width,
                originalHeight: originalViewport.height
              });
            }
            
            processedPages++;
            if (active) {
              setProgress(10 + Math.round((processedPages / totalPages) * 90));
            }
          }
        }
        if (active) {
          setPages(newPages);
        }
      } catch (err) {
        console.error("Error loading PDF pages", err);
      } finally {
        if (active) {
          setIsLoading(false);
          setProgress(100);
        }
      }
    }
    
    if (files.length > 0) {
      load();
    } else {
      setPages([]);
    }
    
    return () => {
      active = false;
    };
  }, [files]);

  return { pages, setPages, isLoading, progress };
}
