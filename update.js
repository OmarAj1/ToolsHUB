import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(/<Route path="[^\"]+\/([^\"]+)" element={<ToolLayout toolId="([^"]+)"/g, '<Route path="tool/$2" element={<ToolLayout toolId="$2"');
// Some are mapped differently? Let's check:
// <Route path="text/word-counter" element={<ToolLayout toolId="word-counter">
// If toolId exists, we want path="tool/$toolId"
fs.writeFileSync('src/App.tsx', content);

let toolsContent = fs.readFileSync('src/data/tools.ts', 'utf-8');
toolsContent = toolsContent.replace(/export const TOOLS = RAW_TOOLS\.map[^\n]+/g, 'export const TOOLS = RAW_TOOLS.map(t => ({ ...t, path: `/tool/${t.id}`, isWorking: toolsConfig[t.id]?.isWorking ?? false }));');
fs.writeFileSync('src/data/tools.ts', toolsContent);
console.log("Done");
