import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/tools/pdf');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');

  if (content.includes('withPdfSafeBoundary')) continue;

  const importStmt = `import { withPdfSafeBoundary } from "../../components/pdf/PdfSafeBoundary";\n`;
  content = importStmt + content;

  const exports: string[] = [];
  content = content.replace(/export\s+function\s+([A-Za-z0-9_]+)\s*\(/g, (match, name) => {
    exports.push(name);
    return `function ${name}Base(`;
  });

  if (exports.length > 0) {
    for (const exp of exports) {
      content += `\nexport const ${exp} = withPdfSafeBoundary(${exp}Base);\n`;
    }
    fs.writeFileSync(filepath, content, 'utf8');
  }
}
console.log('Done mapping components!');
