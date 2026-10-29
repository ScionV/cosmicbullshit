import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { chooseFortune, parseDailyReadings, type DailyReading, type SkyEvent } from '../src/lib/fortunes.ts';

test('published daily catalogs validate and select only eligible source events', () => {
  const directory = new URL('../public/readings/', import.meta.url);
  const files = readdirSync(directory).filter(file => /^\d{4}-\d{2}-\d{2}\.json$/.test(file));
  assert.ok(files.length, 'The daily desk needs its first published catalog');
  let currentLayoutSeen = false;
  for (const file of files) {
    const batch = parseDailyReadings(JSON.parse(readFileSync(new URL(file, directory), 'utf8')));
    assert.ok(batch, file);
    assert.equal(`${batch.date}.json`, file);
    for (const event of batch.events) {
      const counts = new Map<string, number>();
      for (const reading of batch.readings.filter(item => item.eventId === event.id))
        counts.set(reading.tone, (counts.get(reading.tone) ?? 0) + 1);
      const legacy = { tech: 2, woo: 2, zen: 2 };
      const current = { tech: 1, woo: 1, zen: 2, office: 1, dating: 1, domestic: 1 };
      const matches = (layout: Record<string, number>) =>
        counts.size === Object.keys(layout).length
        && Object.entries(layout).every(([tone, count]) => counts.get(tone) === count);
      if (matches(current)) currentLayoutSeen = true;
      else if (!matches(legacy))
        assert.fail(`${file}: unexpected tone counts for ${event.id}: ${JSON.stringify(Object.fromEntries(counts))}`);
    }
    const checkpoints = new Set([Date.parse(batch.validFrom), Date.parse(batch.validUntil) - 1,
      ...batch.events.flatMap(event => [Date.parse(event.startsAt), Date.parse(event.endsAt)])]);
    for (const time of checkpoints) {
      if (time < Date.parse(batch.validFrom) || time >= Date.parse(batch.validUntil)) continue;
      const result = chooseFortune(null, new Date(time), undefined, () => 0, batch);
      assert.equal(result.kind, 'real');
      const reading: DailyReading | undefined = batch.readings.find(item => item.id === result.id);
      assert.ok(reading, `${file}: ${result.id}`);
      const event: SkyEvent = batch.events.find(item => item.id === reading.eventId)!;
      assert.ok(time >= Date.parse(event.startsAt) && time < Date.parse(event.endsAt));
      assert.equal(result.fact, event.fact);
      assert.equal(result.text, reading.text);
    }
    const expired = chooseFortune(null, new Date(batch.validUntil), undefined, () => 0, batch);
    assert.equal(expired.kind, 'invented');
  }
  assert.ok(currentLayoutSeen, 'public catalogs must exercise the current seven-reading layout');
});
