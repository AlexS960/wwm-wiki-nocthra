/**
 * Собирает диалоги и гайды «How to Befriend» со страниц Game8 (по ссылкам из 565812-0.md).
 * Запуск: node scripts/scrape-game8-npc-dialogues.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mdPath = process.env.NPC_MD || path.join(
  process.env.USERPROFILE || '',
  '.cursor/projects/d-Site-Site-v3/uploads/565812-0.md',
);
const outPath = path.join(__dirname, '../src/data/aiNpcs.dialogues.json');
const delayMs = Number(process.env.SCRAPE_DELAY || 400);

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function parseNpcUrls(md) {
  const rows = [];
  const lineRe = /^\| (?:\[([^\]]+)\]\((https:\/\/game8\.co\/games\/Where-Winds-Meet\/archives\/\d+)\)|\*\*([^*]+)\*\*)\s*\|/gm;
  let m;
  while ((m = lineRe.exec(md)) !== null) {
    const nameEn = (m[1] || m[3]).trim();
    const url = m[2] || null;
    if (!nameEn || nameEn === 'NPC') continue;
    const id = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    rows.push({ id, nameEn, game8Url: url });
  }
  return rows;
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function parseDialogueLines(block) {
  const lines = [];
  for (const raw of block.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('|') || line.startsWith('Note that')) continue;
    if (line.startsWith('---')) continue;
    if (/^Li Laizuo seems lost/i.test(line)) {
      lines.push({ role: 'system', text: line });
      continue;
    }
    if (line.length < 3) continue;
    const isPlayer = /^(I |I'm |My |We |You must |Your )/i.test(line)
      || /^I am /i.test(line)
      || line.startsWith('You ');
    lines.push({
      role: isPlayer ? 'player' : 'npc',
      text: line,
    });
  }
  return lines.filter(l => l.text.length > 2);
}

function parsePage(text, nameEn) {
  const result = { befriendGuide: '', dialogueLines: [] };

  const befriendH = text.match(/How to Befriend\s+([^\n#]+)/i);
  const befriendStart = befriendH ? text.indexOf(befriendH[0]) : -1;
  const exampleIdx = text.indexOf('Example of Successful Conversation');
  const locationIdx = text.indexOf(' Location', Math.max(befriendStart, 0));

  if (befriendStart >= 0) {
    const end = exampleIdx >= 0 ? exampleIdx : locationIdx >= 0 ? locationIdx : befriendStart + 2500;
    let guide = text.slice(befriendStart, end).trim();
    guide = guide.replace(/^How to Befriend[^\n]*\n*/i, '');
    guide = guide.replace(/###\s*/g, '\n').replace(/\s{2,}/g, ' ').trim();
    if (guide.length > 40) result.befriendGuide = guide.slice(0, 2000);
  }

  if (exampleIdx >= 0) {
    const end = text.indexOf('## ', exampleIdx + 10);
    const block = text.slice(exampleIdx, end > exampleIdx ? end : exampleIdx + 3000);
    const afterTitle = block.replace(/Example of Successful Conversation/i, '').trim();
    result.dialogueLines = parseDialogueLines(afterTitle);
  }

  return result;
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'text/html,application/xhtml+xml',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  return htmlToText(html);
}

async function main() {
  const altMd = path.join(__dirname, '../uploads/565812-0.md');
  const mdFile = fs.existsSync(mdPath) ? mdPath : fs.existsSync(altMd) ? altMd : null;
  if (!mdFile) {
    console.error('MD not found. Set NPC_MD env to 565812-0.md');
    process.exit(1);
  }
  const md = fs.readFileSync(mdFile, 'utf8');
  const npcs = parseNpcUrls(md);
  console.log('NPCs with URLs:', npcs.filter(n => n.game8Url).length);

  const out = {};
  let ok = 0;
  let withDialogue = 0;

  for (let i = 0; i < npcs.length; i++) {
    const n = npcs[i];
    if (!n.game8Url) {
      out[n.id] = { befriendGuide: '', dialogueLines: [] };
      continue;
    }
    try {
      process.stdout.write(`[${i + 1}/${npcs.length}] ${n.nameEn}... `);
      const text = await fetchPage(n.game8Url);
      const parsed = parsePage(text, n.nameEn);
      out[n.id] = parsed;
      ok++;
      if (parsed.dialogueLines.length > 0) withDialogue++;
      console.log(`lines=${parsed.dialogueLines.length}`);
    } catch (e) {
      console.log('ERR', e.message);
      out[n.id] = { befriendGuide: '', dialogueLines: [], error: e.message };
    }
    await sleep(delayMs);
  }

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Done. OK=${ok}, withDialogue=${withDialogue}, saved ${outPath}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
