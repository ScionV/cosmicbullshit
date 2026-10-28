import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { activeEvents, chooseFortune, monthKey, nonsense, parseSkyMonth, realJokes,
  planetSignJokes, planetSignFallback, type SkyEvent, type SkyMonth } from '../src/lib/fortunes.ts';

const month = parseSkyMonth(JSON.parse(readFileSync(new URL('../public/sky/2026-10.json', import.meta.url), 'utf8')))!;

test('fortune catalog has unique stable IDs and slip-sized copy', () => {
  const ids = nonsense.map(([id]) => id);
  assert.equal(new Set(ids).size, ids.length, 'Invented fortune IDs must be unique');
  for (const id of ids) assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  const texts = [...nonsense.map(([, text]) => text), ...Object.values(realJokes).flat(),
    ...Object.values(planetSignJokes).flat(), ...planetSignFallback];
  for (const text of texts) {
    assert.ok(text.trim().length > 0, 'Fortunes must not be empty');
    assert.equal(text, text.trim(), 'Fortunes must not have surrounding whitespace');
    assert.ok(Array.from(text).length <= 80, `Fortune must be at most 80 characters: ${text}`);
  }
  for (const [kind, pool] of Object.entries({ ...realJokes, ...planetSignJokes, fallback: planetSignFallback })) {
    assert.ok(pool.length > 0, `${kind} needs at least one explanation`);
    assert.equal(new Set(pool).size, pool.length, `${kind} explanations must not repeat`);
  }
});

function withEvents(events: SkyEvent[]): SkyMonth {
  return { ...month, events };
}

function fixtureEvent(kind: SkyEvent['kind'], subject: string, sign?: string): SkyEvent {
  return { id: `${kind}-${subject}-${month.validFrom}`, kind, subject, sign,
    startsAt: month.validFrom, endsAt: month.validUntil, fact: `Calculated ${subject} fact.` };
}

function seededRandom(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
}

test('every generated calendar validates; legacy calendars remain supported', () => {
  const directory = new URL('../public/sky/', import.meta.url);
  for (const file of readdirSync(directory).filter(file => file.endsWith('.json'))) {
    assert.ok(parseSkyMonth(JSON.parse(readFileSync(new URL(file, directory), 'utf8'))), file);
  }
  assert.ok(parseSkyMonth(withEvents(month.events.filter(event => event.kind !== 'planet-sign'))));
});

test('planet placements require a recognized sign and reject unknown kinds', () => {
  const valid = fixtureEvent('planet-sign', 'Saturn', 'Aries');
  assert.ok(parseSkyMonth(withEvents([valid])));
  for (const sign of [undefined, null, '', 'aries', 'Ophiuchus', 3]) {
    assert.equal(parseSkyMonth({ ...month, events: [{ ...valid, sign }] }), null);
  }
  assert.equal(parseSkyMonth({ ...month, events: [{ ...valid, kind: 'aspects' }] }), null);
});

test('planet readings use body-specific copy with stable IDs, titles and facts', () => {
  for (const [body, jokes] of Object.entries(planetSignJokes)) {
    const event = fixtureEvent('planet-sign', body, 'Scorpio');
    for (let index = 0; index < jokes.length; index++) {
      const choices = [0, 0, 0, (index + 0.5) / jokes.length];
      const result = chooseFortune(withEvents([event]), new Date(month.validFrom), undefined, () => choices.shift()!);
      assert.equal(result.id, `${event.id}-${index}`);
      assert.equal(result.title, `${body} in Scorpio`);
      assert.equal(result.text, jokes[index]);
      assert.equal(result.fact, event.fact);
      assert.deepEqual(result.source, month.source);
      assert.equal(result.startsAt, event.startsAt);
      assert.equal(result.endsAt, event.endsAt);
    }
  }
});

test('unlisted bodies use generic copy, including object prototype names', () => {
  for (const body of ['Ceres', 'constructor', 'toString']) {
    const event = fixtureEvent('planet-sign', body, 'Virgo');
    const result = chooseFortune(withEvents([event]), new Date(month.validFrom), undefined, () => 0);
    assert.equal(result.text, planetSignFallback[0]);
    assert.equal(result.title, `${body} in Virgo`);
  }
});

test('existing reading kinds retain their titles, first jokes, facts and IDs', () => {
  const cases: [SkyEvent['kind'], string, string][] = [
    ['retrograde', 'Mercury', 'Mercury is retrograde'],
    ['moon-sign', 'Leo', 'Moon in Leo'],
    ['moon-phase', 'full Moon', 'Near the full Moon'],
  ];
  for (const [kind, subject, title] of cases) {
    const event = fixtureEvent(kind, subject);
    const result = chooseFortune(withEvents([event]), new Date(month.validFrom), undefined, () => 0);
    assert.equal(result.id, `${event.id}-0`);
    assert.equal(result.title, title);
    assert.equal(result.text, realJokes[kind as keyof typeof realJokes][0]);
    assert.equal(result.fact, event.fact);
  }
});

