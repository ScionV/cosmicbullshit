import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { chooseFortune, createCalendarLoader, dailyKey, parseDailyReadings, parseSkyMonth,
  type DailyReadings, type SkyEvent } from '../src/lib/fortunes.ts';

const month = parseSkyMonth(JSON.parse(readFileSync(new URL('../public/sky/2026-10.json', import.meta.url), 'utf8')))!;
const now = new Date('2026-10-28T16:00:00Z');

function batch(date = '2026-10-28', start = '2026-10-28T04:00:00Z', end = '2026-10-29T04:00:00Z'): DailyReadings {
  const events: SkyEvent[] = [
    { id: 'placement', kind: 'planet-sign', subject: 'Sun', sign: 'Scorpio' },
    { id: 'retrograde', kind: 'retrograde', subject: 'Mercury' },
    { id: 'moon-sign', kind: 'moon-sign', subject: 'Leo' },
    { id: 'moon-phase', kind: 'moon-phase', subject: 'full Moon' },
    { id: 'conjunction', kind: 'conjunction', subject: 'Sun conjunct Venus', bodies: ['Sun', 'Venus'], orbDegrees: 3 },
  ].map(event => ({ ...event, startsAt: start, endsAt: end, fact: `Calculated ${event.subject} fact.` })) as SkyEvent[];
  return { schemaVersion: 1, date, validFrom: start, validUntil: end, source: month.source, events,
    readings: events.flatMap(event => (['tech', 'woo', 'zen'] as const).flatMap(tone => [0, 1].map(index => ({
      id: `daily-${date}-${event.id}-${tone}-${index}`, eventId: event.id, tone,
      text: `${event.subject}: ${tone} form ${index + 1} is pending.`,
    })))) };
}

test('every published daily batch validates against its calendar date', () => {
  const directory = new URL('../public/readings/', import.meta.url);
  if (!existsSync(directory)) return;
  for (const filename of readdirSync(directory).filter(filename => /^\d{4}-\d{2}-\d{2}\.json$/.test(filename))) {
    const data = parseDailyReadings(JSON.parse(readFileSync(new URL(filename, directory), 'utf8')));
    assert.ok(data, filename);
    assert.equal(`${data.date}.json`, filename);
  }
});

test('daily dates follow New York at UTC month boundaries and daylight transitions', () => {
  assert.equal(dailyKey(new Date('2026-11-01T03:59:59Z')), '2026-10-31');
  assert.equal(dailyKey(new Date('2026-11-01T04:00:00Z')), '2026-11-01');
  assert.equal(dailyKey(new Date('2026-11-01T05:30:00Z')), '2026-11-01');
  assert.equal(dailyKey(new Date('2026-11-01T06:30:00Z')), '2026-11-01');
});

test('daily parser accepts complete normal, short and long New York days', () => {
  for (const data of [batch(), batch('2026-03-08', '2026-03-08T05:00:00Z', '2026-03-09T04:00:00Z'),
    batch('2026-11-01', '2026-11-01T04:00:00Z', '2026-11-02T05:00:00Z')]) {
    assert.ok(parseDailyReadings(data), data.date);
  }
});

test('daily parser rejects invalid dates, non-UTC windows, incorrect midnights and source metadata', () => {
  for (const changes of [{ date: '2026-02-30' }, { date: '2026-10-29' },
    { validFrom: '2026-10-28T00:00:00-04:00' }, { validFrom: '2026-10-28T05:00:00Z' },
    { validUntil: '2026-10-30T04:00:00Z' }, { source: { ...month.source, coordinates: undefined } },
    { source: { ...month.source, version: '' } }]) {
    assert.equal(parseDailyReadings({ ...batch(), ...changes }), null, JSON.stringify(changes));
  }
});

test('daily parser requires unique IDs, complete tones, referenced events and short distinct copy', () => {
  const mutations: ((data: DailyReadings) => void)[] = [
    data => { data.readings.pop(); },
    data => { data.readings.push({ ...data.readings[0], id: 'extra', text: 'Extra paperwork.' }); },
    data => { data.readings[1].id = data.readings[0].id; },
    data => { data.readings[0].eventId = 'unknown-event'; },
    data => { data.readings[0].text = 'x'.repeat(81); },
    data => { data.readings[0].text = ' '; },
    data => { data.readings[0].text = 'Your forms.\nThey are pending.'; },
    data => { data.readings[1].text = data.readings[0].text.toUpperCase().replaceAll('.', '!'); },
    data => { data.readings[0].tone = 'other' as 'tech'; },
    data => { data.events[1].id = data.events[0].id; },
    data => { data.events[0].startsAt = '2026-10-28T04:00:00+00:00'; },
    data => { data.events[0].startsAt = '2026-10-29T04:00:00Z'; data.events[0].endsAt = '2026-10-30T04:00:00Z'; },
    data => { data.events = []; data.readings = []; },
  ];
  for (const mutate of mutations) {
    const data = batch();
    mutate(data);
    assert.equal(parseDailyReadings(data), null, mutate.toString());
  }
});

