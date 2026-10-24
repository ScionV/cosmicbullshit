import { chooseFortune, monthKey, parseSkyMonth, type Fortune, type SkyMonth } from '../lib/fortunes';

const IDLES = ['idle', 'idle-sleeve', 'idle-sleepy', 'idle-tie', 'idle-yawn'];
const READINGS = ['reading', 'reading-hands'];

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
  let previousId = 'airplane-mode';
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let cancelClip: (() => void) | undefined;
  let calendar: SkyMonth | null = null;
  let calendarKey = '';
  let calendarPromise: Promise<void> | undefined;

  function canAnimate() { return !paused && !reducedMotion.matches && !document.hidden; }

  function pick(pool: string[], previous: string) {
    const available = pool.filter(clip => clip !== previous);
    return available[Math.floor(Math.random() * available.length)]!;
  }

  async function loadCalendar() {
    const key = monthKey(new Date());
    if (key === calendarKey && calendar) return;
    if (calendarPromise) return calendarPromise;
    calendar = null;
    calendarKey = key;
    calendarPromise = (async () => {
      try {
        const response = await fetch(`/sky/${key}.json`, { signal: AbortSignal.timeout(2500) });
        if (response.ok) calendar = parseSkyMonth(await response.json());
      } catch { calendar = null; }
      finally { calendarPromise = undefined; }
    })();
    return calendarPromise;
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
      player.src = `/media/${clip}.mp4`;
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
    stopIdleTimer();
    cancelClip?.();
    root.dataset.state = 'reading';
    status.textContent = 'Consulting the appropriate celestial department…';
    buttonLabel.textContent = 'Reading the stars';
    details.hidden = true;
    try {
      await loadCalendar();
      lastReading = pick(READINGS, lastReading);
      await playClip(lastReading);
      root.dataset.state = 'dispensing';
      buttonLabel.textContent = 'Issuing your excuse';
      status.textContent = 'Your excuse has been reluctantly approved.';
      await playClip('dispensing');
      showFortune(chooseFortune(calendar, new Date(), previousId));
    } finally {
      busy = false;
      action.disabled = false;
      buttonLabel.textContent = 'Blame the cosmos';
      status.textContent = '';
      root.dataset.state = 'resting';
      scheduleIdle();
    }
  });

  function updateMotion() {
    motionToggle.textContent = paused ? 'Resume character animations'
      : reducedMotion.matches ? 'Animations off · reduced motion' : 'Pause character animations';
    motionToggle.setAttribute('aria-pressed', String(paused || reducedMotion.matches));
    motionToggle.disabled = reducedMotion.matches;
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
  window.addEventListener('pagehide', () => { stopIdleTimer(); cancelClip?.(); });
  updateMotion();
  void document.fonts.ready.then(fitFortuneCopy);
  new ResizeObserver(fitFortuneCopy).observe(root);
  void loadCalendar();
}
