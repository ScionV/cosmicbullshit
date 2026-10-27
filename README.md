# Cosmic Bullshit

A tongue-in-cheek fortune machine for finding something cosmic to blame.

## Development

Use Node 24 (see `.node-version`) and `npm ci`, then `npm run dev`.
`npm test` checks event eligibility, fallback behavior, unique fortune IDs,
and the under-80-character copy limit. `npm run check`
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
calculates apparent retrograde intervals, Moon-sign intervals and windows
within 9 degrees of new/quarter/full phase angles. These are astronomical
positions and conventions, not evidence that planets cause personal problems.
No external Swiss/JPL ephemeris files are bundled. See [Swiss Ephemeris](https://www.astro.com/swisseph/)
and [pyswisseph](https://github.com/astrorigin/pyswisseph).

The checked-in calendar covers 2026–2028. A monthly GitHub workflow refreshes
a rolling three-calendar-year range. If data is missing, invalid, unavailable,
or outside its validity range, the site must use labeled invented excuses.
GitHub can disable scheduled workflows on inactive public repositories;
the workflow can also be run manually. Never present stale sky as current.

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
`.impeccable/animations/{v1,v2,v3}`, run `python scripts/prepare_media.py`.
Alternatively pass `--source-dir PATH` and `--ffmpeg PATH`. Source hashes,
crop, and encoding settings are recorded next to the resting WebP; generation
prompts and job IDs are in `assets/animation-provenance.json`.
Use a new media version path when replacing a set, so cached pages cannot mix
an old resting image with new videos. Pre-v2 files remain available for older
cached clients.
