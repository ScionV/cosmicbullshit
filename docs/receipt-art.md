# Receipt artwork

The receipt uses symbolic plum engravings. They illustrate the selected event and never stand in for the calculated fact. In a conjunction, the two bodies remain separate: the artwork does not depict physical contact. The daily catalog schema, publishing schedule and selection logic do not carry image fields.

`resolveReceiptArtwork` in `src/lib/receipt-art.ts` receives the selected `Fortune.event`. It resolves an exact event override when supplied, then a named conjunction scene, then a reusable body/sign, body/pair, phase or retrograde composition, then the event kind, then generic real or invented art. The event override is keyed by its existing ID; there are no hardcoded date switches. Pair keys are alphabetic and case-insensitive, so reversing the pair does not change the art. Older Fortune objects without event metadata deliberately receive generic real-sky art.

Every layer is positioned in a square using fractional `x`, `y`, `width` and `height` values. The live receipt and 1080 × 1350 fortune export use those same bounds. Preserve each source's aspect ratio with `contain`. Body/sign placements use a full-size sign at opacity 0.15 behind a centered body at x/y 0.25 and width/height 0.5; both live and export renderers honor the same opacity. Keep all marks inside the source's square and leave its transparent outer margin; do not crop a face, horn, ring or arrow when preparing variants. A missing composition falls back to the generic for the fortune kind; if that image also fails, omit decorative art and preserve the reading.

All live receipt art is decorative (`alt=""` and an `aria-hidden` container) because the adjacent title and real/invented label carry the meaning. `ReceiptArtwork.label` describes the art for development and documentation; it is not an astronomical assertion. Exported PNGs retain the full selected title and fortune as drawn text, without the expanded explanation.

## Source inventory

All filenames below are under `public/art/`. Their corresponding URL starts `/art/`. `RECEIPT_ART_FILES` is the complete 34-file symbolic event-art registry; paper, seals and panorama are separate production decorations.

| Keys and filenames | Intended family | Fallback |
| --- | --- | --- |
| `bodies/sun.png`, `moon.png`, `mercury.png`, `venus.png`, `mars.png`, `jupiter.png`, `saturn.png`, `uranus.png`, `neptune.png`, `pluto.png` | Any recognized body in a placement, retrograde or conjunction | Event kind, then generic real |
| `signs/aries.png`, `taurus.png`, `gemini.png`, `cancer.png`, `leo.png`, `virgo.png`, `libra.png`, `scorpio.png`, `sagittarius.png`, `capricorn.png`, `aquarius.png`, `pisces.png` | Body/sign and Moon/sign placements | `states/placement.png` |
| `states/new-moon.png`, `first-quarter.png`, `full-moon.png`, `last-quarter.png` | Four lunar phases | `bodies/moon.png`, then generic real |
| `states/retrograde.png` | Retrograde surround, composed with the body | Retrograde surround alone, then generic real |
| `states/conjunction.png` | Alignment surround with two separate bodies | Alignment surround alone, then generic real |
| `states/placement.png` | Placement kind and generic real-sky art | Omit art if unavailable |
| `states/invented.png` | Generic invented-nonsense art | Omit art if unavailable |
| `scenes/sun-mercury.png`, `mars-jupiter.png`, `mercury-pluto.png`, `sun-pluto.png` | Named conjunction scenes, independent of date and pair order | Generic real-sky art if an image fails |

## Event coverage

All ten bodies can pair with any of the twelve signs; Moon/sign events use their historical `subject` sign without requiring a new catalog field. This covers all current placements and the upcoming changes in the handoff, including Moon in Cancer, Sun in Sagittarius/Capricorn/Aquarius, Mars in Virgo, Venus in Scorpio/Sagittarius, Mercury in Sagittarius/Capricorn/Aquarius and the persistent outer-planet placements.

Moon can pair with each of the other nine bodies. All recognized pairs compose, while Sun–Mercury, Mars–Jupiter, Mercury–Pluto and Sun–Pluto use the named scenes. The Sun–Mercury scene is reused across both calculated windows. Mercury, Venus, Saturn, Neptune, Uranus, Jupiter and Mars all compose with the retrograde surround. New, first-quarter, full and last-quarter Moon have their own source image. Unknown bodies, signs, phases and malformed pairs resolve deliberately to the event-kind fallback; unrecognized event kinds resolve to generic real art.