test('10,000 readings keep the real split, kinds and events balanced without repeats', () => {
  const events = [fixtureEvent('retrograde', 'Mercury'), fixtureEvent('retrograde', 'Saturn'),
    fixtureEvent('moon-sign', 'Leo'), fixtureEvent('moon-phase', 'full Moon'),
    ...Object.keys(planetSignJokes).map(body => fixtureEvent('planet-sign', body, 'Aries'))];
  const data = withEvents(events);
  const random = seededRandom(20261027);
  const kindCounts = new Map<string, number>();
  const eventCounts = new Map<string, number>();
  let realCount = 0;
  let previousId: string | undefined;
  for (let i = 0; i < 10_000; i++) {
    const result = chooseFortune(data, new Date(month.validFrom), previousId, random);
    assert.notEqual(result.id, previousId);
    previousId = result.id;
    if (result.kind !== 'real') continue;
    realCount++;
    const event = events.find(event => result.id.startsWith(`${event.id}-`))!;
    assert.ok(event);
    kindCounts.set(event.kind, (kindCounts.get(event.kind) ?? 0) + 1);
    eventCounts.set(event.id, (eventCounts.get(event.id) ?? 0) + 1);
  }
  assert.ok(Math.abs(realCount / 10_000 - 0.9) < 0.02, `Real share: ${realCount / 10_000}`);
  assert.equal(kindCounts.size, 4);
  for (const [kind, count] of kindCounts) {
    assert.ok(Math.abs(count / realCount - 0.25) < 0.025, `${kind}: ${count / realCount}`);
    const members = events.filter(event => event.kind === kind);
    for (const event of members) {
      const share = (eventCounts.get(event.id) ?? 0) / count;
      assert.ok(Math.abs(share - 1 / members.length) < 0.04, `${event.id}: ${share}`);
    }
  }
});

test('removing the previous joke preserves equal event chances with different pool sizes', () => {
  const known = fixtureEvent('planet-sign', 'Sun', 'Aries');
  const fallback = fixtureEvent('planet-sign', 'Ceres', 'Aries');
  const data = withEvents([known, fallback]);
  const random = seededRandom(42);
  let realCount = 0;
  let fallbackCount = 0;
  for (let i = 0; i < 10_000; i++) {
    const result = chooseFortune(data, new Date(month.validFrom), `${fallback.id}-0`, random);
    assert.notEqual(result.id, `${fallback.id}-0`);
    if (result.kind !== 'real') continue;
    realCount++;
    if (result.id === `${fallback.id}-1`) fallbackCount++;
  }
  assert.ok(Math.abs(fallbackCount / realCount - 0.5) < 0.025);
});

test('planet sign transitions respect the inclusive start and exclusive end', () => {
  const events = month.events.filter(event => event.kind === 'planet-sign' && event.subject === 'Sun');
  assert.equal(events.length, 2);
  const boundary = events[0].endsAt;
  assert.equal(events[1].startsAt, boundary);
  const active = activeEvents(withEvents(events), new Date(boundary));
  assert.deepEqual(active.map(event => event.id), [events[1].id]);
});

test('injected random endpoints are clamped for every selection index', () => {
  const data = withEvents([fixtureEvent('planet-sign', 'Sun', 'Aries')]);
  for (const edge of [-1, 1]) {
    const choices = [0, edge, edge, edge];
    const result = chooseFortune(data, new Date(month.validFrom), undefined, () => choices.shift()!);
    assert.equal(result.kind, 'real');
    assert.equal(result.text, planetSignJokes.Sun[edge < 0 ? 0 : planetSignJokes.Sun.length - 1]);
  }
});

test('real event eligibility uses exact UTC start and exclusive end', () => {
  const event = month.events.find(e => e.kind === 'retrograde' && e.subject === 'Mercury')!;
  assert.ok(activeEvents(month, new Date(event.startsAt)).some(e => e.id === event.id));
  assert.ok(!activeEvents(month, new Date(Date.parse(event.startsAt) - 1000)).some(e => e.id === event.id));
  assert.ok(!activeEvents(month, new Date(event.endsAt)).some(e => e.id === event.id));
});

test('missing, stale, and out-of-range data yields invented excuses only', () => {
  for (const data of [month, null]) {
    const result = chooseFortune(data, new Date('2035-10-24T12:00:00Z'), undefined, () => 0);
    assert.equal(result.kind, 'invented');
    assert.equal(result.source, undefined);
  }
});

test('real fortunes retain source, fact and valid window apart from joke', () => {
  const fortune = chooseFortune(month, new Date('2026-10-24T18:00:00Z'), undefined, () => 0);
  assert.equal(fortune.kind, 'real');
  assert.ok(fortune.fact && fortune.startsAt && fortune.endsAt && fortune.source?.ephemeris);
  assert.notEqual(fortune.text, fortune.fact);
});

test('consecutive invented and real choices do not repeat', () => {
  for (const data of [month, null]) {
    const now = new Date('2026-10-24T18:00:00Z');
    const first = chooseFortune(data, now, undefined, () => 0);
    const next = chooseFortune(data, now, first.id, () => 0);
    assert.notEqual(first.id, next.id);
  }
});

test('malformed data is rejected rather than displayed as real sky', () => {
  assert.equal(parseSkyMonth({ ...month, validUntil: 'not-a-date' }), null);
  assert.equal(parseSkyMonth({ ...month, events: [{ id: 'fake' }] }), null);
  assert.equal(parseSkyMonth({ ...month, source: { url: 'https://example.com' } }), null);
});

test('month keys are UTC at timezone boundaries', () => {
  assert.equal(monthKey(new Date('2026-10-31T22:30:00-04:00')), '2026-11');
});
