export interface SkyEvent {
  id: string;
  kind: 'retrograde' | 'moon-sign' | 'moon-phase' | 'planet-sign' | 'conjunction';
  subject: string;
  sign?: string;
  bodies?: [string, string];
  orbDegrees?: number;
  startsAt: string;
  endsAt: string;
  fact: string;
}

export interface SkyMonth {
  schemaVersion: 1;
  validFrom: string;
  validUntil: string;
  source: { name: string; version: string; url: string; ephemeris: string; coordinates: string; timeScale: string };
  events: SkyEvent[];
}

export type ReadingTone = 'tech' | 'woo' | 'zen' | 'office' | 'dating' | 'domestic';

export interface DailyReading {
  id: string;
  eventId: string;
  tone: ReadingTone;
  text: string;
}

export interface DailyReadings extends SkyMonth {
  date: string;
  readings: DailyReading[];
  explanations?: { eventId: string; text: string }[];
}

export interface Fortune {
  id: string;
  kind: 'real' | 'invented';
  title: string;
  text: string;
  fact?: string;
  interpretation?: string;
  source?: SkyMonth['source'];
  startsAt?: string;
  endsAt?: string;
}

export const nonsense = [
  ['airplane-mode', 'The Moon has put your motivation on airplane mode.'],
  ['saturn-inbox', 'Saturn has marked your entire inbox as a personal growth opportunity.'],
  ['cosmic-queue', 'Your good luck is important to us. Please remain in the cosmic queue.'],
  ['pluto-printer', 'Pluto has jammed the printer that issues your fresh starts.'],
  ['neptune-password', 'Neptune changed your destiny password and forgot to tell you.'],
  ['mars-draft', 'Mars sent the version of you that was supposed to stay in drafts.'],
  ['venus-receipts', 'Venus has requested three forms of emotional identification.'],
  ['moon-meeting', 'The Moon has scheduled a meeting that could have been a nap.'],
  ['jupiter-tabs', 'Jupiter opened forty-seven tabs in your brain. One is playing music.'],
  ['saturn-signature', 'Saturn needs your signature before you can stop giving a damn.'],
  ['mercury-voicemail', 'Mercury is forwarding all your good intentions to voicemail.'],
  ['cosmic-laundry', 'The universe washed your ambition on the wrong setting.'],
  ['pluto-folder', 'Pluto filed your breakthrough under “miscellaneous.”'],
  ['neptune-spoon', 'Neptune has allocated you one spoon and a mandatory team-building exercise.'],
  ['moon-update', 'The Moon installed an update. Your personality will restart shortly.'],
  ['stars-overtime', 'The stars have approved your request to be tired in a more interesting way.'],
  ['cosmic-parcel', 'Your peace of mind was delivered to a neighboring dimension.'],
  ['saturn-attachment', 'Saturn forgot the attachment. Unfortunately, it was your coping skills.'],
  ['venus-terms', 'Venus updated the terms and conditions of being perceived.'],
  ['mars-flatpack', 'Mars assembled your week without reading the instructions.'],
  ['jupiter-budget', 'Jupiter spent your entire luck budget on finding a decent parking space.'],
  ['cosmic-stamp', 'Your request for a normal day has been stamped “adorable.”'],
  ['neptune-reply', 'Neptune replied-all to your intrusive thoughts.'],
  ['moon-tea', 'The Moon made your tea, forgot about it, and called it character development.'],
  ['desmond-moon', 'Desmond, a minor moon of Uranus, resents you specifically. Nobody knows why.'],
  ['venus-gary', 'Venus called in sick. Your love life has been assigned an asteroid named Gary.'],
  ['cosmic-eyebrow', 'Your stars are aligned. Unfortunately, in the shape of a raised eyebrow.'],
  ['user-error', 'The cosmos has reviewed your complaint and ruled it user error. Case closed.'],
  ['karma-overdraft', 'Your karma is overdrawn. Late fees will be paid in stubbed toes.'],
  ['orion-belt', 'Orion’s belt has come loose. Your love life is not a priority right now.'],
  ['regulation-44b', 'Per Cosmic Regulation 44-B, nothing you did after 11 p.m. is our problem.'],
  ['lint-nebula', 'The Great Lint Nebula has entered your seventh house. Expect fuzz.'],
  ['pluto-wait', 'Estimated wait for good fortune: one Pluto orbit. Please do not call.'],
  ['mars-reorg', 'Mars has restructured your department. You now report to your anxiety.'],
  ['comet-cc', 'A passing comet has cc’d your ex.'],
  ['saturn-audit', 'Saturn is auditing your excuses. Several have been ruled fictional.'],
  ['moon-hold', 'The Moon has placed your glow-up on indefinite hold.'],
  ['jupiter-lanyard', 'Jupiter promised abundance. You have received a lanyard.'],
  ['star-ooo', 'Your guardian star is out of office until further notice.'],
  ['cosmic-survey', 'Please rate your suffering on a scale of one to Saturn.'],
  ['venus-deprecated', 'Venus has deprecated your flirting. Please upgrade to eye contact.'],
  ['big-bang', 'The Big Bang was not about you. Neither is this.'],
  ['mercury-autocorrect', 'Mercury enabled autocorrect on your life choices. It is not helping.'],
  ['cosmic-form', 'Your miracle requires Form 7-Z, available only on alternate Thursdays.'],
  ['cosmic-ticket', 'Your complaint has been assigned a number. The number is imaginary.'],
  ['saturn-training', 'Saturn enrolled you in mandatory training. The subject is consequences.'],
  ['venus-expenses', 'Venus filed your little treats as essential infrastructure.'],
  ['mars-urgency', 'Mars marked everything urgent, then left for the day.'],
  ['mercury-tracking', 'Your fresh start is in transit. Mercury has lost the tracking number.'],
  ['neptune-minutes', 'Neptune took the meeting minutes. They just say “vibes.”'],
  ['pluto-archive', 'Pluto archived the old you. Recovery requires a manager’s approval.'],
  ['cosmic-escalation', 'Your case has been escalated to a slightly taller clerk.'],
] as const;

