import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { ART_BODIES, ART_SIGNS, RECEIPT_ART_FILES, canonicalPair, genericReceiptArtwork,
  resolveReceiptArtwork } from '../src/lib/receipt-art.ts';
import { chooseFortune, parseDailyReadings, parseSkyMonth, type Fortune, type SkyEvent } from '../src/lib/fortunes.ts';

const event = (kind: SkyEvent['kind'], subject: string, changes: Partial<SkyEvent> = {}): SkyEvent => ({
  id: `${kind}-${subject}`, kind, subject, startsAt: '2026-10-01T00:00:00Z', endsAt: '2026-11-01T00:00:00Z',
  fact: 'A calculated fact.', ...changes,
});
const real = (selected: SkyEvent): Fortune => ({ id: 'reading-zen-1', kind: 'real', title: selected.subject,
  text: 'Your paperwork is pending.', event: selected });

test('every body and sign combination resolves reusable art from the selected event', () => {
  for (const body of ART_BODIES) for (const sign of ART_SIGNS) {
    const art = resolveReceiptArtwork(real(event('planet-sign', body, { sign })));
    assert.equal(art.resolution, 'composed');
    assert.equal(art.key, `placement:${body.toLowerCase()}-${sign.toLowerCase()}`);
    assert.ok(art.layers.some(layer => layer.src === `/art/bodies/${body.toLowerCase()}.png`));
    assert.ok(art.layers.some(layer => layer.src === `/art/signs/${sign.toLowerCase()}.png`));
  }
  for (const sign of ART_SIGNS) {
    const art = resolveReceiptArtwork(real(event('moon-sign', sign)));
    assert.equal(art.key, `placement:moon-${sign.toLowerCase()}`);
    assert.ok(art.layers.some(layer => layer.src === '/art/bodies/moon.png'));
  }
});

test('conjunctions canonicalize reversed body order and support all Moon pairs', () => {
  assert.equal(canonicalPair(['Sun', 'Mercury']), canonicalPair(['Mercury', 'Sun']));
  assert.equal(canonicalPair(['SUN', ' mercury ']), 'mercury-sun');
  for (const body of ART_BODIES.filter(body => body !== 'Moon')) {
    const first = resolveReceiptArtwork(real(event('conjunction', `Moon conjunct ${body}`, { bodies: ['Moon', body] })));
    const reversed = resolveReceiptArtwork(real(event('conjunction', `${body} conjunct Moon`, { bodies: [body, 'Moon'] })));
    assert.deepEqual(first.layers, reversed.layers);
    assert.equal(first.key, reversed.key);
    assert.equal(first.resolution, 'composed');
    assert.ok(first.layers.some(layer => layer.src === '/art/bodies/moon.png'));
    const bodies = first.layers.filter(layer => layer.src.includes('/bodies/'));
    assert.ok(bodies[0].x + bodies[0].width <= bodies[1].x, 'Symbolic bodies remain separated');
  }
  for (const pair of [['Sun', 'Mercury'], ['Mars', 'Jupiter'], ['Mercury', 'Pluto'], ['Sun', 'Pluto']]) {
    const a = resolveReceiptArtwork(real(event('conjunction', pair.join(' conjunct '), { bodies: pair as [string, string] })));
    const b = resolveReceiptArtwork(real(event('conjunction', pair.join(' conjunct '), { bodies: [...pair].reverse() as [string, string] })));
    assert.equal(a.resolution, 'exact');
    assert.equal(a.key, b.key);
    assert.deepEqual(a.layers, b.layers);
    assert.ok(a.layers[0].src.startsWith('/art/scenes/'));
  }
});

test('all four lunar phases and seven requested retrogrades have deliberate treatments', () => {
  for (const [subject, name] of [['new Moon', 'new-moon'], ['first-quarter Moon', 'first-quarter'],
    ['full Moon', 'full-moon'], ['last-quarter Moon', 'last-quarter']]) {
    const art = resolveReceiptArtwork(real(event('moon-phase', subject)));
    assert.equal(art.key, `phase:${name}`);
    assert.equal(art.layers[0].src, `/art/states/${name}.png`);
  }
  for (const body of ['Mercury', 'Venus', 'Saturn', 'Neptune', 'Uranus', 'Jupiter', 'Mars']) {
    const art = resolveReceiptArtwork(real(event('retrograde', body)));
    assert.equal(art.key, `retrograde:${body.toLowerCase()}`);
    assert.equal(art.layers[0].src, '/art/states/retrograde.png');
    assert.equal(art.layers[1].src, `/art/bodies/${body.toLowerCase()}.png`);
  }
});

