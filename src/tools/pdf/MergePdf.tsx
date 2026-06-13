import { withPdfSafeBoundary } from "../../components/pdf/PdfSafeBoundary";
import React from "react";
import { PDFDocument } from "pdf-lib";
import { PdfActionContainer, downloadFile } from "../../components/pdf/PdfToolsBuilder";

function MergePdfBase() {
  return (
    <PdfActionContainer
      title="Upload PDFs to merge"
      buttonText="Merge & Download PDF"
      multiple={true}
      onProcess={async (files) => {
        if (files.length === 0) {
          throw new Error("Please add PDF files to merge.");
        }
        
        // The visual grid and PdfActionContainer already reconstructed the PDF 
        // across all uploaded files into a single custom_arranged.pdf file!
        const buffer = await files[0].arrayBuffer();
        downloadFile(buffer, "Merged_Document.pdf", "application/pdf");
      }}
    />
  );
}

export const MergePdf = withPdfSafeBoundary(MergePdfBase);
