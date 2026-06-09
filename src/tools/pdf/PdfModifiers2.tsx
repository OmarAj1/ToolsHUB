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
  return (
    <PdfActionContainer
      title="Upload PDF to reorder"
      buttonText="Save Reordered Pages"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        
        // The visual grid already reconstructed the PDF in the exact order!
        // We just need to save the final file.
        const buffer = await files[0].arrayBuffer();
        downloadFile(buffer, `reordered_${files[0].name}`, "application/pdf");
      }}
      optionsComponent={() => (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-200">
          <p className="text-sm font-medium">✨ Use the interactive grid above to drag, drop, and arrange your pages. When you are happy with the order, click save!</p>
        </div>
      )}
    />
  );
}
