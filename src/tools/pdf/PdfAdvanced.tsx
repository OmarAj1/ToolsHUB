import { withPdfSafeBoundary } from "../../components/pdf/PdfSafeBoundary";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { PdfActionContainer, downloadFile } from "../../components/pdf/PdfToolsBuilder";
import { Info } from "lucide-react";

function SplitPdfBase() {
  const [ranges, setRanges] = useState("1, 2-3");

  return (
    <PdfActionContainer
      title="Upload PDF to split"
      buttonText="Split PDF (ZIP)"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        if (!ranges.trim()) throw new Error("Must provide at least one page range.");
        
        const buffer = await files[0].arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer);
        const totalPages = srcDoc.getPageCount();
        
        const zip = new JSZip();
        
        const rangeParts = ranges.split(",").map(r => r.trim());
        let count = 1;
        for (const part of rangeParts) {
          if (!part) continue;
          let start = -1, end = -1;
          if (part.includes("-")) {
            const split = part.split("-");
            start = parseInt(split[0]);
            end = parseInt(split[1]);
          } else {
            start = parseInt(part);
            end = start;
          }
          
          if (isNaN(start) || isNaN(end) || start < 1 || start > totalPages || end < start) {
            throw new Error(`Invalid range: ${part}. Pages must be between 1 and ${totalPages}.`);
          }
          
          const splitDoc = await PDFDocument.create();
          const indices = [];
          for (let p = start; p <= end && p <= totalPages; p++) {
            indices.push(p - 1); // 0-indexed internally
          }
          
          const copiedPages = await splitDoc.copyPages(srcDoc, indices);
          copiedPages.forEach(p => splitDoc.addPage(p));
          
          const pdfBytes = await splitDoc.save();
          zip.file(`split_${count}_pages_${start}_to_${Math.min(end, totalPages)}.pdf`, pdfBytes);
          count++;
        }
        
        if (count === 1) throw new Error("No valid ranges provided.");
        
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadFile(zipBlob, `split_${files[0].name.replace('.pdf', '')}.zip`, "application/zip");
      }}
      optionsComponent={() => (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <label className="block font-bold text-slate-50 mb-2">Page Ranges to Split into Separate PDFs</label>
          <input 
            type="text" 
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="e.g. 1, 2-5, 8-10"
            className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 focus:outline-none text-white"
          />
          <p className="text-xs text-slate-400 mt-2">Comma separated ranges. Each range will be output as a separate PDF in the zip.</p>
        </div>
      )}
    />
  );
}

function PdfMetadataViewerBase() {
  const [metadata, setMetadata] = useState<any>(null);

  if (metadata) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-50">PDF Metadata</h2>
            <button onClick={() => setMetadata(null)} className="text-sm font-bold text-blue-600 hover:underline">Read another file</button>
          </div>
          <div className="space-y-4">
            {Object.entries(metadata).map(([key, val]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-slate-700 last:border-0">
                <span className="text-sm font-bold text-slate-400 w-1/3 uppercase tracking-wider">{key}</span>
                <span className="text-base font-medium text-slate-50">{val ? String(val) : <em className="text-slate-300">Not set</em>}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <PdfActionContainer
      title="Upload PDF to read metadata"
      buttonText="Read Metadata"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        
        const buffer = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { updateMetadata: false });
        
        setMetadata({
          Title: pdfDoc.getTitle(),
          Author: pdfDoc.getAuthor(),
          Subject: pdfDoc.getSubject(),
          Keywords: pdfDoc.getKeywords(),
          Producer: pdfDoc.getProducer(),
          Creator: pdfDoc.getCreator(),
          CreationDate: pdfDoc.getCreationDate()?.toLocaleString(),
          ModificationDate: pdfDoc.getModificationDate()?.toLocaleString(),
          PageCount: pdfDoc.getPageCount()
        });
      }}
    />
  );
}

export const SplitPdf = withPdfSafeBoundary(SplitPdfBase);

export const PdfMetadataViewer = withPdfSafeBoundary(PdfMetadataViewerBase);
