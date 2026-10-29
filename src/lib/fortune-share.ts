import type { Fortune } from './fortunes';
import type { ReceiptArtwork } from './receipt-art';
import { genericReceiptArtwork } from './receipt-art';
import { createReceiptPresentation, receiptDate, stampSource, type ReceiptPresentation } from './receipt-presentation';

const INK = '#40192e';
const PAPER = '#f4dfb9';
const WIDTH = 1080;
const HEIGHT = 1350;
let cardFont: Promise<FontFace> | undefined;

function loadCardFont() {
  if (!cardFont) {
    cardFont = new FontFace('CosmicCardTypewriter', 'url(/fonts/SpecialElite-Regular.ttf)').load()
      .then(font => { document.fonts.add(font); return font; })
      .catch(error => { cardFont = undefined; throw error; });
  }
  return cardFont;
}

/** Wrap without dropping words or cutting a Unicode grapheme, including joined emoji. */
export function wrapCardText(text: string, width: number, measure: (value: string) => number): string[] {
  const lines: string[] = [];
  let line = '';
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  for (const word of text.split(/\s+/u).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (measure(candidate) <= width) { line = candidate; continue; }
    if (line) { lines.push(line); line = ''; }
    for (const { segment } of segmenter.segment(word)) {
      if (line && measure(line + segment) > width) { lines.push(line); line = ''; }
      line += segment;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timeout = setTimeout(() => reject(new Error('The fortune artwork took too long to load.')), 8000);
    image.onload = () => { clearTimeout(timeout); resolve(image); };
    image.onerror = () => { clearTimeout(timeout); reject(new Error('The fortune artwork could not be loaded.')); };
    image.src = src;
  });
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.beginPath();
  for (let point = 0; point < 16; point++) {
    const angle = Math.PI * point / 8 - Math.PI / 2;
    const size = point % 2 ? radius * 0.2 : radius;
    const px = x + Math.cos(angle) * size;
    const py = y + Math.sin(angle) * size;
    if (point) ctx.lineTo(px, py); else ctx.moveTo(px, py);
  }
  ctx.closePath(); ctx.fill();
}

/** Draw the frozen selection as real text. Explanations and personal data never enter the card. */
export async function renderFortuneCard(fortune: Fortune, artwork: ReceiptArtwork,
  presentation: ReceiptPresentation = createReceiptPresentation()): Promise<Blob> {
  await loadCardFont();
  let layers = artwork.layers;
  let loaded = await Promise.allSettled(layers.map(layer => loadImage(layer.src)));
  if (loaded.some(result => result.status === 'rejected')) {
    layers = genericReceiptArtwork(fortune.kind).layers;
    loaded = await Promise.allSettled(layers.map(layer => loadImage(layer.src)));
  }
  const decorations = await Promise.allSettled([
    loadImage('/art/share-panorama.png'), loadImage('/art/stamps/bureau.png'), loadImage(stampSource(presentation)),
  ]);
  const canvas = document.createElement('canvas'); canvas.width = WIDTH; canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser could not create the fortune image.');
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, WIDTH - 88, HEIGHT - 88);
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  const font = (size: number) => { ctx.font = `${size}px CosmicCardTypewriter`; };
  font(36); ctx.fillText('Cosmic Bullshit', WIDTH / 2, 105);
  font(18); ctx.fillText(fortune.kind === 'real' ? 'REAL SKY · COMIC EXCUSE' : 'INVENTED NONSENSE', WIDTH / 2, 190);
  const title = fortune.kind === 'invented' ? 'Your cosmic excuse' : fortune.title;
  let titleSize = 44, textSize = 36, titleLines: string[] = [], textLines: string[] = [];
  for (;;) {
    font(titleSize); titleLines = wrapCardText(title, 820, value => ctx.measureText(value).width);
    font(textSize); textLines = wrapCardText(fortune.text, 820, value => ctx.measureText(value).width);
    if (titleLines.length * titleSize * 1.2 + 30 + textLines.length * textSize * 1.36 <= 330 || textSize <= 24) break;
    titleSize--; textSize--;
  }
  let y = 260; font(titleSize);
  for (const line of titleLines) { ctx.fillText(line, WIDTH / 2, y); y += titleSize * 1.2; }
  y += 30; font(textSize);
  for (const line of textLines) { ctx.fillText(line, WIDTH / 2, y); y += textSize * 1.36; }

  if (decorations[0].status === 'fulfilled') {
    const panorama = decorations[0].value;
    const banner = document.createElement('canvas'); banner.width = panorama.naturalWidth; banner.height = panorama.naturalHeight;
    const b = banner.getContext('2d')!; b.drawImage(panorama, 0, 0); b.globalCompositeOperation = 'destination-in';
    const fade = b.createLinearGradient(0, 460, 0, 620); fade.addColorStop(0, 'transparent'); fade.addColorStop(1, 'black');
    b.fillStyle = fade; b.fillRect(0, 0, banner.width, banner.height);
    ctx.save(); ctx.beginPath(); ctx.rect(44, 600, 992, 706); ctx.clip(); ctx.drawImage(banner, -360, 450, 1800, 900); ctx.restore();
  }
  let drewArtwork = false;
  layers.forEach((layer, index) => {
    const result = loaded[index]; if (result?.status !== 'fulfilled') return;
    const bw = layer.width * 475, bh = layer.height * 475;
    const scale = Math.min(bw / result.value.naturalWidth, bh / result.value.naturalHeight);
    const width = result.value.naturalWidth * scale, height = result.value.naturalHeight * scale;
    ctx.globalAlpha = layer.opacity ?? 1;
    ctx.drawImage(result.value, 302.5 + layer.x * 475 + (bw - width) / 2,
      587.5 + layer.y * 475 + (bh - height) / 2, width, height);
    drewArtwork = true;
  });
  ctx.globalAlpha = 1;
  if (!drewArtwork) star(ctx, 540, 825, 46);
  if (decorations[1].status === 'fulfilled') ctx.drawImage(decorations[1].value, 112, 977, 145, 145);
  if (decorations[2].status === 'fulfilled') ctx.drawImage(decorations[2].value, 730, 994, 250, 150);
  const impression = (text: string, px: number, py: number) => {
    ctx.save(); ctx.strokeStyle = PAPER; ctx.lineWidth = 3; ctx.lineJoin = 'round';
    ctx.strokeText(text, px, py); ctx.fillText(text, px, py); ctx.restore();
  };
  font(16); ctx.textAlign = 'left'; impression(receiptDate(presentation), 280, 1050);
  font(15); ctx.textAlign = 'right'; impression('Filed by the cosmos.', 970, 1250); impression('Responsibility declined.', 970, 1272);
  // Below the clipped cloud bank and just beneath the inner border.
  font(16); ctx.textAlign = 'center'; ctx.fillText('cosmicbullshit.com', 540, 1317);
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob)
    : reject(new Error('The fortune image could not be exported.')), 'image/png'));
}

