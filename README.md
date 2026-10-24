# Cosmic Bullshit

A tongue-in-cheek fortune machine for finding something cosmic to blame.

## Development

Use Node 24 (see `.node-version`) and `npm ci`, then `npm run dev`.
`npm test` checks event eligibility and fallback behavior. `npm run check`
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
and open-source publication to use pyswisseph. The GitHub repository was
private when development started; make the corresponding source publicly
accessible before public launch and keep a source link in the site.
