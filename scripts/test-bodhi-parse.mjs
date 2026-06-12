import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  parseConversationFromMarkdown,
  extractBefriendGuideFromMarkdown,
} from './game8DialogueParser.mjs';

const md = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), '../uploads/566952-0.md'),
  'utf8',
);

const guide = extractBefriendGuideFromMarkdown(md);
const lines = parseConversationFromMarkdown(md);

console.log('Guide:', guide.slice(0, 200));
console.log('Lines:', lines.length);
lines.forEach((l, i) => console.log(i + 1, l.role, l.textEn.slice(0, 80)));
