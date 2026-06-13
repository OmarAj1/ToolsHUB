import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function test() {
  const enc = fs.readFileSync('test.pdf');
  try {
     const doc = await PDFDocument.load(enc, { password: 'test' });
     const saved = await doc.save();
     fs.writeFileSync('out.pdf', saved);
     console.log('success');
  } catch (e) {
     console.error(e);
  }
}

// create dummy enc pdf
const { execSync } = require('child_process');
execSync("npx -y tsx make_pdf.js", { stdio: 'inherit' });