test('event override wins, unknown input falls back safely, legacy fortunes remain compatible', () => {
  const selected = event('moon-sign', 'Cancer');
  const override = { ...genericReceiptArtwork('real'), key: 'bespoke:event' };
  const result = resolveReceiptArtwork(real(selected), new Map([[selected.id, override]]));
  assert.equal(result.key, override.key);
  assert.equal(result.resolution, 'exact');
  for (const selected of [event('moon-sign', 'Unknown'), event('planet-sign', 'constructor', { sign: 'Gemini' }),
    event('retrograde', 'toString'), event('moon-phase', 'Purple Moon'),
    event('conjunction', 'Unknown conjunct Moon', { bodies: ['Unknown', 'Moon'] }),
    event('conjunction', 'Moon conjunct Moon', { bodies: ['Moon', 'Moon'] })]) {
    const art = resolveReceiptArtwork(real(selected));
    assert.equal(art.resolution, 'kind');
    assert.ok(art.layers.every(layer => RECEIPT_ART_FILES.includes(layer.src)));
  }
  const old: Fortune = { id: 'legacy', kind: 'real', title: 'Moon in Cancer', text: 'Still valid.' };
  assert.equal(resolveReceiptArtwork(old).key, 'generic:real');
  assert.equal(resolveReceiptArtwork({ ...old, kind: 'invented' }).key, 'generic:invented');
  assert.equal(canonicalPair(['constructor', 'Moon']), null);
});

test('asset inventory is unique and every composed layer stays inside the safe square', () => {
  assert.equal(RECEIPT_ART_FILES.length, 34);
  assert.equal(new Set(RECEIPT_ART_FILES).size, RECEIPT_ART_FILES.length);
  const samples = [genericReceiptArtwork('real'), genericReceiptArtwork('invented'),
    ...ART_SIGNS.map(sign => resolveReceiptArtwork(real(event('moon-sign', sign)))),
    ...ART_BODIES.map(body => resolveReceiptArtwork(real(event('retrograde', body)))),
    resolveReceiptArtwork(real(event('conjunction', 'Moon conjunct Jupiter', { bodies: ['Moon', 'Jupiter'] })))];
  for (const art of samples) for (const layer of art.layers) {
    assert.ok(RECEIPT_ART_FILES.includes(layer.src));
    assert.ok(layer.x >= 0 && layer.y >= 0 && layer.width > 0 && layer.height > 0);
    assert.ok(layer.x + layer.width <= 1 && layer.y + layer.height <= 1);
  }
});

test('selected real fortune retains its event without changing its text, ID or catalog', () => {
  const month = parseSkyMonth(JSON.parse(readFileSync(new URL('../public/sky/2026-10.json', import.meta.url), 'utf8')))!;
  const before = JSON.stringify(month);
  const result = chooseFortune(month, new Date('2026-10-29T16:00:00Z'), undefined, () => 0);
  assert.equal(result.kind, 'real');
  assert.ok(result.event);
  assert.ok(month.events.includes(result.event));
  assert.equal(JSON.stringify(month), before);
  assert.equal(result.fact, result.event.fact);
});

test('every registry image exists as a square RGBA PNG', () => {
  for (const path of RECEIPT_ART_FILES) {
    const file = new URL(`../public${path}`, import.meta.url);
    assert.ok(existsSync(file), path);
    const png = readFileSync(file);
    assert.equal(png.subarray(1, 4).toString(), 'PNG', path);
    assert.equal(png.readUInt32BE(16), 480, path);
    assert.equal(png.readUInt32BE(20), 480, path);
    assert.equal(png[25], 6, `${path}: RGBA PNG`);
  }
});

test('all published monthly and historical daily events resolve only existing registered files', () => {
  const verify = (event: SkyEvent) => {
    const art = resolveReceiptArtwork(real(event));
    assert.ok(art.layers.length, event.id);
    for (const layer of art.layers) {
      assert.ok(RECEIPT_ART_FILES.includes(layer.src), `${event.id}: ${layer.src}`);
      assert.ok(existsSync(new URL(`../public${layer.src}`, import.meta.url)), `${event.id}: ${layer.src}`);
    }
  };
  const directory = new URL('../public/sky/', import.meta.url);
  for (const filename of readdirSync(directory).filter(name => name.endsWith('.json'))) {
    const month = parseSkyMonth(JSON.parse(readFileSync(new URL(filename, directory), 'utf8')));
    assert.ok(month, filename);
    month.events.forEach(verify);
  }
  const dailyDirectory = new URL('../public/readings/', import.meta.url);
  for (const filename of readdirSync(dailyDirectory).filter(name => name.endsWith('.json'))) {
    const daily = parseDailyReadings(JSON.parse(readFileSync(new URL(filename, dailyDirectory), 'utf8')));
    assert.ok(daily, filename);
    for (const reading of daily.readings) {
      const event: SkyEvent = daily.events.find(candidate => candidate.id === reading.eventId)!;
      verify(event);
      assert.equal(resolveReceiptArtwork({ ...real(event), id: reading.id, text: reading.text }).key,
        resolveReceiptArtwork(real(event)).key, `${reading.id}: art follows event and preserves reading selection`);
    }
  }
});
