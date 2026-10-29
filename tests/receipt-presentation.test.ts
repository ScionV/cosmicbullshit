import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createReceiptPresentation, receiptDate, RECEIPT_STAMPS, stampSource } from '../src/lib/receipt-presentation.ts';

test('issued date follows New York while retaining the exact issue instant', () => {
  const selection = createReceiptPresentation(new Date('2026-10-30T02:00:00Z'), '', () => 0);
  assert.equal(selection.issuedAt, '2026-10-30T02:00:00.000Z');
  assert.equal(receiptDate(selection), '29 OCT 2026');
  assert.equal(stampSource(selection), '/art/stamps/responsibility-declined.png');
});
test('stamp choices cover every seal and avoid an immediate repeat', () => {
  const now = new Date('2026-10-29T16:00:00Z');
  assert.deepEqual(RECEIPT_STAMPS.map((_, index) => createReceiptPresentation(now, '', () => index / 6).stamp), RECEIPT_STAMPS);
  for (const previous of RECEIPT_STAMPS) {
    for (const random of [() => 0, () => 1]) assert.notEqual(createReceiptPresentation(now, previous, random).stamp, previous);
  }
});
