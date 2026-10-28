import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { chooseFortune, parseDailyReadings, type DailyReading, type SkyEvent } from '../src/lib/fortunes.ts';

test('published daily catalogs validate and select only eligible source events', () => {
  const directory = new URL('../public/readings/', import.meta.url);
  const files = readdirSync(directory).filter(file => /^\d{4}-\d{2}-\d{2}\.json$/.test(file));
  assert.ok(files.length, 'The daily desk needs its first published catalog');
  for (const file of files) {
    const batch = parseDailyReadings(JSON.parse(readFileSync(new URL(file, directory), 'utf8')));
    assert.ok(batch, file);
    assert.equal(`${batch.date}.json`, file);
    assert.equal(batch.readings.length, batch.events.length * 6);
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
});