export const realJokes: Record<Exclude<SkyEvent['kind'], 'planet-sign'>, readonly string[]> = {
  conjunction: [
    'Two celestial departments have merged. Your paperwork has doubled.',
    'The planets held a meeting. You have been assigned the action items.',
  ],
  retrograde: [
    'An excellent time to revisit old mistakes. Apparently they have missed you.',
    'Even a planet has a “circle back” moment. Your inbox never stood a chance.',
    'The sky is doing a little backtracking. Your plans have decided to join in.',
    'A celestial administrative review is underway. Please resubmit your momentum.',
    'The planet is moonwalking. Your plans are following its lead.',
    'Your ex has been notified of this retrograde and is drafting a text.',
    'It only looks like it’s going backward. Much like your progress.',
    'Forward motion has been referred to a committee. They meet never.',
    'Your progress is being reviewed in reverse chronological order.',
  ],
  'moon-sign': [
    'The Moon moved departments. Your feelings await a forwarding address.',
    'A new celestial desk assignment. The emotional paperwork is still your problem.',
    'The Moon has a new address. Its attitude toward your schedule is unchanged.',
    'The clerk reviewed the Moon’s placement and prescribed an unnecessary treat.',
    'The Moon has changed signs. Your mood was not consulted.',
    'Lunar relocation complete. Please update your excuses accordingly.',
    'The Moon has moved. The Bureau recommends that you do not.',
    'The Moon has a desk. Your feelings are still hot-desking.',
    'Your emotional forwarding address has been filed in triplicate.',
  ],
  'moon-phase': [
    'A real lunar milestone. A deeply convenient excuse to cancel your plans.',
    'The Moon is making a whole thing of it. You may be equally dramatic.',
    'The lunar cycle is progressing. Your laundry situation has declined to comment.',
    'The sky has reached a turning point. You have reached for another biscuit.',
    'The Moon looks different tonight. You look the same. Noted.',
    'The Moon has entered a new phase. You may remain in yours.',
    'A lunar event of moderate importance. Your snack is more important.',
    'The lunar milestone is on schedule. Your milestones requested an extension.',
    'The Moon met its quarterly targets. Please stop taking that personally.',
  ],
};

