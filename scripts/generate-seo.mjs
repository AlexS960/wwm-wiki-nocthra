/**
 * Генерирует public/robots.txt и public/sitemap.xml из src/seo/routes.json.
 * Запускается перед сборкой (npm run build).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const siteUrl = (process.env.VITE_SITE_URL || 'https://wwm-wiki-nocthra-vnd6.vercel.app').replace(/\/$/, '');
const routes = JSON.parse(readFileSync(join(root, 'src/seo/routes.json'), 'utf8'));

const publicRoutes = routes.filter((r) => !r.noindex);
const today = new Date().toISOString().slice(0, 10);

const sitemapEntries = publicRoutes.map((r) => {
  const loc = `${siteUrl}${r.path === '/' ? '/' : r.path}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq || 'weekly'}</changefreq>
    <priority>${r.priority ?? 0.5}</priority>
  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /staffchat

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(join(root, 'public/sitemap.xml'), sitemap, 'utf8');
writeFileSync(join(root, 'public/robots.txt'), robots, 'utf8');

console.log(`[seo] SITE_URL=${siteUrl}`);
console.log(`[seo] sitemap: ${publicRoutes.length} URLs → public/sitemap.xml`);
console.log('[seo] robots.txt → public/robots.txt');
