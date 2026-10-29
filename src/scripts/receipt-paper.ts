/** Extend only the blank upper stock. Printed clouds, stars and torn edge keep their proportions. */
export function initReceiptPaper(fortune: HTMLElement) {
  const canvas = fortune.querySelector<HTMLCanvasElement>('[data-receipt-paper]')!;
  const stock = new Image();
  const draw = () => {
    if (!stock.complete || !stock.naturalWidth) return;
    const width = fortune.clientWidth, height = fortune.clientHeight;
    if (!width || !height) return;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext('2d')!; ctx.scale(ratio, ratio);
    const scale = width / stock.naturalWidth;
    const split = 500, base = (stock.naturalHeight - split) * scale;
    const upper = height - base;
    ctx.drawImage(stock, 0, 0, stock.naturalWidth, split, 0, 0, width, upper);
    ctx.drawImage(stock, 0, split, stock.naturalWidth, stock.naturalHeight - split, 0, upper, width, base);
  };
  stock.onload = draw;
  stock.onerror = () => fortune.classList.add('paper-unavailable');
  stock.src = '/art/dispensed-paper.png';
  const observer = new ResizeObserver(draw); observer.observe(fortune);
  window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
}