export const planetSignJokes: Record<string, readonly string[]> = {
  Sun: [
    'The Sun has changed signs. Your personality is under new management.',
    'New solar season. Everyone online is suddenly an expert in it.',
    'The Sun has moved on. Your resolutions, sadly, have not.',
    'A new season has begun. The cosmic clerk has not changed his tie.',
    'The Sun is holding a spotlight. Your browser history has declined.',
    'Your main-character request is pending. The Sun requires references.',
  ],
  Mercury: [
    'Mercury has new office space. Your messages will be forwarded eventually.',
    'Mercury has switched signs. Your typos have a fresh new aesthetic.',
    'Mercury is in a new sign. Please re-read everything you sent last week.',
    'Mercury has moved. Your group chat has not recovered.',
    'Mercury reviewed your draft. It has concerns about “per my last email.”',
    'Mercury handles communication. Understanding costs extra.',
  ],
  Venus: [
    'Venus has redecorated. Your taste in people remains under review.',
    'Venus has new standards this season. You did not make the cut.',
    'Venus has moved. Your crush has been notified and remains indifferent.',
    'Venus recommends a little treat. The Bureau recommends a smaller one.',
    'Venus has approved your aesthetic. Your budget has lodged an appeal.',
    'Venus is reviewing your type. The file is mostly red flags.',
  ],
  Mars: [
    'Mars has a new sign and a fresh reason to pick a fight with you.',
    'Mars has moved in. Please secure all loose tempers.',
    'Mars has relocated. Your gym membership remains theoretical.',
    'Mars is in a new sign. Avoid sending emails in all caps.',
    'Mars supplied the drive. You used it to argue in the comments.',
    'Mars has authorized action. Opening another tab does not count.',
  ],
  Jupiter: [
    'Jupiter promises growth. Mostly in your screen time.',
    'Jupiter expands whatever it touches. It touched your to-do list.',
    'Jupiter is in this sign for about a year. Your luck is backordered.',
    'Jupiter brings abundance. Please collect yours from the lost and found.',
    'Jupiter approved a bigger picture. You now need a bigger frame.',
    'Jupiter sees potential. The Bureau would prefer a completed form.',
  ],
  Saturn: [
    'Saturn has arrived with a clipboard and some notes on your choices.',
    'Saturn is here for a while. Consequences now arrive on schedule.',
    'Saturn stays about two and a half years. It brought a binder.',
    'Saturn has reviewed your excuses. Several were ruled fictional.',
    'Saturn calls this a lesson. You would like to speak to admissions.',
    'Saturn has set a boundary. There is a queue to complain about it.',
  ],
  Uranus: [
    'Uranus is shaking things up. Mostly your plans. Specifically yours.',
    'Uranus promises sudden change. The Bureau promises a long lunch.',
    'Uranus is here for about seven years. Your routine is now a suggestion.',
    'Uranus says “expect the unexpected.” The Bureau says “fill out Form 9.”',
    'Uranus has proposed a restructure. Your comfort zone was not invited.',
    'Uranus has updated the plan. There is no longer a plan.',
  ],
  Neptune: [
    'Neptune is blurring the line between intuition and skipping lunch.',
    'Neptune has moved in. Nothing is real, especially your deadlines.',
    'Neptune is here for about fourteen years. Your boundaries are dissolving.',
    'Neptune has dissolved your boundaries. And, somehow, your car keys.',
    'Neptune submitted a vision. Accounting would like something itemized.',
    'Neptune says trust the process. The process has no fixed address.',
  ],
  Pluto: [
    'Pluto is transforming you slowly. Painfully slowly. It’s Pluto.',
    'Pluto remains in this sign. Your transformation is still loading.',
    'Pluto is not technically a planet. It is technically your problem.',
    'Pluto is in charge of rebirth. Your forms are still processing.',
    'Pluto has begun deep renovations. You are still living in the building.',
    'Pluto found the root cause. It would like to discuss excavation fees.',
  ],
};