test('conjunctions require two distinct recognized bodies and the configured three-degree orb', () => {
  const event = batch().events.find(event => event.kind === 'conjunction')!;
  assert.ok(parseSkyMonth({ ...month, events: [event] }));
  for (const changes of [{ bodies: ['Sun', 'Sun'] }, { bodies: ['Sun', 'Ceres'] }, { bodies: ['Sun'] },
    { bodies: undefined }, { orbDegrees: 5 }, { orbDegrees: undefined }, { subject: 'A planetary meeting' }]) {
    assert.equal(parseSkyMonth({ ...month, events: [{ ...event, ...changes }] }), null);
  }
});

test('daily choices preserve selected copy ID, factual source and exact event eligibility', () => {
  const data = batch();
  for (const event of data.events) {
    const single = { ...data, events: [event], readings: data.readings.filter(reading => reading.eventId === event.id) };
    const result = chooseFortune(month, now, undefined, () => 0, single);
    assert.equal(result.id, single.readings[0].id);
    assert.equal(result.text, single.readings[0].text);
    assert.equal(result.fact, event.fact);
    assert.deepEqual(result.source, data.source);
    assert.equal(result.startsAt, event.startsAt);
    assert.equal(result.endsAt, event.endsAt);
    if (event.kind === 'conjunction') assert.equal(result.title, 'Sun conjunct Venus');
  }
  const event = data.events[4];
  event.startsAt = '2026-10-28T18:00:00Z';
  event.endsAt = '2026-10-28T19:00:00Z';
  const only = { ...data, events: [event], readings: data.readings.filter(reading => reading.eventId === event.id) };
  assert.equal(chooseFortune(null, new Date(event.startsAt), undefined, () => 0, only).kind, 'real');
  assert.equal(chooseFortune(null, new Date(event.endsAt), undefined, () => 0, only).kind, 'invented');
});

test('daily real readings retain the half split and balance all five kinds with no immediate repeats', () => {
  const data = batch();
  let seed = 20261028;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 0x100000000);
  const counts = new Map<string, number>();
  let real = 0;
  let previousId: string | undefined;
  for (let i = 0; i < 10_000; i++) {
    const result = chooseFortune(month, now, previousId, random, data);
    assert.notEqual(result.id, previousId);
    previousId = result.id;
    if (result.kind !== 'real') continue;
    real++;
    const reading = data.readings.find(reading => reading.id === result.id)!;
    assert.ok(reading, 'A valid daily batch should supply every real reading');
    const kind = data.events.find(event => event.id === reading.eventId)!.kind;
    counts.set(kind, (counts.get(kind) ?? 0) + 1);
  }
  assert.ok(Math.abs(real / 10_000 - 0.5) < 0.02);
  assert.equal(counts.size, 5);
  for (const count of counts.values()) assert.ok(Math.abs(count / real - 0.2) < 0.025);
});

test('missing, expired or future daily batches fall back to current monthly facts', () => {
  for (const daily of [null, batch('2026-10-27', '2026-10-27T04:00:00Z', '2026-10-28T04:00:00Z'),
    batch('2026-10-29', '2026-10-29T04:00:00Z', '2026-10-30T04:00:00Z')]) {
    assert.deepEqual(chooseFortune(month, now, undefined, () => 0, daily), chooseFortune(month, now, undefined, () => 0));
  }
  assert.equal(chooseFortune(null, new Date('2026-10-29T04:00:00Z'), undefined, () => 0, batch()).kind, 'invented');
  assert.equal(chooseFortune(null, new Date('invalid'), undefined, () => 0, batch()).kind, 'invented');
});

test('calendar loading fetches in parallel, caches each click and retries a missing daily deployment', async () => {
  const calls: string[] = [];
  let published = false;
  const load = createCalendarLoader((async input => {
    const path = String(input);
    calls.push(path);
    await Promise.resolve();
    return path.startsWith('/sky/') ? Response.json(month)
      : published ? Response.json(batch()) : new Response('', { status: 404 });
  }) as typeof fetch);
  const first = load(now);
  assert.equal(calls.length, 2, 'Both fetches should start before either resolves');
  assert.equal((await first).daily, null);
  assert.ok((await load(new Date(now.getTime() + 1000))).month);
  assert.equal(calls.length, 2);
  published = true;
  assert.ok((await load(new Date(now.getTime() + 5 * 60 * 1000))).daily);
  assert.deepEqual(calls, ['/sky/2026-10.json', '/readings/2026-10-28.json', '/readings/2026-10-28.json']);
});

