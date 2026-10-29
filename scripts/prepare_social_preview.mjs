// Run against the local Astro dev server: node scripts/prepare_social_preview.mjs [origin]
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const origin = process.argv[2] ?? 'http://127.0.0.1:4321';
const modulePath = process.env.PLAYWRIGHT_MODULE_PATH ?? join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const { chromium } = await import(pathToFileURL(modulePath).href);
const browser = await chromium.launch({ headless: true, channel: 'msedge' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' });
  await page.goto(origin, { waitUntil: 'networkidle' });
  const encoded = await page.evaluate(async () => {
    const font = await new FontFace('PreviewBuenard', 'url(/fonts/Buenard.ttf)', { weight: '400 700' }).load();
    document.fonts.add(font);
    const load = src => new Promise((resolveImage, reject) => {
      const image = new Image(); image.onload = () => resolveImage(image); image.onerror = reject; image.src = src;
    });
    const cabinet = await load(document.querySelector('.cabinet').currentSrc);
    const textureSource = /^url\(["']?(.*?)["']?\)$/u.exec(getComputedStyle(document.body).getPropertyValue('--paper-texture').trim())?.[1];
    const texture = textureSource ? await load(textureSource) : null;
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 630;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e8c898'; ctx.fillRect(0, 0, 1200, 630);
    if (texture) { ctx.globalAlpha = .5; ctx.fillStyle = ctx.createPattern(texture, 'repeat'); ctx.fillRect(0, 0, 1200, 630); ctx.globalAlpha = 1; }
    ctx.fillStyle = '#40192e'; ctx.textBaseline = 'top';
    ctx.beginPath();
    const points = [[24,0],[27.8,17.5],[40,8],[30.5,20.2],[48,24],[30.5,27.8],[40,40],[27.8,30.5],[24,48],[20.2,30.5],[8,40],[17.5,27.8],[0,24],[17.5,20.2],[8,8],[20.2,17.5]];
    points.forEach(([x,y], index) => index ? ctx.lineTo(x+92,y+64) : ctx.moveTo(x+92,y+64)); ctx.closePath(); ctx.fill();
    ctx.font = '700 94px PreviewBuenard';
    ctx.fillText('Cosmic', 90, 142); ctx.fillText('Bullshit', 90, 235);
    ctx.font = '400 36px PreviewBuenard';
    ctx.fillText('A cosmic excuse for', 94, 367); ctx.fillText('whatever went wrong.', 94, 412);
    ctx.font = '400 25px PreviewBuenard'; ctx.fillText('cosmicbullshit.com', 94, 539);
    const cabinetHeight = 700;
    ctx.drawImage(cabinet, 682, -30, cabinetHeight * cabinet.naturalWidth / cabinet.naturalHeight, cabinetHeight);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  const filename = resolve('public/social-preview.png');
  await mkdir(resolve('public'), { recursive: true });
  await writeFile(filename, Buffer.from(encoded, 'base64'));
  const provenanceTool = resolve('.agents/skills/impeccable/scripts/bin/windows-x64/impeccable.exe');
  if (existsSync(provenanceTool)) {
    execFileSync(provenanceTool, ['embed-prompt', filename, '--prompt',
      'Origin: existing approved assets/plates/cabinet.png and assets/plates/paper.png, public/fonts/Buenard.ttf, and existing brand star geometry. Deterministic 1200x630 homepage preview composed by scripts/prepare_social_preview.mjs; no selected fortune or new image generation.'], { stdio: 'inherit' });
  }
  const sources = {};
  for (const source of ['assets/plates/cabinet.png', 'assets/plates/paper.png', 'public/fonts/Buenard.ttf']) {
    sources[source] = createHash('sha256').update(await readFile(source)).digest('hex');
  }
  await writeFile(`${filename}.json`, JSON.stringify({
    kind: 'deterministic-composite', width: 1200, height: 630,
    purpose: 'Generic homepage Open Graph and Twitter preview; never a selected fortune.',
    origin: 'Existing approved cabinet and paper plates, local Buenard, and the existing brand star geometry.',
    recipe: 'scripts/prepare_social_preview.mjs', sourceHashes: sources,
    text: ['Cosmic Bullshit', 'A cosmic excuse for whatever went wrong.', 'cosmicbullshit.com'],
    safeArea: 'Left text remains between x90 and x600, y64 and y570; clerk cabinet occupies the right.',
  }, null, 2) + '\n');
  console.log(filename);
} finally { await browser.close(); }
