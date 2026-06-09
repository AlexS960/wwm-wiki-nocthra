import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const md = fs.readFileSync(path.join(__dirname, '../uploads/565812-0.md'), 'utf8');
const dialoguesPath = path.join(__dirname, '../src/data/aiNpcs.dialogues.json');
const dialogues = JSON.parse(fs.readFileSync(dialoguesPath, 'utf8'));

const urlRe = /\[([^\]]+)\]\((https:\/\/game8\.co\/games\/Where-Winds-Meet\/archives\/\d+)\)/g;
const urls = new Map();
let m;
while ((m = urlRe.exec(md)) !== null) {
  const id = m[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  urls.set(id, m[2]);
}

function strip(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractBefriend(html) {
  const i = html.indexOf('How to Befriend');
  if (i < 0) return '';
  const end = html.indexOf('Example of Successful Conversation', i);
  const chunk = html.slice(i, end > i ? end : i + 6000);
  const parts = [];
  for (const h of chunk.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)) {
    const title = strip(h[1]);
    const after = chunk.slice(h.index, h.index + 800);
    const p = after.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (p) parts.push(`${title}\n${strip(p[1])}`);
  }
  if (parts.length) return parts.join('\n\n').slice(0, 1500);
  const p = chunk.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return p ? strip(p[1]).slice(0, 1500) : '';
}

async function main() {
  for (const [id, url] of urls) {
    if (!dialogues[id]) dialogues[id] = { dialogueLines: [] };
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });
      const html = await res.text();
      const guide = extractBefriend(html);
      if (guide.length > 30) dialogues[id].befriendGuide = guide;
      process.stdout.write('.');
    } catch {
      process.stdout.write('x');
    }
    await new Promise(r => setTimeout(r, 250));
  }
  fs.writeFileSync(dialoguesPath, JSON.stringify(dialogues, null, 2));
  console.log('\nDone');
}

main();