export const planetSignFallback: readonly string[] = [
  'A planet has changed signs. Your problems kept the same address.',
  'New sign, same planet, same you. The Bureau notes no improvement.',
];

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra',
  'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const BODIES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const TONES: readonly ReadingTone[] = ['tech', 'woo', 'zen', 'office', 'dating', 'domestic'];
const LEGACY_TONES: readonly ReadingTone[] = ['tech', 'woo', 'zen'];
const TONE_LAYOUTS: readonly (readonly (readonly [ReadingTone, number])[])[] = [
  [['tech', 1], ['woo', 1], ['zen', 2], ['office', 1], ['dating', 1], ['domestic', 1]],
  LEGACY_TONES.map(tone => [tone, 2] as const),
];
const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
});
const midnightFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

function isUtcTimestamp(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)
    && Number.isFinite(Date.parse(value))
    && new Date(value).toISOString().replace('.000Z', 'Z') === value;
}

function randomIndex(size: number, random: () => number) {
  return Math.min(size - 1, Math.max(0, Math.floor(random() * size)));
}

export function parseSkyMonth(value: unknown): SkyMonth | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Partial<SkyMonth>;
  if (data.schemaVersion !== 1 || typeof data.validFrom !== 'string' || typeof data.validUntil !== 'string'
      || !Number.isFinite(Date.parse(data.validFrom)) || !Number.isFinite(Date.parse(data.validUntil))
      || Date.parse(data.validFrom) >= Date.parse(data.validUntil) || !Array.isArray(data.events)
      || !data.source || data.source.url !== 'https://github.com/astrorigin/pyswisseph'
      || typeof data.source.ephemeris !== 'string') return null;
  for (const event of data.events) {
    if (!event || typeof event.id !== 'string' || typeof event.subject !== 'string' || typeof event.fact !== 'string'
        || !['retrograde', 'moon-sign', 'moon-phase', 'planet-sign', 'conjunction'].includes(event.kind)
        || (event.kind === 'planet-sign' && (typeof event.sign !== 'string' || !SIGNS.includes(event.sign)))
        || (event.kind === 'conjunction' && (!Array.isArray(event.bodies) || event.bodies.length !== 2
          || event.bodies[0] === event.bodies[1] || !event.bodies.every(body => BODIES.includes(body))
          || event.subject !== `${event.bodies[0]} conjunct ${event.bodies[1]}` || event.orbDegrees !== 3))
        || !Number.isFinite(Date.parse(event.startsAt)) || !Number.isFinite(Date.parse(event.endsAt))
        || Date.parse(event.startsAt) >= Date.parse(event.endsAt)) return null;
  }
  return data as SkyMonth;
}

/** The publishing day follows New York; astronomical windows remain UTC. */
export function dailyKey(now: Date): string {
  const parts = dayFormatter.formatToParts(now);
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-');
}

function normalizedCopy(text: string): string {
  return text.normalize('NFKC').toLocaleLowerCase('en-US').replace(/[^\p{L}\p{N}]+/gu, '');
}

