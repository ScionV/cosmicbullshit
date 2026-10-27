export interface SkyEvent {
  id: string;
  kind: 'retrograde' | 'moon-sign' | 'moon-phase';
  subject: string;
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

export interface Fortune {
  id: string;
  kind: 'real' | 'invented';
  title: string;
  text: string;
  fact?: string;
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
] as const;

export const realJokes: Record<SkyEvent['kind'], readonly string[]> = {
  retrograde: [
    'An excellent time to revisit old mistakes. Apparently they have missed you.',
    'Even a planet has a “circle back” moment. Your inbox never stood a chance.',
    'The sky is doing a little backtracking. Your plans have decided to join in.',
    'A celestial administrative review is underway. Please resubmit your momentum.',
    'The planet is moonwalking. Your plans are following its lead.',
    'Your ex has been notified of this retrograde and is drafting a text.',
    'It only looks like it’s going backward. Much like your progress.',
  ],
  'moon-sign': [
    'The Moon moved departments. Your feelings await a forwarding address.',
    'A new celestial desk assignment. The emotional paperwork is still your problem.',
    'The Moon has a new address. Its attitude toward your schedule is unchanged.',
    'The clerk reviewed the Moon’s placement and prescribed an unnecessary treat.',
    'The Moon has changed signs. Your mood was not consulted.',
    'Lunar relocation complete. Please update your excuses accordingly.',
    'The Moon has moved. The Bureau recommends that you do not.',
  ],
  'moon-phase': [
    'A real lunar milestone. A deeply convenient excuse to cancel your plans.',
    'The Moon is making a whole thing of it. You may be equally dramatic.',
    'The lunar cycle is progressing. Your laundry situation has declined to comment.',
    'The sky has reached a turning point. You have reached for another biscuit.',
    'The Moon looks different tonight. You look the same. Noted.',
    'The Moon has entered a new phase. You may remain in yours.',
    'A lunar event of moderate importance. Your snack is more important.',
  ],
};

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
        || !['retrograde', 'moon-sign', 'moon-phase'].includes(event.kind)
        || !Number.isFinite(Date.parse(event.startsAt)) || !Number.isFinite(Date.parse(event.endsAt))
        || Date.parse(event.startsAt) >= Date.parse(event.endsAt)) return null;
  }
  return data as SkyMonth;
}

export function activeEvents(month: SkyMonth | null, now: Date): SkyEvent[] {
  const time = now.getTime();
  if (!month || !Number.isFinite(time) || time < Date.parse(month.validFrom) || time >= Date.parse(month.validUntil)) return [];
  return month.events.filter(event => time >= Date.parse(event.startsAt) && time < Date.parse(event.endsAt));
}

export function chooseFortune(month: SkyMonth | null, now = new Date(), previousId?: string,
  random: () => number = Math.random): Fortune {
  const invented: Fortune[] = nonsense.map(([id, text]) => ({ id, kind: 'invented', title: 'Invented nonsense', text }));
  const real: Fortune[] = activeEvents(month, now).flatMap(event => realJokes[event.kind].map((text, index) => ({
    id: `${event.id}-${index}`, kind: 'real' as const,
    title: event.kind === 'retrograde' ? `${event.subject} is retrograde`
      : event.kind === 'moon-sign' ? `Moon in ${event.subject}` : `Near the ${event.subject}`,
    text, fact: event.fact, source: month!.source, startsAt: event.startsAt, endsAt: event.endsAt,
  })));
  const realPool = real.filter(item => item.id !== previousId);
  const inventedPool = invented.filter(item => item.id !== previousId);
  const pool = realPool.length && random() < 0.5 ? realPool : inventedPool;
  return pool[randomIndex(pool.length, random)];
}

export function monthKey(now: Date): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}
