import { chooseFortune, createCalendarLoader, type DailyReadings, type Fortune, type SkyMonth } from '../lib/fortunes';

const IDLES = [
  'idle', 'idle-sleeve', 'idle-sleepy', 'idle-tie', 'idle-yawn',
  'idle-fist-stretch', 'idle-fist-warmup', 'idle-eye-roll', 'idle-brief-wave', 'idle-dust-shoulders',
];
const READINGS = [
  'reading', 'reading-hands', 'reading-slow-circle', 'reading-two-hand-hover', 'reading-adjust-glasses',
];
const DISPENSINGS = ['dispensing', 'dispensing-headshake', 'dispensing-shrug'];
const BUTTON_SKY = Array.from('🟍✹☾✹🟍');

export function initFortuneMachine() {
  const machine = document.querySelector<HTMLElement>('[data-machine]');
  const button = document.querySelector<HTMLButtonElement>('[data-blame]');
  const video = document.querySelector<HTMLVideoElement>('[data-reaction]');
  if (!machine || !button || !video) return;
  const root = machine;
  const action = button;
  const player = video;
  const status = document.querySelector<HTMLElement>('[data-status]')!;
  const buttonLabel = document.querySelector<HTMLElement>('[data-button-label]')!;
  const buttonSky = document.querySelector<HTMLElement>('[data-button-sky]')!;
  const fortuneElement = document.querySelector<HTMLElement>('[data-fortune]')!;
  const title = document.querySelector<HTMLElement>('[data-fortune-title]')!;
  const joke = document.querySelector<HTMLElement>('[data-fortune-joke]')!;
  const kind = document.querySelector<HTMLElement>('[data-fortune-kind]')!;
  const details = document.querySelector<HTMLElement>('[data-details]')!;
  const motionToggle = document.querySelector<HTMLButtonElement>('[data-motion-toggle]')!;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('cosmic-motion-paused') === 'true'; } catch { /* Storage may be unavailable. */ }
  let busy = false;
  let lastIdle = '';
  let lastReading = '';
  let lastDispensing = '';
  let previousId = 'airplane-mode';
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let buttonTimer: ReturnType<typeof setInterval> | undefined;
  let buttonVisible = true;
  let cancelClip: (() => void) | undefined;
  let calendar: SkyMonth | null = null;
  let daily: DailyReadings | null = null;
  const loadSky = createCalendarLoader();

  function canAnimate() { return !paused && !reducedMotion.matches && !document.hidden; }

  function updateButtonMotion() {
    const animate = canAnimate() && buttonVisible;
    root.dataset.buttonMotion = animate ? 'on' : 'off';
    clearInterval(buttonTimer);
    buttonTimer = undefined;
    buttonSky.hidden = !busy;
    if (!busy) {
      buttonSky.textContent = '';
      return;
    }
    if (!animate) {
      buttonSky.textContent = BUTTON_SKY.join('');
      return;
    }
    // Reserve the full sky's width; only the typed characters change.
    let step = 1;
    buttonSky.textContent = BUTTON_SKY.slice(0, step).join('');
    buttonTimer = setInterval(() => {
      step = step % (BUTTON_SKY.length + 3) + 1;
      buttonSky.textContent = BUTTON_SKY.slice(0, step).join('');
    }, 240);
  }

  function pick(pool: string[], previous: string) {
    const available = pool.filter(clip => clip !== previous);
    return available[Math.floor(Math.random() * available.length)]!;
  }

  async function loadCalendar() {
    const loaded = await loadSky();
    calendar = loaded.month;
    daily = loaded.daily;
  }

  function stopIdleTimer() { clearTimeout(idleTimer); }

  function playClip(clip: string): Promise<void> {
    if (!canAnimate()) return Promise.resolve();
    cancelClip?.();
    return new Promise(resolve => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        player.pause();
        player.classList.remove('is-playing');
        player.removeEventListener('ended', finish);
        player.removeEventListener('error', finish);
        player.removeEventListener('playing', show);
        if (cancelClip === finish) cancelClip = undefined;
        resolve();
      };
      const show = () => player.classList.add('is-playing');
      const timeout = setTimeout(finish, 8500);
      cancelClip = finish;
      player.addEventListener('ended', finish, { once: true });
      player.addEventListener('error', finish, { once: true });
      player.addEventListener('playing', show, { once: true });
      player.src = `/media/v2/${clip}.mp4`;
      player.muted = true;
      player.load();
      void player.play().catch(finish);
    });
  }

  function scheduleIdle() {
    stopIdleTimer();
    if (busy || !canAnimate()) return;
    idleTimer = setTimeout(async () => {
      if (busy || !canAnimate()) return;
      lastIdle = pick(IDLES, lastIdle);
      await playClip(lastIdle);
      scheduleIdle();
    }, 15000 + Math.random() * 15000);
  }

  function fitFortuneCopy() {
    title.style.fontSize = '';
    joke.style.fontSize = '';
    const boundary = fortuneElement.getBoundingClientRect();
    const bottomLimit = boundary.top + boundary.height * 0.58;
    let titleSize = Number.parseFloat(getComputedStyle(title).fontSize);
    let jokeSize = Number.parseFloat(getComputedStyle(joke).fontSize);
    const lastLine = () => (joke.hidden ? title : joke).getBoundingClientRect().bottom;
    while (lastLine() > bottomLimit && (titleSize > 16 || (!joke.hidden && jokeSize > 11))) {
      titleSize = Math.max(16, titleSize - 1);
      jokeSize = Math.max(11, jokeSize - 0.5);
      title.style.fontSize = `${titleSize}px`;
      if (!joke.hidden) joke.style.fontSize = `${jokeSize}px`;
    }
  }

  function showFortune(fortune: Fortune) {
    previousId = fortune.id;
    kind.textContent = fortune.kind === 'real' ? 'Real sky · comic excuse' : 'Invented nonsense';
    title.textContent = fortune.kind === 'real' ? fortune.title : fortune.text;
    joke.hidden = fortune.kind !== 'real';
    joke.textContent = fortune.kind === 'real' ? fortune.text : '';
    fortuneElement.classList.toggle('has-real', fortune.kind === 'real');
    details.hidden = fortune.kind !== 'real';
    document.querySelector<HTMLElement>('[data-astrology]')!.hidden = !fortune.interpretation;
    document.querySelector<HTMLElement>('[data-interpretation]')!.textContent = fortune.interpretation ?? '';
    document.querySelector<HTMLDetailsElement>('[data-source-details]')!.open = false;
    if (fortune.kind === 'real') {
      document.querySelector<HTMLElement>('[data-fact]')!.textContent = fortune.fact!;
      document.querySelector<HTMLElement>('[data-ephemeris]')!.textContent = fortune.source!.ephemeris;
      const format = (value: string) => new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC',
      }).format(new Date(value));
      document.querySelector<HTMLElement>('[data-window]')!.textContent =
        `Calculated window: ${format(fortune.startsAt!)} – ${format(fortune.endsAt!)} UTC.`;
    }
    root.dataset.state = 'resting';
    fitFortuneCopy();
    fortuneElement.classList.remove('is-revealing');
    // Restart the single paper reveal for each issued fortune.
    void fortuneElement.offsetWidth;
    if (canAnimate()) fortuneElement.classList.add('is-revealing');
  }

  action.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    action.disabled = true;
    action.setAttribute('aria-busy', 'true');
    action.setAttribute('aria-label', 'Reading the stars. Your request has been received.');
    stopIdleTimer();
    cancelClip?.();
    root.dataset.state = 'reading';
    status.textContent = 'Request received. Reading the stars. Your excuse is on its way.';
    buttonLabel.textContent = 'Reading';
    updateButtonMotion();
    details.hidden = true;
    try {
      await loadCalendar();
      lastReading = pick(READINGS, lastReading);
      await playClip(lastReading);
      root.dataset.state = 'dispensing';
      buttonLabel.textContent = 'Issuing';
      action.setAttribute('aria-label', 'Issuing your cosmic excuse.');
      status.textContent = 'Your excuse has been reluctantly approved.';
      lastDispensing = pick(DISPENSINGS, lastDispensing);
      await playClip(lastDispensing);
      // A reading/dispensing animation can cross either calendar boundary.
      await loadCalendar();
      showFortune(chooseFortune(calendar, new Date(), previousId, Math.random, daily));
    } finally {
      busy = false;
      action.disabled = false;
      action.setAttribute('aria-busy', 'false');
      action.removeAttribute('aria-label');
      buttonLabel.textContent = 'Blame the cosmos';
      status.textContent = '';
      root.dataset.state = 'resting';
      updateButtonMotion();
      scheduleIdle();
    }
  });

  function updateMotion() {
    motionToggle.textContent = paused ? 'Resume character animations'
      : reducedMotion.matches ? 'Animations off · reduced motion' : 'Pause character animations';
    motionToggle.setAttribute('aria-pressed', String(paused || reducedMotion.matches));
    motionToggle.disabled = reducedMotion.matches;
    updateButtonMotion();
    if (!canAnimate()) { stopIdleTimer(); cancelClip?.(); }
    else scheduleIdle();
  }
  motionToggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('cosmic-motion-paused', String(paused)); } catch { /* Optional preference. */ }
    updateMotion();
  });
  reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', () => {
    updateMotion();
    if (!document.hidden) void loadCalendar();
  });
  window.addEventListener('pagehide', () => { stopIdleTimer(); clearInterval(buttonTimer); cancelClip?.(); });
  new IntersectionObserver(([entry]) => {
    buttonVisible = entry!.isIntersecting;
    updateButtonMotion();
  }).observe(action);
  updateMotion();
  void document.fonts.ready.then(fitFortuneCopy);
  new ResizeObserver(fitFortuneCopy).observe(root);
  void loadCalendar();
}
