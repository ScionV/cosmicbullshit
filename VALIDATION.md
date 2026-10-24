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
