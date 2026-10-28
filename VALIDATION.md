# MVP prototype validation

Checked locally on 24 October 2026.

- Astro/TypeScript check: zero errors or warnings.
- Static production build: passed.
- Six TypeScript and three Python data tests: passed.
- Browser checks: actual reading/dispensing playback, complete fortune flow,
  local font loading, reduced motion, missing-data fallback, and idle
  timing/pause/resume passed.
- 384 real/invented selections at widths 320, 390, 700, 1280, 1440 and
  1600 pixels: no tested text safe-area or horizontal-overflow failures.
- The eight prepared silent reaction clips total less than 1 MB.

The independent visual review's receipt-copy and loading-strip defects were
fixed and the reviewer confirmed those fixes, with no material regressions
visible in the recaptures.

## Planet-sign expansion — 27 October 2026

- Regenerated all 36 monthly calendars for January 2026–December 2028.
- Eight Python tests passed, covering all calendars' nine-body coverage,
  non-overlapping intervals, calculated positions, true ingress dates,
  retrograde returns, and Pluto's November 2024 entry into Aquarius.
- All original events and source metadata match the previous calendar across
  all 36 files after excluding the added planet-sign events.
- Sixteen TypeScript tests passed using Node 24's native test runner. The
  installed tsx runner could not read the Windows account in the restricted
  environment; the same test file passed directly with Node.
- Seeded 10,000-reading samples passed checks for the 50/50 real/invented
  split, equal shares per active kind, equal shares per event with unequal
  joke counts, and exclusion of the previous fortune ID.
- Every catalog line is at most 80 characters; prior joke indices and titles
  remain stable. Added all 38 supplied lines and 32 additional lines.
- Astro/TypeScript check: zero errors, warnings, or hints. Production build
  passed using Node 24.
- Browser smoke check on the production build issued “Venus in Libra” with
  body-specific copy and displayed its October 25 UTC ingress date, validity
  window, and Moshier source in the existing fact disclosure.

Published date cross-checks use Astrodienst's
[January](https://www.astro.com/news/nl_news2601_e.htm),
[February](https://www.astro.com/news/nl_news2602_e.htm),
[April](https://www.astro.com/news/nl_news2604_e.htm), and
[June](https://www.astro.com/news/nl_news2606_e.htm) 2026 calendars: Neptune
enters Aries on January 26; Saturn enters Aries on February 14 UTC; Uranus
enters Gemini on April 26; Jupiter enters Leo on June 30. Generated dates
agree. Fact dates use UTC rather than the visitor's local calendar date.

This expansion validates reading logic and data; the prior visual-review
record below remains separate.

## Daily reading desk — 28 October 2026

- A factual planner generated 16 assignments for the New York calendar day:
  nine planet placements, five retrogrades, one Moon sign, and one actual
  Uranus–Moon conjunction within the declared three-degree longitude window.
- Three focused writers produced two tech, two woo, and two zen lines for
  each assignment. The edited first batch contains 96 unique lines, each at
  most 80 Unicode characters, published in `public/readings/2026-10-28.json`.
- The publication validator recomputed every sky fact and interval, checked
  all event/tone groups, canonical IDs, copy length, and normalized duplicates.
  Its 30-day history check is covered by a regression test.
- Twenty-two Python tests passed, including actual conjunction positions,
  longitude wraparound, New York DST day lengths, month-boundary coverage,
  incomplete or altered drafts, atomic publication, and factual cache isolation.
- Thirty-two TypeScript tests passed, including the shipped catalog, exact
  event eligibility, daily fallback behavior, five-kind selection balance,
  independent UTC-month/New York-day caches, and late-response midnight races.
- Astro/TypeScript check: zero errors, warnings, or hints. Production build
  passed with Node 24. TypeScript tests used Node's native runner as noted in
  the earlier validation record.
- A browser check on the production build issued a new daily tech reading
  for Mercury in Scorpio, displayed its existing factual source and validity,
  and fit the copy inside the slip.
- Independent code review found a mutable cache alias in the Python planner;
  cached source/event records are now copied before exposure. A direct-mutation
  regression proves changed planning facts cannot poison the validation source.

The daily writer runs in a scheduled local chat, outside the website. The
browser serves static catalogs and retains the monthly/invented fallback if a
daily run is missed. GitHub validation checks reading uploads using the same
site and calculation tests. Local scheduling requires an awake computer and
the Codex app running; a push still depends on the hosting deployment to reach
visitors. Publication and editorial instructions are in
[the daily desk workflow](docs/daily-readings.md).

## Open visual-validation record

Independent review disposition remains **fix**, not a whole-surface ship
verdict. The user approved the taller animation-compatible production
cabinet after seeing its difference from the early homepage mockup. The
legacy automated comparison still targets that earlier cabinet geometry.
Its plate phase remains open, and first-viewport comparison scores 59%.
No failed measurement or phase was silently marked as passed.

This source is a functioning prototype for feedback. The remaining visual
record needs reconciliation with the approved production composition.

## Before public launch

Connect the GitHub repository to Cloudflare using the settings in README.md,
review its deployment, and make the corresponding AGPL source accessible.
The repository was private when this prototype was prepared. No Cloudflare
deployment, custom-domain change, or repository visibility change was made
by this build.
