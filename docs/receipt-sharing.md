# Receipt download and copy

The live receipt and its downloaded image use the exact selected fortune and the same event-art resolver. Exporting never runs the fortune selector, dispenses again, or chooses a different zen variant. Explanations remain in the page disclosure and are excluded from the image and copied fortune text.

## Selected fortune image

`src/lib/fortune-share.ts` draws a 1080 × 1350 PNG with the local SpecialElite typewriter font, light paper (#f4dfb9), plum text, inset border, lower cloud bank, symbolic event artwork, classification, full title and reading, brand, fixed Bureau seal, chosen smudged stamp, issue date, signoff and domain. Text is rendered directly on the canvas. The approved authority is `assets/receipt-concepts/share-120-proof-v3.png`, together with the later instruction to lower the website slightly. Buenard remains the page and separate homepage-preview font.

Brand starts at y105, classification at y190, and title/reading at y260 within an 820px-wide text column. Title and reading wrap without dropping words or splitting joined emoji. The fixed export template starts at 44px title / 36px reading and reduces those sizes if needed for its 330px copy budget, stopping at 24px reading. Live HTML instead grows at its established 18–19px reading sizes. No content is clamped, ellipsized or removed.

The lower art square is 475px centered at (540,825), sharing the resolver's fractional layer bounds and opacity. A full-size sign is faded to 0.15 behind a centered half-size body. The copied approved panorama fades into the lower region and clips inside x44–1036, y600–1306. The Bureau seal is left, the frozen smudged stamp right, with issue date and quiet two-line signoff. The domain starts at y1317, below the inner border/cloud clip at y1306.

`setFortune(fortune, artwork, presentation)` clones the selected reading, art and presentation, then starts rendering. Presentation contains the permanent ISO issue instant and chosen stamp; the printed date uses America/New_York. A new issue avoids immediately repeating its stamp. Downloads reuse the revision-cached PNG, including across midnight, so downloading never selects another reading or changes its date/stamp. `setBusy(true)` disables controls while issuing a replacement.

The image explicitly waits for `public/fonts/SpecialElite-Regular.ttf`, loaded as CosmicCardTypewriter. Its Apache-2.0 license is retained in `public/fonts/SpecialElite-LICENSE.txt`. A failed font load allows a later retry. Failed art switches to generic art for the real/invented family; if that fails too, text exports with a simple decorative brand star. Paper color remains usable if decorations fail. Facts and expanded explanation remain outside the image.

## Receipt export controls and opening state

Download and Copy occupy the receipt’s upper-right, anchored within the narrow top edge of the flared paper at right 24% and top 6px, in a named “Save your fortune” group. Two 44px square buttons contain authored 22px native SVGs, accessible names and above-control hover/focus tooltips. About remains alone at the page upper-right at every width. Both start disabled with “Get a fortune first” tooltips, enable after an actual issue and disable during issuing or an export operation. There is no Share button, platform panel, social-network action or native-sharing path.

A polite status region follows the receipt in document flow, centered at a maximum width of 360px with 20px side padding and 15px Buenard at line height 1.4; it disappears when empty. Download prepares the cached PNG as `cosmic-bullshit-fortune.png` and announces that it is ready to save. Copy retains the chosen title when applicable, full reading, real/invented label, brand and homepage URL; success explicitly identifies the link as the homepage. Failures offer retry or the other action. Clipboard availability depends on browser permissions.

The opening paper reads “Bad Day?” followed by one of six questions from `src/lib/intro-questions.ts`. Initialization chooses once per page load; these prompts never enter the issued-reading catalog. The Moon version asks “Has the Moon put your motivation on airplane mode?” The introductory classification is empty and hidden; “Before we begin” is absent. The opening has generic invented artwork, no issued stamp/date and no exportable selection. A normal request replaces it with the chosen fortune, visible classification, artwork and frozen presentation.

## Homepage preview

`public/social-preview.png` is a separate static 1200 × 630 composition. It uses the approved cabinet and paper texture with sharp Buenard branding and the premise. It never contains a browser's last selected fortune. Its source hashes and layout recipe are in `public/social-preview.png.json`.

Recreate it with a local Astro dev server running and the bundled Playwright runtime available:

```text
node scripts/prepare_social_preview.mjs http://127.0.0.1:4321
```

The script uses the Codex bundled Playwright path by default; `PLAYWRIGHT_MODULE_PATH` can specify its `index.mjs` on another machine. The source plate generation records remain beside the original files under `assets/plates/`.

The homepage supplies absolute Open Graph image and canonical URL metadata, explicit 1200 × 630 dimensions, image alternative text, and Twitter `summary_large_image` metadata. Stable per-fortune URLs and server-rendered personalized previews remain separate future routing work.

## Current verification

The [receipt corner finish review](../.impeccable/review/receipt-corner-finish-review.md) returned **ship for the requested receipt-corner and opening-copy correction**, with no material fixes. It independently inspected all twelve `receipt-corner-{intro,issued}-{320,375,700,768,1100,1440}.png` captures. The parent reports six-width browser checks including actual download/copy, frozen presentation across midnight and clipboard-error recovery, 48 passing tests, zero check diagnostics and a successful build. The detector has advisories only. Captures cannot establish manual assistive-technology, native save UI, animation timing or actual device rendering; the unchanged exported PNG was outside this visual correction. The historical whole-page comparison and plate-fidelity gate remains open. The user authorized pushing the corrected work; this records the authorization, not a completed push or deployment.

## Historical page-header tools verification

The [page tools finish review](../.impeccable/review/page-tools-finish-review.md) returned **ship for the scoped local preview checkpoint**, with no material fixes. It independently inspected all twelve intro/issued captures at 320, 375, 700, 768, 1100 and 1440px plus `page-tools-download.png`. The parent reports six-width bounds/collision checks, all six question selections, initial disabled controls, normal issue/copy/download, byte-identical PNG downloads across midnight with frozen stamp/date, clipboard-error recovery and no browser errors. Parent validation reports 48 tests passing, zero Astro errors/warnings and a successful build, plus a production-preview issue smoke check. The detector has six advisories only. Captures use reduced motion and deterministic content; manual assistive-technology, operating-system dialog and zoom sessions were not performed. The historical whole-page comparison and plate-fidelity gate remains open; this is not authorization to push or publish.

## Historical verification of superseded sharing UI

The earlier independent [live finish review](../.impeccable/review/receipt-live-finish-review.md) inspected `receipt-live-download.png` and `receipt-live-card-{real,zen-two,maximum,invented}.png` alongside the approved v3 proofs and responsive live captures. It returned **ship for the scoped local preview checkpoint**, with no material fixes. Earlier `receipt-card-*` captures remain historical evidence of the superseded template.

Parent browser checks passed actual PNG download and copy, frozen selection/date/stamp, byte-identical repeated PNG download across midnight, nonrepeating next stamp, native cancellation/error/retry, missing-art fallback and no JavaScript errors. Native share dialogs used deterministic simulations; actual device operating-system sheets remain unverified. The historical whole-page gate remains open; this evidence does not authorize publication.

The earlier, now superseded [share toolbar finish review](../.impeccable/review/share-toolbar-finish-review.md) returned **ship for the scoped local preview checkpoint**, with no material fixes. It independently inspected all eleven current captures: `share-toolbar-{rest,open}-{320,375,768,1440}.png`, the 320/375px long-title and 120-character-reading stress captures `receipt-live-max-{320,375}.png`, and `share-toolbar-download.png`. The parent opened all eleven valid images.

`.impeccable/build/share-toolbar-check.mjs` passed toolbar target/bounds checks, Enter/Escape and focus return, click-away, clipboard, actual direct/Instagram downloads with identical bytes, Facebook/X URL construction and new-tab protections, native cancellation/error/retry simulations, frozen selection/stamp/date and absence of JavaScript errors. External URLs, clipboard and native share were intercepted; no external post was sent. Actual platform composer UI, posting, device OS sheets and assistive-technology announcements remain unverified. `receipt-live-check.json` passed all four widths and 720 CSS-pixel equivalent reflow, preserving full text. The parent reports 49 passing unit tests, Astro check with zero errors and a successful build. `share-toolbar-detector.json` records eight advisories and zero primary findings. This remains a local preview checkpoint; the historical whole-page gate is open.
