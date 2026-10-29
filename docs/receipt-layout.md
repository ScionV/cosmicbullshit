# Receipt layout

The live receipt grows for the complete selected title and reading. Daily jokes support up to 120 Unicode characters; the historical authored fallback pool retains its 80-character limit. Live text never shrinks, clips into a fixed region, or gains an ellipsis. The separate fixed-size PNG export has its own wrapping template, described in [receipt sharing](receipt-sharing.md).

`src/styles/receipt.css` governs the paper. `src/pages/index.astro` keeps the cabinet and its character/action overlays in a 3:4 stage inside a content-height machine wrapper. Download and Copy sit at the receipt’s upper-right; export status follows the full paper in document flow. The factual disclosure and footer follow the entire paper in document flow. Existing clerk clips, still fallback, motion preferences, button feedback and the single 650ms paper-feed reveal remain in use.

## Paper and type

The user approved `assets/receipt-concepts/receipt-120-proof-v3.png`. The supplied, user-edited `assets/plates/fortune-paper-edited.png` remains untouched. Its production copy `public/art/dispensed-paper.png` has identical decoded RGBA pixels. `src/scripts/receipt-paper.ts` splits that source at y=500: the blank upper stock stretches for copy height, while the lower clouds, stars, torn edge and silhouette scale uniformly with paper width. A ResizeObserver redraws the canvas, with device-pixel ratio capped at 2. The paper fallback is #f4dfb9. Superseded `receipt-stock.png` and `assets/plates/fortune-paper.png` remain historical references.

Receipt text alone uses SpecialElite, locally served from `public/fonts/SpecialElite-Regular.ttf`, regular weight 400, with Courier New/monospace fallbacks and font-display swap. The Apache-2.0 license is `public/fonts/SpecialElite-LICENSE.txt`. The surrounding page, sharing controls and factual disclosure retain Buenard.

| Viewport | Paper / machine width | Word column / paper width | Title | Reading | Date/signoff |
| --- | --- | --- | --- | --- | --- |
| Above 1100px | 72% | 54% | 24px | 19px | 9px |
| 701–1100px | 86% | 54% | 23px | 19px | 9px |
| 320–700px | 80% | 56% | 21px | 18px | 8px |

Titles use line height 1.2 and balanced wrapping; readings use 1.4 with ordinary prose wrapping. Both use overflow-wrap anywhere. The classification is 10px, regular weight, line height 1.4, with no tracking. Copy has 64px top padding at every width, the word column 9% bottom padding and a 190px minimum height (180px mobile); additional height comes from full text. Reading margin is 18px above 700px and 16px mobile. The paper aligns to the existing slot with a negative top margin of 39.86% of machine width, or 38.53% mobile. Its material shadow remains `drop-shadow(0 7px 5px #54311c30)`.

## Opening paper

The opening paper reads “Bad Day?” followed by one of six questions from `src/lib/intro-questions.ts`. Initialization chooses once per page load; these prompts never enter the issued-reading catalog. The Moon version asks “Has the Moon put your motivation on airplane mode?” The introductory classification is empty and hidden; “Before we begin” is absent. The opening has generic invented artwork, no issued stamp/date and no exportable selection. A normal request replaces it with the chosen fortune, visible classification, artwork and frozen presentation.

## Lower scene and issue state

The printed scene retains aspect ratio 1482/562. Event art occupies a square 36% of paper width, at left 32% and top -2%. In body/sign compositions the full-size sign has opacity 0.15 and the centered body occupies half the art square. Layers retain source aspect ratios. A fixed Bureau seal sits left (17.6%, top 32%, width 12%); the smudged stamp sits right (68.2%, top 54%, width 17.6%). The date and two-line “Filed by the cosmos. Responsibility declined.” signoff sit near the lower edge with thin paper-colored strokes for legibility over engraving.

`receipt-presentation.ts` creates an ISO issue instant and chooses one of six stamps, excluding the immediately preceding stamp. `fortune-machine.ts` captures this presentation with the actual selected fortune and artwork; it formats the visible issued date in America/New_York and passes the same state to sharing. Rendering or downloading later, including across midnight, does not change the issued date, stamp or chosen reading.

## Surrounding flow

At 701–1100px the masthead joins document flow and the cabinet follows by 6px. Mobile keeps the flowing masthead and 125%-wide centered cabinet with a 620px cap. Download and Copy occupy the receipt’s upper-right, anchored within the narrow top edge of the flared paper at right 24% and top 6px, in a named “Save your fortune” group. Two 44px square buttons contain authored 22px native SVGs, accessible names and above-control hover/focus tooltips. About remains alone at the page upper-right at every width. Both start disabled with “Get a fortune first” tooltips, enable after an actual issue and disable during issuing or an export operation. There is no Share button, platform panel, social-network action or native-sharing path. The factual disclosure follows at a maximum width of 480px (420px mobile), outside the exported image. The footer follows the disclosure.

