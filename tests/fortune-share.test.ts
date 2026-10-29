import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fortuneShareText, wrapCardText } from '../src/lib/fortune-share.ts';

test('card wrapping retains every character and keeps joined emoji together', () => {
  const text = '“WWW” 🌙 👩🏽‍🚀 ' + 'W'.repeat(100);
  const measure = (value: string) => Array.from(value).length;
  const lines = wrapCardText(text, 12, measure);
  assert.equal(lines.join('').replace(/\s+/gu, ''), text.replace(/\s+/gu, ''));
  assert.ok(lines.some(line => line.includes('👩🏽‍🚀')));
  assert.ok(lines.every(line => measure(line) <= 12));
  assert.ok(!lines.join('').includes('…'));
});

test('card wrapping handles short copy and a word that fills the measure exactly', () => {
  assert.deepEqual(wrapCardText('The Moon.', 20, value => value.length), ['The Moon.']);
  assert.deepEqual(wrapCardText('12345 abc', 5, value => value.length), ['12345', 'abc']);
});

test('copied fortune text uses the frozen selection and excludes the explanation', () => {
  const fortune = { id: 'zen-variant-2', kind: 'real' as const, title: 'Jupiter in Leo',
    text: 'You may remain unimpressed.', interpretation: 'An explanation excluded from the image.' };
  const copied = fortuneShareText(fortune);
  assert.ok(copied.includes(fortune.title));
  assert.ok(copied.includes(fortune.text));
  assert.ok(copied.includes('Real sky · comic excuse'));
  assert.ok(copied.includes('https://cosmicbullshit.com/'));
  assert.ok(!copied.includes(fortune.interpretation));
  assert.equal(fortuneShareText({ id: 'nonsense', kind: 'invented', title: 'Invented nonsense', text: 'Blame the filing cabinet.' })
    .match(/Invented nonsense/gu)?.length, 1);
});

