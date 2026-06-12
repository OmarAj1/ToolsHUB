import fs from 'fs';
import { TOOLS } from './src/data/tools.ts';

const siteUrl = 'https://tools.example.com'; 

const workingTools = TOOLS.filter(t => t.isWorking);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${workingTools.map(t => `  <url>
    <loc>${siteUrl}${t.path}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap generated!');