test('calendar loading updates UTC months and New York days independently', async () => {
  const calls: string[] = [];
  const load = createCalendarLoader((async input => {
    calls.push(String(input));
    return new Response('', { status: 404 });
  }) as typeof fetch);
  await load(new Date('2026-10-31T23:59:59Z'));
  await load(new Date('2026-11-01T00:00:01Z'));
  await load(new Date('2026-11-01T04:00:00Z'));
  assert.deepEqual(calls, ['/sky/2026-10.json', '/readings/2026-10-31.json', '/sky/2026-11.json',
    '/sky/2026-11.json', '/readings/2026-11-01.json']);
});

test('a slow previous-day download cannot replace the current daily batch', async () => {
  const previous = batch('2026-10-27', '2026-10-27T04:00:00Z', '2026-10-28T04:00:00Z');
  let finishPrevious!: (response: Response) => void;
  const load = createCalendarLoader((async input => {
    const path = String(input);
    if (path === '/readings/2026-10-27.json') return new Promise<Response>(resolve => { finishPrevious = resolve; });
    return Response.json(path.startsWith('/sky/') ? month : batch());
  }) as typeof fetch);
  const old = load(new Date('2026-10-28T03:59:59Z'));
  const current = await load(new Date('2026-10-28T04:00:00Z'));
  assert.equal(current.daily?.date, '2026-10-28');
  finishPrevious(Response.json(previous));
  assert.equal((await old).daily?.date, '2026-10-28');
  assert.equal((await load(new Date('2026-10-28T04:00:01Z'))).daily?.date, '2026-10-28');
});

test('crossing local midnight waits for the in-flight monthly fallback instead of losing it', async () => {
  let finishMonth!: (response: Response) => void;
  let finishPrevious!: (response: Response) => void;
  const calls: string[] = [];
  const load = createCalendarLoader((async input => {
    const path = String(input);
    calls.push(path);
    if (path.startsWith('/sky/')) return new Promise<Response>(resolve => { finishMonth = resolve; });
    if (path.endsWith('2026-10-27.json')) return new Promise<Response>(resolve => { finishPrevious = resolve; });
    return Response.json(batch());
  }) as typeof fetch);
  const old = load(new Date('2026-10-28T03:59:59Z'));
  const current = load(new Date('2026-10-28T04:00:00Z'));
  finishMonth(Response.json(month));
  const loaded = await current;
  assert.ok(loaded.month);
  assert.equal(loaded.daily?.date, '2026-10-28');
  assert.equal(calls.filter(path => path.startsWith('/sky/')).length, 1);
  finishPrevious(Response.json(batch('2026-10-27', '2026-10-27T04:00:00Z', '2026-10-28T04:00:00Z')));
  assert.equal((await old).daily?.date, '2026-10-28');
});

test('crossing UTC month boundaries retains the in-flight daily batch for the same New York day', async () => {
  const data = batch('2026-10-31', '2026-10-31T04:00:00Z', '2026-11-01T04:00:00Z');
  const november = { ...month, validFrom: '2026-11-01T00:00:00Z', validUntil: '2026-12-01T00:00:00Z', events: [] };
  let finishDay!: (response: Response) => void;
  const calls: string[] = [];
  const load = createCalendarLoader((async input => {
    const path = String(input);
    calls.push(path);
    if (path.startsWith('/readings/')) return new Promise<Response>(resolve => { finishDay = resolve; });
    return Response.json(path.includes('2026-11') ? november : month);
  }) as typeof fetch);
  const old = load(new Date('2026-10-31T23:59:59Z'));
  const current = load(new Date('2026-11-01T00:00:01Z'));
  finishDay(Response.json(data));
  assert.equal((await current).daily?.date, '2026-10-31');
  assert.equal((await old).month?.validFrom, november.validFrom);
  assert.equal(calls.filter(path => path.startsWith('/readings/')).length, 1);
});

test('wrong-date and malformed daily responses are rejected while monthly fallback survives', async () => {
  const wrong = batch('2026-10-29', '2026-10-29T04:00:00Z', '2026-10-30T04:00:00Z');
  for (const response of [wrong, { ...batch(), readings: [] }]) {
    const load = createCalendarLoader((async input => Response.json(String(input).startsWith('/sky/') ? month : response)) as typeof fetch);
    const loaded = await load(now);
    assert.ok(loaded.month);
    assert.equal(loaded.daily, null);
  }
});
