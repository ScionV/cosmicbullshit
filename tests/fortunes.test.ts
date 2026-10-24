import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { activeEvents, chooseFortune, monthKey, parseSkyMonth } from '../src/lib/fortunes.ts';

const month = parseSkyMonth(JSON.parse(readFileSync(new URL('../public/sky/2026-10.json', import.meta.url), 'utf8')))!;

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
