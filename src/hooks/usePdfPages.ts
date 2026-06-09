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

  useEffect(() => {
    let active = true;
    
    async function load() {
      setIsLoading(true);
      const newPages: PdfPageInfo[] = [];
      try {
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          const file = files[fileIndex];
          const fileId = `${file.name}-${fileIndex}-${file.size}`;
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          
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
          }
        }
        if (active) {
          setPages(newPages);
        }
      } catch (err) {
        console.error("Error loading PDF pages", err);
      } finally {
        if (active) setIsLoading(false);
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

  return { pages, setPages, isLoading };
}
