export const RECEIPT_STAMPS = ['responsibility-declined', 'cosmically-approved', 'referred-to-saturn',
  'filed-under-nonsense', 'pending-universal-review', 'no-further-questions'] as const;
export interface ReceiptPresentation { issuedAt: string; stamp: typeof RECEIPT_STAMPS[number] }
export function createReceiptPresentation(now = new Date(), previous = '', random = Math.random): ReceiptPresentation {
  const available = RECEIPT_STAMPS.filter(stamp => stamp !== previous);
  const index = Math.min(available.length - 1, Math.max(0, Math.floor(random() * available.length)));
  return { issuedAt: now.toISOString(), stamp: available[index]! };
}
export function receiptDate(presentation: ReceiptPresentation): string {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric',
    timeZone: 'America/New_York' }).format(new Date(presentation.issuedAt)).toUpperCase();
}
export const stampSource = (presentation: ReceiptPresentation) => `/art/stamps/${presentation.stamp}.png`;