export function parseDailyReadings(value: unknown): DailyReadings | null {
  const calendar = parseSkyMonth(value);
  if (!calendar || !value || typeof value !== 'object') return null;
  const data = value as Partial<DailyReadings>;
  if (typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)
      || !isUtcTimestamp(data.validFrom) || !isUtcTimestamp(data.validUntil)
      || !Array.isArray(data.readings) || !calendar.events.length) return null;
  const date = new Date(`${data.date}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== data.date) return null;
  const followingDate = new Date(date.getTime() + 86400000).toISOString().slice(0, 10);
  const start = new Date(data.validFrom);
  const end = new Date(data.validUntil);
  if (dailyKey(start) !== data.date || dailyKey(end) !== followingDate
      || midnightFormatter.format(start) !== '00:00:00' || midnightFormatter.format(end) !== '00:00:00'
      || ![23, 24, 25].includes((end.getTime() - start.getTime()) / 3600000)) return null;
  if (!['name', 'version', 'url', 'ephemeris', 'coordinates', 'timeScale'].every(key =>
    typeof calendar.source[key as keyof SkyMonth['source']] === 'string'
      && calendar.source[key as keyof SkyMonth['source']].trim().length > 0)) return null;
  const events = new Map<string, SkyEvent>();
  for (const event of calendar.events) {
    if (!event.id.trim() || events.has(event.id) || !event.subject.trim() || !event.fact.trim()
        || !isUtcTimestamp(event.startsAt) || !isUtcTimestamp(event.endsAt)
        || Date.parse(event.startsAt) >= end.getTime() || Date.parse(event.endsAt) <= start.getTime()) return null;
    events.set(event.id, event);
  }
  const ids = new Set<string>();
  const texts = new Set<string>();
  const counts = new Map<string, number>();
  for (const reading of data.readings) {
    if (!reading || typeof reading.id !== 'string' || !reading.id.trim() || ids.has(reading.id)
        || typeof reading.eventId !== 'string' || !events.has(reading.eventId)
        || !TONES.includes(reading.tone) || typeof reading.text !== 'string'
        || reading.text !== reading.text.trim() || !reading.text.trim()
        || Array.from(reading.text).length > 120 || /[\r\n\u0000-\u001f]/u.test(reading.text)) return null;
    const text = normalizedCopy(reading.text);
    if (!text || texts.has(text)) return null;
    ids.add(reading.id);
    texts.add(text);
    const key = `${reading.eventId}\0${reading.tone}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  if (!TONE_LAYOUTS.some(layout => Array.from(events.values()).every(event =>
    layout.every(([tone, expected]) => counts.get(`${event.id}\0${tone}`) === expected)
    && TONES.filter(tone => !layout.some(([included]) => included === tone))
      .every(tone => !counts.has(`${event.id}\0${tone}`))))) return null;
  if (Object.hasOwn(data, 'explanations')) {
    if (!Array.isArray(data.explanations) || data.explanations.length !== events.size) return null;
    const explained = new Set<string>();
    const prose = new Set<string>();
    for (const explanation of data.explanations) {
      if (!explanation || typeof explanation.eventId !== 'string' || !events.has(explanation.eventId)
          || explained.has(explanation.eventId) || typeof explanation.text !== 'string'
          || explanation.text !== explanation.text.trim()
          || Array.from(explanation.text).length < 80 || Array.from(explanation.text).length > 650
          || /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/u.test(explanation.text)) return null;
      const text = normalizedCopy(explanation.text);
      if (!text || prose.has(text)) return null;
      explained.add(explanation.eventId);
      prose.add(text);
    }
  }
  return data as DailyReadings;
}

