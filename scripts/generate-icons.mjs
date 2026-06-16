import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const iconSvg = readFileSync(join(publicDir, 'icon.svg'));

const outputs = [
  { file: 'pwa-192x192.png', size: 192 },
  { file: 'pwa-512x512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'favicon-32x32.png', size: 32 },
];

for (const { file, size } of outputs) {
  await sharp(iconSvg).resize(size, size).png().toFile(join(publicDir, file));
}

const faviconIco = await sharp(iconSvg)
  .resize(32, 32)
  .png()
  .toBuffer();

writeFileSync(join(publicDir, 'favicon.ico'), faviconIco);

console.log('Generated PWA icons in public/');
