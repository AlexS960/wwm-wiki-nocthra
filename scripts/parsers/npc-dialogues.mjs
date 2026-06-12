import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DATA, readJson, writeJson, updateManifest, resolveInput } from './lib/utils.mjs';
import { parseConversationFromHtml, extractBefriendGuideFromHtml } from '../game8DialogueParser.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DATA, 'aiNpcs.dialogues.json');
const delayMs = Number(process.env.SCRAPE_DELAY || 350);

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

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; WWM-Wiki-Sync/1.0)',
      Accept: 'text/html,application/xhtml+xml',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export async function run({ input, dryRun = false, limit = 0, onlyMissing = false } = {}) {
  const mdPath = resolveInput(input, '565812-0.md');
  if (!mdPath) return { skipped: true, reason: 'Нет uploads/565812-0.md' };

  const md = fs.readFileSync(mdPath, 'utf8');
  let npcs = parseNpcUrls(md);
  const prev = readJson(OUT, {});

  if (onlyMissing) {
    npcs = npcs.filter(n => !prev[n.id]?.dialogueLines?.length);
  }
  if (limit > 0) npcs = npcs.slice(0, limit);

  if (dryRun) {
    console.log(`  npcs-dialogues: dry-run, ${npcs.length} NPC для скрейпа`);
    return { section: 'npcs-dialogues', count: npcs.length, dryRun: true };
  }

  const out = { ...prev };
  let withDialogue = 0;

  for (let i = 0; i < npcs.length; i++) {
    const n = npcs[i];
    if (!n.game8Url) {
      out[n.id] = out[n.id] || { befriendGuide: '', dialogueLines: [] };
      continue;
    }
    try {
      process.stdout.write(`  [${i + 1}/${npcs.length}] ${n.nameEn}... `);
      const html = await fetchHtml(n.game8Url);
      const dialogueLines = parseConversationFromHtml(html);
      const befriendGuide = extractBefriendGuideFromHtml(html, n.nameEn);
      out[n.id] = { befriendGuide, dialogueLines };
      if (dialogueLines.length > 0) withDialogue++;
      console.log(`turns=${dialogueLines.length}`);
    } catch (e) {
      console.log(`ERR ${e.message}`);
      out[n.id] = { befriendGuide: '', dialogueLines: [], error: e.message };
    }
    await sleep(delayMs);
  }

  writeJson(OUT, out);
  updateManifest('npcs-dialogues', { count: Object.keys(out).length, withDialogue, source: mdPath });
  console.log(`  npcs-dialogues: сохранено ${Object.keys(out).length}, с диалогами: ${withDialogue}`);
  return { section: 'npcs-dialogues', count: Object.keys(out).length, withDialogue, written: [OUT] };
}
