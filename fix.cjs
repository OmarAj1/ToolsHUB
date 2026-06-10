const fs = require('fs');
const files = [
  'src/tools/design/CssTriangleGenerator.tsx', 
  'src/tools/design/SvgBlobGenerator.tsx',
  'src/tools/design/NeumorphismGenerator.tsx',
  'src/tools/design/CssGradientGenerator.tsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  fs.writeFileSync(f, content);
});
console.log('Fixed files!');
