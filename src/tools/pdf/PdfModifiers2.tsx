import { useState } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { PdfActionContainer, downloadFile } from "../../components/pdf/PdfToolsBuilder";

export function AddWatermarkPdf() {
  const [watermark, setWatermark] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);

  return (
    <PdfActionContainer
      title="Upload PDF to watermark"
      buttonText="Add Watermark"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        if (!watermark.trim()) throw new Error("Watermark text cannot be empty.");
        
        const buffer = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();
          const fontSize = 60;
          const textWidth = font.widthOfTextAtSize(watermark, fontSize);
          
          page.drawText(watermark, {
            x: width / 2 - textWidth / 2,
            y: height / 2,
            size: fontSize,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
            opacity: opacity,
            rotate: degrees(45),
          });
        }

        const pdfBytes = await pdfDoc.save();
        downloadFile(pdfBytes, `watermarked_${files[0].name}`, "application/pdf");
      }}
      optionsComponent={() => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div>
            <label className="block font-bold text-slate-800 mb-2">Watermark Text</label>
            <input 
              type="text" 
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-800 mb-2">Opacity ({Math.round(opacity * 100)}%)</label>
            <input 
              type="range" 
              min="0.1" max="1" step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    />
  );
}

export function AddPageNumbersPdf() {
  const [position, setPosition] = useState<"bottom-right" | "bottom-center" | "top-right">("bottom-center");

  return (
    <PdfActionContainer
      title="Upload PDF for page numbers"
      buttonText="Add Page Numbers"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        
        const buffer = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        const pages = pdfDoc.getPages();
        pages.forEach((page, idx) => {
          const { width, height } = page.getSize();
          const text = `${idx + 1}`;
          const fontSize = 12;
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          
          let x = width / 2 - textWidth / 2;
          let y = 30;
          
          if (position === "bottom-right") {
            x = width - 30 - textWidth;
          } else if (position === "top-right") {
            x = width - 30 - textWidth;
            y = height - 30;
          }

          page.drawText(text, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
        });

        const pdfBytes = await pdfDoc.save();
        downloadFile(pdfBytes, `numbered_${files[0].name}`, "application/pdf");
      }}
      optionsComponent={() => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block font-bold text-slate-800 mb-4">Position</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={position === "bottom-center"} onChange={() => setPosition("bottom-center")} className="text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Bottom Center</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={position === "bottom-right"} onChange={() => setPosition("bottom-right")} className="text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Bottom Right</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={position === "top-right"} onChange={() => setPosition("top-right")} className="text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Top Right</span>
            </label>
          </div>
        </div>
      )}
    />
  );
}

export function ReorderPdf() {
  const [order, setOrder] = useState("");

  return (
    <PdfActionContainer
      title="Upload PDF to reorder"
      buttonText="Reorder Pages"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        if (!order.trim()) throw new Error("Please specify the new page order.");
        
        const buffer = await files[0].arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer);
        const totalPages = srcDoc.getPageCount();
        
        const parts = order.split(',').map(s => Number(s.trim()));
        if (parts.some(isNaN) || parts.some(p => p < 1 || p > totalPages)) {
            throw new Error("Invalid page numbers in order sequence.");
        }

        const dstDoc = await PDFDocument.create();
        const indices = parts.map(p => p - 1);
        const copiedPages = await dstDoc.copyPages(srcDoc, indices);
        for (const page of copiedPages) {
          dstDoc.addPage(page);
        }

        const pdfBytes = await dstDoc.save();
        downloadFile(pdfBytes, `reordered_${files[0].name}`, "application/pdf");
      }}
      optionsComponent={() => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block font-bold text-slate-800 mb-2">New Page Order</label>
          <input 
            type="text" 
            placeholder="e.g. 3, 1, 2, 5, 4" 
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-slate-500 mt-2">Enter the new exact sequence using commas.</p>
        </div>
      )}
    />
  );
}
