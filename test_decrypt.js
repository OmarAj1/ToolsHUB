import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function run() {
  const doc = await PDFDocument.create();
  doc.addPage([200, 200]);
  const pdfBytes = await doc.save();
  // We can't encrypt with pdf-lib easily, so I don't have an encrypted PDF to test.
  console.log("No encrypted PDF available to test.");
}
run();
