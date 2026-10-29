# Cosmic Bullshit

A tongue-in-cheek fortune machine for finding something cosmic to blame.

## Development

Use Node 24 (see `.node-version`) and `npm ci`, then `npm run dev`.
`npm test` checks event eligibility, fallback behavior, unique fortune IDs,
balanced selection, the historical authored pool's 80-character limit, daily
readings up to 120 Unicode characters, event artwork, and sharing text. `npm run check`
checks Astro/TypeScript, and `npm run build` produces the static site in `dist/`.

## Real sky data

The browser reads precomputed monthly JSON from `public/sky`. Each event has
an inclusive UTC start and exclusive end, a factual description, calculation
metadata, and a source. Comic interpretations remain separate. No API key,
birth details, visitor location or Python runtime is needed to use the site.

To regenerate, use Python 3.12 in a virtual environment:

```sh
python -m venv .venv
# Activate the environment for your shell, then:
pip install -r requirements.txt
python scripts/generate_sky.py
python -m unittest discover -s tests -p 'test_*.py'
```

The generator uses pyswisseph 2.10.3.2 with `FLG_MOSEPH | FLG_SPEED`:
the built-in Moshier ephemeris, geocentric tropical ecliptic positions. It
calculates apparent retrograde intervals, Moon-sign intervals, planet-sign
placements for the Sun through Pluto (excluding the separately tracked Moon),
and windows within 9 degrees of new/quarter/full phase angles. Planet placement
facts include the latest actual sign-entry date in UTC, even when the calculated
window starts at a month boundary or the body has returned during retrograde.
These are astronomical positions and conventions, not evidence that planets
cause personal problems.
No external Swiss/JPL ephemeris files are bundled. See [Swiss Ephemeris](https://www.astro.com/swisseph/)
and [pyswisseph](https://github.com/astrorigin/pyswisseph).

The checked-in calendar covers 2026–2028. A monthly GitHub workflow refreshes
a rolling three-calendar-year range. If data is missing, invalid, unavailable,
or outside its validity range, the site must use labeled invented excuses.
GitHub can disable scheduled workflows on inactive public repositories;
the workflow can also be run manually. Never present stale sky as current.

Readings use a 90/10 split between real sky and invented nonsense when real
events are available. Within real readings, each active event kind has an equal
chance, followed by an equal choice of event and then joke. Nine simultaneous
planet placements therefore cannot crowd out retrogrades or lunar events.
The previous fortune ID is excluded before selection.

Planet-sign data retains schema version 1. Deploy the updated client together
with the regenerated calendar: older clients reject the unfamiliar event kind
and safely use invented readings. The updated client also accepts older month
files without planet placements.

## Daily generated readings

The daily reading desk combines a factual sky planner with six focused
writers: tech snark, woo-woo snark, dry zen, office theatre, dating rituals,
and domestic life. Each event gets one line in every category plus a second,
balance-oriented zen line, for seven readings per event. Daily jokes may use up
to 120 Unicode characters. Existing three-category catalogs with two lines per voice
remain supported. Daily catalogs include actual conjunction windows within three
degrees of tropical longitude, alongside the existing placements, retrogrades,
and lunar events. The model writes jokes; Moshier calculates the facts.
A separate astrology explainer supplies a short, clearly labeled traditional
interpretation in “What’s actually happening?” Explanations are stored once per
event alongside the jokes, keeping the calculated fact separate from symbolism.

The browser reads `public/readings/YYYY-MM-DD.json` for the New York calendar
day. Complete valid catalogs supply the real-reading copy; absent, expired,
or malformed catalogs fall back to the existing monthly reading pool. No
visitor makes a live AI request. The 90/10 real/invented split applies to both
daily readings and the monthly fallback. With no valid sky data, all readings
are clearly labeled invented nonsense.

See [the daily desk workflow](docs/daily-readings.md) for planner assignments,
generation and validation commands, editorial rules, and the authorized daily
publication procedure. A scheduled local chat runs the writing team through
the owner's plan and pushes checked daily catalogs directly to GitHub. The
computer must be on and Codex running for the scheduled local work to execute.

## Receipt and sharing

The live receipt grows for the complete reading with event-specific plum
engraving. Share fortune and Download image retain the exact chosen reading in
a PNG; Copy text retains that selection with a homepage link. The separate
homepage preview carries the brand and cabinet. The receipt and selected-fortune
PNG use locally hosted SpecialElite under Apache-2.0; its license is retained
in [SpecialElite-LICENSE.txt](public/fonts/SpecialElite-LICENSE.txt). Other page
text and the homepage preview retain Buenard.

See [receipt layout](docs/receipt-layout.md), [artwork and provenance](docs/receipt-art.md),
and [sharing behavior](docs/receipt-sharing.md) for the implementation contract
and local review evidence.

## Cloudflare

Connect `ScionV/cosmicbullshit` using Cloudflare Pages Git integration.
Build command: `npm run build`. Output directory: `dist`. Production branch:
`main`. Set `NODE_VERSION` to the value in `.node-version` if the build image
does not pick it up. Python is only needed for calendar maintenance in GitHub
Actions, not the Cloudflare build. Add `cosmicbullshit.com` through the
Cloudflare custom-domain setup after reviewing a preview deployment.

## License

AGPL-3.0-only; see `LICENSE` and `NOTICE`. The owner explicitly chose AGPL
and open-source publication to use pyswisseph. Corresponding source is public
at https://github.com/ScionV/cosmicbullshit. Keep the direct source link in the
homepage footer; `/license/` contains the full license, notices, and source download.

## Character media

The current assets live in `public/media/v2`. Their crop is 396×376 pixels,
taken directly from the approved 828×1108 generated clips without upscaling.
H.264 CRF 17 preserves more detail than the original website's CRF 24 exports.
The resting WebP is the first decoded frame of the delivered idle video,
encoded losslessly in RGB so framing and color match during the transition.
All clips use the same crop. Keep the same start/end reference for future
generations; higher-resolution source references are needed to improve the
softness already present in the generated originals.

With ffmpeg available and the original clips retained in
`.impeccable/animations/{v1,v2,v3,v4,v5,v6}`, run `python scripts/prepare_media.py`.
Alternatively pass `--source-dir PATH` and `--ffmpeg PATH`. Source hashes,
crop, and encoding settings are recorded next to the resting WebP; generation
prompts and job IDs are in `assets/animation-provenance.json`.
Use a new media version path when replacing a set, so cached pages cannot mix
an old resting image with new videos. Pre-v2 files remain available for older
cached clients.

The live rotation contains 10 idles, 5 readings, and 3 dispensing clips. Both
fist-stretch attempts are idles. Each pool avoids immediately repeating its
last clip; the clerk still rests for 15–30 seconds between idle gestures.
New variants use new filenames, retaining the existing poster and exports.
