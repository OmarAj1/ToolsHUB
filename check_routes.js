import fs from 'fs';

const toolsTs = fs.readFileSync('src/data/tools.ts', 'utf-8');
const appTsx = fs.readFileSync('src/App.tsx', 'utf-8');

const toolIdsMatch = toolsTs.matchAll(/id: "([^"]+)"/g);
const toolIds = [...toolIdsMatch].map(m => m[1]);

let missing = [];
for (const id of toolIds) {
  if (!appTsx.includes(`toolId="${id}"`)) {
    missing.push(id);
  }
}

console.log(`There are ${toolIds.length} tools in data, and ${missing.length} missing in App.tsx.`);
console.log(missing.join(', '));