/** Cache absent batches briefly so a later daily deployment can still be picked up. */
export function createCalendarLoader(fetcher: typeof fetch = fetch) {
  const retryAfter = 5 * 60 * 1000;
  async function getJson(path: string) {
    try {
      const response = await fetcher(path, { signal: AbortSignal.timeout(2500) });
      return response.ok ? await response.json() : null;
    } catch { return null; }
  }
  function resource<T>(folder: string, parse: (value: unknown) => T | null,
    keyOf: (value: T) => string, refreshSuccessful = false) {
    let key = '';
    let value: T | null = null;
    let attemptedAt = -Infinity;
    let pending: Promise<void> | undefined;
    return {
      current: () => value,
      async load(nextKey: string, time: number) {
        if (key !== nextKey) {
          key = nextKey;
          value = null;
          attemptedAt = -Infinity;
          pending = undefined;
        }
        if (pending) return pending;
        if ((value && !refreshSuccessful) || time - attemptedAt < retryAfter) return;
        attemptedAt = time;
        let request!: Promise<void>;
        request = (async () => {
          const parsed = parse(await getJson(`/${folder}/${nextKey}.json`));
          // Earlier downloads may finish after the visitor crossed midnight.
          if (key === nextKey && pending === request) {
            value = parsed && keyOf(parsed) === nextKey ? parsed : null;
            pending = undefined;
          }
        })();
        pending = request;
        return request;
      },
    };
  }
  const months = resource('sky', parseSkyMonth, month => monthKey(new Date(month.validFrom)));
  // Refresh even successful daily files to pick up an editorial correction.
  const days = resource('readings', parseDailyReadings, daily => daily.date, true);
  return async (now = new Date()) => {
    const time = now.getTime();
    await Promise.all([months.load(monthKey(now), time), days.load(dailyKey(now), time)]);
    // Always return the newest cached state, including to an older caller.
    return { month: months.current(), daily: days.current() };
  };
}

export function activeEvents(month: SkyMonth | null, now: Date): SkyEvent[] {
  const time = now.getTime();
  if (!month || !Number.isFinite(time) || time < Date.parse(month.validFrom) || time >= Date.parse(month.validUntil)) return [];
  return month.events.filter(event => time >= Date.parse(event.startsAt) && time < Date.parse(event.endsAt));
}

export function chooseFortune(month: SkyMonth | null, now = new Date(), previousId?: string,
  random: () => number = Math.random, daily?: DailyReadings | null): Fortune {
  const invented: Fortune[] = nonsense.map(([id, text]) => ({ id, kind: 'invented', title: 'Invented nonsense', text }));
  const real = new Map<SkyEvent['kind'], Fortune[][]>();
  const dailyEvents = daily && Number.isFinite(now.getTime()) && daily.date === dailyKey(now)
    ? activeEvents(daily, now) : [];
  const useDaily = dailyEvents.length > 0;
  const calendar = useDaily ? daily! : month;
  for (const event of useDaily ? dailyEvents : activeEvents(month, now)) {
    const jokes = event.kind === 'planet-sign'
      ? (Object.hasOwn(planetSignJokes, event.subject) ? planetSignJokes[event.subject] : planetSignFallback)
      : realJokes[event.kind];
    const copies = useDaily ? daily!.readings.filter(reading => reading.eventId === event.id)
      : jokes.map((text, index) => ({ id: `${event.id}-${index}`, text }));
    const fortunes: Fortune[] = copies.map(({ id, text }) => ({
      id, kind: 'real' as const,
      title: event.kind === 'retrograde' ? `${event.subject} is retrograde`
        : event.kind === 'moon-sign' ? `Moon in ${event.subject}`
        : event.kind === 'planet-sign' ? `${event.subject} in ${event.sign}`
        : event.kind === 'conjunction' ? event.subject : `Near the ${event.subject}`,
      text, fact: event.fact, source: calendar!.source, startsAt: event.startsAt, endsAt: event.endsAt,
      interpretation: useDaily ? daily!.explanations?.find(item => item.eventId === event.id)?.text : undefined,
    })).filter(item => item.id !== previousId);
    if (!fortunes.length) continue;
    const events = real.get(event.kind) ?? [];
    events.push(fortunes);
    real.set(event.kind, events);
  }
  const inventedPool = invented.filter(item => item.id !== previousId);
  if (real.size && random() < 0.9) {
    const kinds = [...real.values()];
    const events = kinds[randomIndex(kinds.length, random)];
    const jokes = events[randomIndex(events.length, random)];
    return jokes[randomIndex(jokes.length, random)];
  }
  return inventedPool[randomIndex(inventedPool.length, random)];
}

export function monthKey(now: Date): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}
