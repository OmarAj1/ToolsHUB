import fs from 'fs';

const textToolIds = [
  "word-counter",
  "case-converter",
  "remove-duplicate-lines",
  "sort-lines",
  "reverse-lines",
  "character-counter",
  "extract-emails",
  "extract-urls",
  "remove-empty-lines",
  "text-compare",
  "find-and-replace",
  "csv-cleaner",
  "whitespace-remover",
  "text-formatter",
  "markdown-to-html",
  "lorem-ipsum-generator",
  "diff-viewer"
];

let content = fs.readFileSync('src/tools.config.ts', 'utf8');

textToolIds.forEach(id => {
  const regex = new RegExp(`("${id}":\\s*\\{\\s*isWorking:\\s*)false(\\s*\\})`);
  content = content.replace(regex, '$1true$2');
});

fs.writeFileSync('src/tools.config.ts', content, 'utf8');
console.log('Fixed text tools flags!');
