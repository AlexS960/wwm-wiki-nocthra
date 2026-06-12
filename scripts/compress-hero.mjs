import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../public/images/hero-bg.jpg');
const tmp = path.join(__dirname, '../public/images/hero-bg-opt.jpg');

const before = fs.statSync(src).size;
await sharp(src)
  .resize({ width: 1920, withoutEnlargement: true })
  .jpeg({ quality: 72, progressive: true, mozjpeg: true })
  .toFile(tmp);

const after = fs.statSync(tmp).size;
fs.renameSync(tmp, src);
console.log(`hero-bg.jpg: ${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB`);
