import type { Fortune, SkyEvent } from './fortunes';

export interface ReceiptArtLayer {
  src: string;
  /** Position and size within a square, shared by the live receipt and PNG export. */
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}

export interface ReceiptArtwork {
  key: string;
  family: 'placement' | 'retrograde' | 'moon-phase' | 'conjunction' | 'real' | 'invented';
  resolution: 'exact' | 'composed' | 'kind' | 'generic';
  /** Describes the symbolic art, not astronomical evidence. Images beside the reading use alt="". */
  label: string;
  layers: readonly ReceiptArtLayer[];
}

export const ART_BODIES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'] as const;
export const ART_SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra',
  'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] as const;

const slug = (value: string) => value.toLowerCase();
const bodyPath = (body: string) => `/art/bodies/${slug(body)}.png`;
const signPath = (sign: string) => `/art/signs/${slug(sign)}.png`;
const statePath = (state: string) => `/art/states/${state}.png`;
const full = (src: string): ReceiptArtLayer => ({ src, x: 0, y: 0, width: 1, height: 1 });

function recognized(value: string | undefined, pool: readonly string[]): string | undefined {
  return typeof value === 'string' ? pool.find(item => item.toLowerCase() === value.trim().toLowerCase()) : undefined;
}

/** Alphabetic, case-insensitive keys make A–B and B–A the same symbolic scene. */
export function canonicalPair(bodies: readonly string[]): string | null {
  if (bodies.length !== 2) return null;
  const pair = bodies.map(body => recognized(body, ART_BODIES));
  if (!pair[0] || !pair[1] || pair[0] === pair[1]) return null;
  return [pair[0], pair[1]].map(slug).sort().join('-');
}

const sceneFiles = new Map<string, string>([
  ['mercury-sun', 'sun-mercury'],
  ['jupiter-mars', 'mars-jupiter'],
  ['mercury-pluto', 'mercury-pluto'],
  ['pluto-sun', 'sun-pluto'],
]);

const phases = new Map<string, string>([
  ['new moon', 'new-moon'],
  ['first-quarter moon', 'first-quarter'],
  ['first quarter moon', 'first-quarter'],
  ['full moon', 'full-moon'],
  ['last-quarter moon', 'last-quarter'],
  ['last quarter moon', 'last-quarter'],
]);

export function genericReceiptArtwork(kind: Fortune['kind']): ReceiptArtwork {
  return kind === 'real'
    ? { key: 'generic:real', family: 'real', resolution: 'generic', label: 'Symbolic celestial engraving',
      layers: [full(statePath('placement'))] }
    : { key: 'generic:invented', family: 'invented', resolution: 'generic', label: 'The cosmic department of invented nonsense',
      layers: [full(statePath('invented'))] };
}

function kindArtwork(event: SkyEvent): ReceiptArtwork {
  switch (event.kind) {
    case 'planet-sign':
    case 'moon-sign':
      return { key: `kind:${event.kind}`, family: 'placement', resolution: 'kind', label: 'Symbolic sign placement',
        layers: [full(statePath('placement'))] };
    case 'retrograde':
      return { key: 'kind:retrograde', family: 'retrograde', resolution: 'kind', label: 'Symbolic retrograde motion',
        layers: [full(statePath('retrograde'))] };
    case 'conjunction':
      return { key: 'kind:conjunction', family: 'conjunction', resolution: 'kind', label: 'Symbolic alignment of two distant bodies',
        layers: [full(statePath('conjunction'))] };
    case 'moon-phase':
      return { key: 'kind:moon-phase', family: 'moon-phase', resolution: 'kind', label: 'Symbolic Moon engraving',
        layers: [full(bodyPath('Moon'))] };
    default:
      return genericReceiptArtwork('real');
  }
}

/**
 * Event-specific override → named scene → reusable composition → event kind → generic.
 * Selection follows the chosen event, never a date switch or a newly rolled reading.
 * Older Fortune objects without event metadata deliberately receive generic real-sky art.
 */
export function resolveReceiptArtwork(fortune: Fortune,
  exactEvents: ReadonlyMap<string, ReceiptArtwork> = new Map()): ReceiptArtwork {
  if (fortune.kind !== 'real') return genericReceiptArtwork('invented');
  const event = fortune.event;
  if (!event) return genericReceiptArtwork('real');
  const exact = exactEvents.get(event.id);
  if (exact) return { ...exact, resolution: 'exact' };

  if (event.kind === 'conjunction') {
    const key = canonicalPair(event.bodies ?? []);
    const scene = key && sceneFiles.get(key);
    if (scene) return { key: `scene:${key}`, family: 'conjunction', resolution: 'exact',
      label: `Symbolic ${event.bodies!.join(' and ')} alignment; the bodies remain separate`,
      layers: [full(`/art/scenes/${scene}.png`)] };
    if (key) {
      const bodies = key.split('-');
      return { key: `pair:${key}`, family: 'conjunction', resolution: 'composed',
        label: `Symbolic ${event.bodies!.join(' and ')} alignment; the bodies remain separate`,
        layers: [full(statePath('conjunction')),
          { src: bodyPath(bodies[0]), x: 0.01, y: 0.14, width: 0.46, height: 0.46 },
          { src: bodyPath(bodies[1]), x: 0.53, y: 0.4, width: 0.46, height: 0.46 }] };
    }
  }

  if (event.kind === 'planet-sign' || event.kind === 'moon-sign') {
    const body = event.kind === 'moon-sign' ? 'Moon' : recognized(event.subject, ART_BODIES);
    const sign = recognized(event.kind === 'moon-sign' ? event.subject : event.sign, ART_SIGNS);
    if (body && sign) return { key: `placement:${slug(body)}-${slug(sign)}`, family: 'placement', resolution: 'composed',
      label: `Symbolic ${body} and ${sign} engraving`,
      layers: [
        { src: signPath(sign), x: 0, y: 0, width: 1, height: 1, opacity: 0.15 },
        { src: bodyPath(body), x: 0.25, y: 0.25, width: 0.5, height: 0.5 },
      ] };
  }

  if (event.kind === 'retrograde') {
    const body = recognized(event.subject, ART_BODIES);
    if (body) return { key: `retrograde:${slug(body)}`, family: 'retrograde', resolution: 'composed',
      label: `Symbolic ${body} retrograde engraving`, layers: [full(statePath('retrograde')),
        { src: bodyPath(body), x: 0.18, y: 0.14, width: 0.64, height: 0.64 }] };
  }

  if (event.kind === 'moon-phase') {
    const phase = phases.get(event.subject.trim().toLowerCase());
    if (phase) return { key: `phase:${phase}`, family: 'moon-phase', resolution: 'composed',
      label: `Symbolic ${event.subject} engraving`, layers: [full(statePath(phase))] };
  }
  return kindArtwork(event);
}

/** Source inventory, used by the handoff and build checks to detect missing shipping assets. */
export const RECEIPT_ART_FILES: readonly string[] = [
  ...ART_BODIES.map(bodyPath), ...ART_SIGNS.map(signPath),
  ...['new-moon', 'first-quarter', 'full-moon', 'last-quarter', 'retrograde', 'conjunction', 'placement', 'invented'].map(statePath),
  ...Array.from(sceneFiles.values(), scene => `/art/scenes/${scene}.png`),
];