The registry is tested for complete inventory coverage, reversed pairs, invalid inputs, legacy fortunes and safe layer bounds. Asset-file tests assert every registry path exists as a 480 × 480 RGBA PNG.

## Preparation and verification record

The five generated source images and their exact prompts are preserved in `assets/receipt-art/`. `generations.json` identifies each original generation by its filename without a machine-specific path. `crops.json` records each source atlas crop, its 24px transparent inset at the prepared 480px size, and its decorative role. The superseded blank receipt stock is separate from the 34 illustration files and is no longer used by the live receipt.

On 29 October 2026, all 34 illustrations decoded in a browser contact sheet and were inspected together on the project's ochre ground. Bodies, sign emblems, state artwork and conjunction scenes retain their complete major silhouettes; no material crop clipping was observed. Reading each PNG's alpha channel confirmed genuine transparency (alpha range 0–255) and at least a 24px outer inset. All lunar phases have distinct illumination, and both bodies remain visibly separate in the four conjunction scenes. The contact-sheet evidence is `.impeccable/review/receipt-art-contact.png`.

Eight resolver tests passed. They include every one of the 120 recognized body/sign combinations, all twelve Moon/signs, nine Moon conjunction pairs, four named conjunction scenes in both orders, four phases, seven requested retrogrades, exact overrides, invalid input and legacy fortunes. The complete committed data inventory also passed: 36 monthly calendars containing 1,250 event records and the historical daily catalog containing 16 event records and 96 reading records all resolve only existing registered assets. Daily reading IDs and text do not affect the artwork for their shared event, so both zen variants retain their actual selection while using the same event illustration. No resolver branch uses the current date or a manually maintained date window.

## Approved live paper and printed decorations

The current live paper is `public/art/dispensed-paper.png`, preserving the user-edited `assets/plates/fortune-paper-edited.png` artwork pixel-for-pixel; that source remains untouched. It preserves the supplied flared silhouette, stars, clouds and torn edge. The canvas renderer splits at source y=500 and extends only blank upper stock; lower printing scales uniformly. Earlier stock and original plate files remain source history.

Seven decorative PNGs under `public/art/stamps/` comprise the fixed `bureau.png` seal and six smudged impressions: `responsibility-declined`, `cosmically-approved`, `referred-to-saturn`, `filed-under-nonsense`, `pending-universal-review`, and `no-further-questions`. Exact generation prompts and identities are retained in `assets/receipt-concepts/stamp-generations-v2.json`, and `stamp-crops.json` records atlas crop bounds, proportional scale/transparent padding and the fixed Bureau source; these source records preserve provenance for the prepared shipping decorations. Stamp choice is presentation state, captured on issue with the date and selected fortune, and excludes the immediately preceding stamp.

`public/art/share-panorama.png` copies the existing approved `assets/plates/sky-panorama.png`, retaining its source provenance. It supplies the lower export cloud bank. The approved `assets/receipt-concepts/receipt-120-proof-v3.png` and `share-120-proof-v3.png` remain historical visual authorities; the subsequent website-lowering instruction governs the current export footer.

The scoped provenance scan covered all 44 shipping `public/art` PNGs (34 event illustrations, flared paper, seven stamps/seals, copied panorama and historical stock) with zero missing records. This extends the original illustration verification above; it does not replace the retained source manifests or close the historical whole-page gate. Current visual evidence and scoped local-preview disposition are in [the live finish review](../.impeccable/review/receipt-live-finish-review.md).

## Archived share-panel platform marks

The Share panel and its three derived `public/art/social/{facebook,instagram,x}.png` files were removed at the user's request. Current Download and Copy controls use authored 22px native SVGs in `src/components/ReceiptIcon.astro`; no social marks ship in the page. The symbolic event-art registry and drawn fortune export are unchanged.

`assets/receipt-art/social-icons.png` remains the archival generated atlas. `social-icons.json` preserves its exact prompt, generation identity and historical preparation recipe: three 724px square cells, left-to-right Facebook, Instagram and X, scaled proportionally to 240px square PNGs. The source's embedded prompt provenance is retained. The prior three-file provenance check and [share toolbar finish review](../.impeccable/review/share-toolbar-finish-review.md) describe the superseded implementation, not current shipping assets. The historical whole-page gate remains open.
