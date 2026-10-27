import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { activeEvents, chooseFortune, monthKey, nonsense, parseSkyMonth, realJokes } from '../src/lib/fortunes.ts';

const month = parseSkyMonth(JSON.parse(readFileSync(new URL('../public/sky/2026-10.json', import.meta.url), 'utf8')))!;

test('fortune catalog has unique stable IDs and slip-sized copy', () => {
  const ids = nonsense.map(([id]) => id);
  assert.equal(new Set(ids).size, ids.length, 'Invented fortune IDs must be unique');
  for (const id of ids) assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  const texts = [...nonsense.map(([, text]) => text), ...Object.values(realJokes).flat()];
  for (const text of texts) {
    assert.ok(text.trim().length > 0, 'Fortunes must not be empty');
    assert.equal(text, text.trim(), 'Fortunes must not have surrounding whitespace');
    assert.ok(Array.from(text).length < 80, `Fortune must be under 80 characters: ${text}`);
  }
  for (const [kind, pool] of Object.entries(realJokes)) {
    assert.ok(pool.length > 0, `${kind} needs at least one explanation`);
    assert.equal(new Set(pool).size, pool.length, `${kind} explanations must not repeat`);
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