## Artwork and provenance

The 34 symbolic engravings remain under `public/art/{bodies,signs,states,scenes}/`. Their source prompts, identities and crop recipes remain in `assets/receipt-art/`. Current additions are the flared paper, fixed Bureau seal, six smudged stamps and copied share panorama. The earlier 44-file shipping inventory has provenance. The former three derived social PNGs under `public/art/social/` were removed with the Share panel; the generated source atlas and exact prompt remain archival. See [receipt artwork](receipt-art.md) for source identities and fallback behavior.

## Current local preview evidence

The [receipt corner finish review](../.impeccable/review/receipt-corner-finish-review.md) returned **ship for the requested receipt-corner and opening-copy correction**, with no material fixes. It independently inspected all twelve `receipt-corner-{intro,issued}-{320,375,700,768,1100,1440}.png` captures. The parent reports six-width browser checks including actual download/copy, frozen presentation across midnight and clipboard-error recovery, 48 passing tests, zero check diagnostics and a successful build. The detector has advisories only. Captures cannot establish manual assistive-technology, native save UI, animation timing or actual device rendering; the unchanged exported PNG was outside this visual correction. The historical whole-page comparison and plate-fidelity gate remains open. The user authorized pushing the corrected work; this records the authorization, not a completed push or deployment.

## Historical page-header tools evidence

The [page tools finish review](../.impeccable/review/page-tools-finish-review.md) returned **ship for the scoped local preview checkpoint**, with no material fixes. It independently inspected all twelve intro/issued captures at 320, 375, 700, 768, 1100 and 1440px plus `page-tools-download.png`. The parent reports six-width bounds/collision checks, all six question selections, initial disabled controls, normal issue/copy/download, byte-identical PNG downloads across midnight with frozen stamp/date, clipboard-error recovery and no browser errors. Parent validation reports 48 tests passing, zero Astro errors/warnings and a successful build, plus a production-preview issue smoke check. The detector has six advisories only. Captures use reduced motion and deterministic content; manual assistive-technology, operating-system dialog and zoom sessions were not performed. The historical whole-page comparison and plate-fidelity gate remains open; this is not authorization to push or publish.

## Historical local preview evidence

The independent [live integration finish review](../.impeccable/review/receipt-live-finish-review.md) returned **ship for the scoped local preview checkpoint**, with no material implementation fixes. Visual authority is the approved receipt/share v3 proofs, with the later instruction lowering the share website. This does not authorize publication or close the historical whole-page comparison and plate-fidelity gate.

All eleven current captures were inspected: `receipt-live-max-{320,375,768,1440}.png`, `receipt-live-zoom-200.png`, `receipt-live-legacy-375.png`, `receipt-live-download.png` and `receipt-live-card-{real,zen-two,maximum,invented}.png` under `.impeccable/review/`. `receipt-live-check.json` records no horizontal overflow, 18–19px reading sizes and separate copy/art/paper bounds. The 720 CSS-pixel capture checks equivalent reflow for 1440px at 200%; it is not manual operating-system zoom evidence. Stress-fixture partial words and repeated disclosure prose are supplied fixture content.

The earlier integration validation passed with 48 unit tests, Astro check with zero errors, and a successful production build. A production-preview mobile smoke check played the actual reading and dispensing clips through a complete fortune issue with no overflow or browser errors. The scoped detector reported eleven advisories and one warning for the approved SpecialElite font, now documented here. No unrelated token/component drift was re-audited. Sharing checks and native-dialog limits are in [receipt sharing](receipt-sharing.md). Earlier receipt-review evidence remains historical.

The subsequent [share toolbar review](../.impeccable/review/share-toolbar-finish-review.md) returned **ship for the scoped local preview checkpoint**, with no material fixes. It inspected eight rest/open captures at 320, 375, 768 and 1440px, two narrow long-title/120-character stress captures and the unchanged exported PNG. At that earlier checkpoint parent validation reported 49 passing tests, zero Astro errors and a successful build. Toolbar browser checks passed 44px targets, panel bounds, keyboard/click-away behavior and frozen image/text actions; all four receipt widths plus 720 CSS-pixel reflow retain complete text. The detector records eight advisories and zero primary findings. Native OS sharing was simulated; external posting was not tested. The historical whole-page gate remains open.
