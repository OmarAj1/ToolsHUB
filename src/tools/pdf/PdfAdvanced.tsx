import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { PdfActionContainer, downloadFile } from "../../components/pdf/PdfToolsBuilder";
import { Info } from "lucide-react";

export function SplitPdf() {
  const [splitEvery, setSplitEvery] = useState(1);

  return (
    <PdfActionContainer
      title="Upload PDF to split"
      buttonText="Split PDF (ZIP)"
      onProcess={async (files) => {
        if (!files[0]) throw new Error("No file selected.");
        if (splitEvery < 1) throw new Error("Must split by at least 1 page.");
        
        const buffer = await files[0].arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer);
        const totalPages = srcDoc.getPageCount();
        
        const zip = new JSZip();
        
        for (let i = 0; i < totalPages; i += splitEvery) {
          const splitDoc = await PDFDocument.create();
          const indices = [];
          for (let p = i; p < i + splitEvery && p < totalPages; p++) {
            indices.push(p);
          }
          
          const copiedPages = await splitDoc.copyPages(srcDoc, indices);
          copiedPages.forEach(p => splitDoc.addPage(p));
          
          const pdfBytes = await splitDoc.save();
          zip.file(`split_${i+1}_to_${Math.min(i+splitEvery, totalPages)}.pdf`, pdfBytes);
        }
        
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadFile(zipBlob, `split_${files[0].name.replace('.pdf', '')}.zip`, "application/zip");
      }}
      optionsComponent={() => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <label className="block font-bold text-slate-800 mb-2">Split every N pages</label>
          <input 
            type="number" 
            min="1"
            value={splitEvery}
            onChange={(e) => setSplitEvery(parseInt(e.target.value) || 1)}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
      )}
    />
  );
}

export function PdfMetadataViewer() {
  const [metadata, setMetadata] = useState<any>(null);

  if (metadata) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">PDF Metadata</h2>
            <button onClick={() => setMetadata(null)} className="text-sm font-bold text-blue-600 hover:underline">Read another file</button>
          </div>
          <div className="space-y-4">
            {Object.entries(metadata).map(([key, val]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm font-bold text-slate-400 w-1/3 uppercase tracking-wider">{key}</span>
                <span className="text-base font-medium text-slate-800">{val ? String(val) : <em className="text-slate-300">Not set</em>}</span>
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
