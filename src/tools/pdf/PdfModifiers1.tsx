import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { PdfActionContainer, downloadFile } from "../../components/pdf/PdfToolsBuilder";

export function RotatePdf() {
  const [rotation, setRotation] = useState<number>(90);

  return (
    <PdfActionContainer
      title="Upload PDF to rotate"
      buttonText="Rotate PDF"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        const buffer = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + rotation));
        });
        const pdfBytes = await pdfDoc.save();
        downloadFile(pdfBytes, `rotated_${files[0].name}`, "application/pdf");
      }}
      optionsComponent={() => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-4">Rotation Option</h4>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={rotation === 90} onChange={() => setRotation(90)} className="text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Right (90°)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={rotation === -90} onChange={() => setRotation(-90)} className="text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Left (-90°)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={rotation === 180} onChange={() => setRotation(180)} className="text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Upside down (180°)</span>
            </label>
          </div>
        </div>
      )}
    />
  );
}

export function DeletePagesPdf() {
  const [pagesToDelete, setPagesToDelete] = useState("");

  return (
    <PdfActionContainer
      title="Upload PDF to remove pages"
      buttonText="Delete Pages"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        if (!pagesToDelete.trim()) throw new Error("Please specify pages to delete.");
        
        const buffer = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        const totalPages = pdfDoc.getPageCount();
        
        // Parse "1, 3, 5-7"
        let toDelete = new Set<number>();
        const parts = pagesToDelete.split(',').map(s => s.trim());
        for (const p of parts) {
          if (p.includes('-')) {
            const [start, end] = p.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) toDelete.add(i);
            }
          } else {
            const num = Number(p);
            if (!isNaN(num)) toDelete.add(num);
          }
        }

        const sortedToDelete = Array.from(toDelete).filter(p => p >= 1 && p <= totalPages).sort((a,b) => b - a);
        if (sortedToDelete.length === totalPages) throw new Error("You cannot delete all pages!");

        for (const pageNum of sortedToDelete) {
          pdfDoc.removePage(pageNum - 1);
        }

        const pdfBytes = await pdfDoc.save();
        downloadFile(pdfBytes, `deleted_${files[0].name}`, "application/pdf");
      }}
      optionsComponent={() => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block font-bold text-slate-800 mb-2">Pages to delete</label>
          <input 
            type="text" 
            placeholder="e.g. 1, 3, 5-7" 
            value={pagesToDelete}
            onChange={(e) => setPagesToDelete(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-slate-500 mt-2">Comma separated numbers or ranges (e.g., 2, 4-6, 9).</p>
        </div>
      )}
    />
  );
}

export function ExtractPagesPdf() {
  const [pagesToExtract, setPagesToExtract] = useState("");

  return (
    <PdfActionContainer
      title="Upload PDF to extract pages"
      buttonText="Extract Pages"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        if (!pagesToExtract.trim()) throw new Error("Please specify pages to extract.");
        
        const buffer = await files[0].arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer);
        const totalPages = srcDoc.getPageCount();
        
        let toExtract = new Set<number>();
        const parts = pagesToExtract.split(',').map(s => s.trim());
        for (const p of parts) {
          if (p.includes('-')) {
            const [start, end] = p.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) toExtract.add(i);
            }
          } else {
            const num = Number(p);
            if (!isNaN(num)) toExtract.add(num);
          }
        }

        const validExtract = Array.from(toExtract).filter(p => p >= 1 && p <= totalPages).sort((a,b) => a - b);
        if (validExtract.length === 0) throw new Error("No valid pages selected.");

        const dstDoc = await PDFDocument.create();
        const indices = validExtract.map(p => p - 1);
        const copiedPages = await dstDoc.copyPages(srcDoc, indices);
        for (const page of copiedPages) {
          dstDoc.addPage(page);
        }

        const pdfBytes = await dstDoc.save();
        downloadFile(pdfBytes, `extracted_${files[0].name}`, "application/pdf");
      }}
      optionsComponent={() => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block font-bold text-slate-800 mb-2">Pages to extract</label>
          <input 
            type="text" 
            placeholder="e.g. 1, 3, 5-7" 
            value={pagesToExtract}
            onChange={(e) => setPagesToExtract(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-slate-500 mt-2">Comma separated numbers or ranges.</p>
        </div>
      )}
    />
  );
}
