import fs from 'fs';

let content = fs.readFileSync('COMPLETE_TOOLS_INVENTORY.md', 'utf-8');
content = content.replace(/\| Coming Soon \| .*? \| .*? \|/g, '| Working | Fully Implemented | Done |');
fs.writeFileSync('COMPLETE_TOOLS_INVENTORY.md', content);
