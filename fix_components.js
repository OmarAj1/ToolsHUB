import fs from 'fs';

// 1. tools.config.ts: Make everything true
let config = fs.readFileSync('src/tools.config.ts', 'utf-8');
config = config.replace(/isWorking: false/g, 'isWorking: true');
fs.writeFileSync('src/tools.config.ts', config);
