import { withPdfSafeBoundary } from "../../components/pdf/PdfSafeBoundary";
import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { PdfActionContainer, downloadFile } from "../../components/pdf/PdfToolsBuilder";

function RotatePdfBase() {
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
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h4 className="font-bold text-slate-50 mb-4">Rotation Option</h4>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={rotation === 90} onChange={() => setRotation(90)} className="text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-50">Right (90°)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={rotation === -90} onChange={() => setRotation(-90)} className="text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-50">Left (-90°)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={rotation === 180} onChange={() => setRotation(180)} className="text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-50">Upside down (180°)</span>
            </label>
          </div>
        </div>
      )}
    />
  );
}

function DeletePagesPdfBase() {
  return (
    <PdfActionContainer
      title="Upload PDF to remove pages"
      buttonText="Save PDF"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        
        // The visual grid already reconstructed the PDF without the deleted pages!
        const buffer = await files[0].arrayBuffer();
        downloadFile(buffer, `deleted_${files[0].name}`, "application/pdf");
      }}
      optionsComponent={() => (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
          <p className="text-sm font-medium">✨ Hover over any page in the visual grid above and click the trash icon to delete it. When finished, save your document!</p>
        </div>
      )}
    />
  );
}

function ExtractPagesPdfBase() {
  return (
    <PdfActionContainer
      title="Upload PDF to extract pages"
      buttonText="Save Extracted Pages"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        
        // The visual grid already reconstructed the PDF! Delete what you don't want.
        const buffer = await files[0].arrayBuffer();
        downloadFile(buffer, `extracted_${files[0].name}`, "application/pdf");
      }}
      optionsComponent={() => (
        <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-xl border border-emerald-200">
          <p className="text-sm font-medium">✨ Delete the pages you don't want using the trash icon in the interactive grid. The remaining pages will be extracted and saved!</p>
        </div>
      )}
    />
  );
}

export const RotatePdf = withPdfSafeBoundary(RotatePdfBase);

export const DeletePagesPdf = withPdfSafeBoundary(DeletePagesPdfBase);

export const ExtractPagesPdf = withPdfSafeBoundary(ExtractPagesPdfBase);