export function fortuneShareText(fortune: Fortune): string {
  const label = fortune.kind === 'real' ? 'Real sky · comic excuse' : 'Invented nonsense';
  const title = fortune.title === 'Invented nonsense' ? '' : `${fortune.title}\n`;
  return `${title}${fortune.text}\n\n${label}\nCosmic Bullshit · https://cosmicbullshit.com/`;
}

export function initFortuneSharing() {
  const download = document.querySelector<HTMLButtonElement>('[data-download-fortune]');
  const copy = document.querySelector<HTMLButtonElement>('[data-copy-fortune]');
  const status = document.querySelector<HTMLElement>('[data-export-status]');
  let selection: { fortune: Fortune; artwork: ReceiptArtwork; presentation: ReceiptPresentation; revision: number } | undefined;
  let revision = 0;
  let busy = false;
  let working = false;
  let cached: { revision: number; promise: Promise<Blob> } | undefined;

  function update() {
    for (const button of [download, copy]) if (button) {
      button.disabled = busy || working || !selection;
      button.dataset.tooltip = !selection ? 'Get a fortune first'
        : busy ? 'Issuing your fortune…'
        : button === download ? 'Download image' : 'Copy text';
    }
  }
  function announce(message: string) { if (status) status.textContent = message; }
  function getImage(snapshot: NonNullable<typeof selection>) {
    if (cached?.revision !== snapshot.revision) {
      cached = { revision: snapshot.revision, promise: renderFortuneCard(snapshot.fortune, snapshot.artwork, snapshot.presentation) };
      void cached.promise.catch(() => { if (cached?.revision === snapshot.revision) cached = undefined; });
    }
    return cached.promise;
  }
  function save(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'cosmic-bullshit-fortune.png';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
  async function exportSelection() {
    if (!selection || busy || working) return;
    const snapshot = selection;
    working = true; update(); announce('Preparing your fortune image…');
    try {
      save(await getImage(snapshot));
      announce('Your fortune image is ready to save.');
    } catch { announce('The image could not be downloaded. Try again, or use Copy text.'); }
    finally { working = false; update(); }
  }
  download?.addEventListener('click', () => { void exportSelection(); });
  copy?.addEventListener('click', async () => {
    if (!selection || busy || working) return;
    const text = fortuneShareText(selection.fortune);
    working = true; update();
    try {
      await navigator.clipboard.writeText(text);
      announce('Fortune text copied. The included link opens the homepage.');
    } catch { announce('The text could not be copied. Try Download image instead.'); }
    finally { working = false; update(); }
  });
  update();
  return {
    setFortune(fortune: Fortune, artwork: ReceiptArtwork, presentation = createReceiptPresentation()) {
      // Keep the exact reading; neither rendering nor sharing calls the fortune selector.
      selection = { fortune: structuredClone(fortune), artwork: structuredClone(artwork), presentation: structuredClone(presentation), revision: ++revision };
      cached = undefined; announce(''); update();
      // Pre-render during the reading moment, so downloading is ready when requested.
      void getImage(selection).catch(() => { /* Retry is available from the download button. */ });
    },
    setBusy(value: boolean) { busy = value; if (value) { announce(''); } update(); },
  };
}
