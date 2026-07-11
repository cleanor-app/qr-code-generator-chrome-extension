import { chromium } from 'playwright';
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
const R = '/private/tmp/claude-501/-Users-igorshenshin-Developer-Web-cleanor-image-extension/89bc08c0-5659-4da9-8bf6-20c2f35fb115/scratchpad/dcvideo';
const ids = ['scene-intro','scene-ss1','scene-ss2','scene-ss3','scene-ss4','scene-ss5','scene-outro'];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
await p.goto(`file://${R}/scenes.html`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(800);
for (const id of ids) {
  const el = await p.$('#' + id);
  const buf = await el.screenshot();
  writeFileSync(`${R}/${id}.png`, await sharp(buf).flatten({ background: '#0b1020' }).png().toBuffer());
  console.log(id + '.png');
}
await b.close();
console.log('done');
