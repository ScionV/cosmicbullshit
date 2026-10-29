---
name: Cosmic Bullshit
description: Warm printed cosmic absurdity, with a weary clerk and readable living controls.
colors:
  ink: "#40192e"
  paper: "#e8c898"
  action: "#9c321e"
  gold: "#dfb567"
  focus: "#722d47"
  action-text: "#fff2d4"
  action-hover: "#7e2417"
  action-disabled: "#773425"
  action-rim: "#cda855"
  receipt-export-paper: "#f4dfb9"
typography:
  display:
    fontFamily: "Buenard, Georgia, serif"
    fontSize: "clamp(32px, 3.45vw, 53px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Buenard, Georgia, serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Buenard, Georgia, serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.5
  fortune:
    fontFamily: "SpecialElite, Courier New, monospace"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0"
  receipt-reading:
    fontFamily: "SpecialElite, Courier New, monospace"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
  receipt-signoff:
    fontFamily: "SpecialElite, Courier New, monospace"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0"
  label:
    fontFamily: "SpecialElite, Courier New, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
  action:
    fontFamily: "Buenard, Georgia, serif"
    fontSize: "clamp(11px, 1.05vw, 14px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.06em"
rounded:
  pill: "999px"
  focus: "3px"
spacing:
  small: "12px"
  medium: "20px"
  large: "24px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.action-text}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.action-text}"
  button-primary-disabled:
    backgroundColor: "{colors.action-disabled}"
    textColor: "{colors.action-text}"
  motion-toggle:
    textColor: "{colors.ink}"
    padding: "4px 0"
  fortune-copy:
    textColor: "{colors.ink}"
    typography: "{typography.fortune}"
  receipt-reading:
    textColor: "{colors.ink}"
    typography: "{typography.receipt-reading}"
  receipt-paper:
    textColor: "{colors.ink}"
    padding: "0"
    width: "72%"
  export-action:
    textColor: "{colors.ink}"
    padding: "10px"
    width: "44px"
    height: "44px"
---

# Design System: Cosmic Bullshit

## Overview

**Creative North Star: "The Weary Cosmic Clerk"**

Cosmic Bullshit feels like an old printed amusement made operational: warm ochre paper, plum engraving, worn brass, and an exhausted but charming clerk. The illustration carries the ornate personality; the surrounding interface stays readable and spare. The humor is warm, absurd, and plainly entertainment.

This document records the implemented system in `src/pages/index.astro`, `src/pages/license.astro`, `src/styles/home.css`, `src/styles/receipt.css`, and `src/scripts/fortune-machine.ts`. It describes code authority, not a whole-page finish verdict. The user approved the taller production cabinet during asset review; the original decision comp retains shorter geometry. The receipt extension has a scoped local-review verdict; historical whole-page comparison and plate concerns remain open and are not converted into design rules.

**Key Characteristics:**

- Warm printed material and plum ink.
- Locally hosted Buenard for the page and SpecialElite for receipt/export text.
- Illustrated depth with real HTML text and controls.
- Mostly still character performance with deliberate comic pauses.
- Clear separation between factual sky events and invented excuses.

## Colors

The palette behaves like ink, paper, paint, and brass rather than a collection of interchangeable interface accents. The frontmatter is normative; these names explain its roles.

### Primary

- **Vermilion action** (`action`): the main cabinet button. Its darker hover and disabled variants express interaction and waiting.
- **Plum ink** (`ink`): text, links, star marks, and the visual relationship with the engraved celestial artwork.

### Secondary

- **Worn brass** (`gold`): the declared gold accent corresponding to the cabinet's brass material. The current HTML button uses the separately extracted `action-rim`; much of the cabinet's gold is embedded in the illustration.

### Neutral

- **Ochre paper** (`paper`): the continuous page ground beneath a repeating fine paper texture.
- **Cream action lettering** (`action-text`): high-contrast type on the vermilion button.
- **Receipt export paper** (`receipt-export-paper`): the lighter paper ground in the standalone selected-fortune PNG.

### Named Rules

**The Ink and Paper Rule.** Use plum text on the warm paper ground for ordinary content; reserve vermilion for the primary action.

## Typography

**Display Font:** Buenard, with Georgia and serif fallbacks.
**Body Font:** Buenard, with the same fallbacks.
**Receipt Font:** SpecialElite, with Courier New and monospace fallbacks; scoped to the issued paper and selected-fortune PNG.

The local variable font is served from `public/fonts/Buenard.ttf` with a declared normal weight range of 400–700 and `font-display: swap`. Its literary serif character connects live text with printed ornament. Bold weight establishes hierarchy; body copy remains open and readable.

SpecialElite is the user-approved typewriter face, served from `public/fonts/SpecialElite-Regular.ttf` at weight 400 with `font-display: swap`. Its Apache-2.0 license is retained in `public/fonts/SpecialElite-LICENSE.txt`. It does not replace Buenard in navigation, export controls, explanatory prose, or the separate homepage preview.

### Hierarchy

- **Display:** the brand uses the frontmatter's responsive size, bold weight, tight tracking, and short line height. It becomes 36px at tablet width, 32px on mobile, and 26px at 360px and below.
- **Headline:** explanatory section heading; 30px on mobile.
- **Body:** explanatory prose; 18px on mobile. The section width is capped at 720px including side padding.
- **Fortune:** centered, regular SpecialElite title: 24px desktop, 23px tablet (701–1100px), and 21px mobile, line height 1.2.
- **Receipt reading:** regular SpecialElite at 19px above 700px and 18px on mobile, line height 1.4. Full titles and unbroken words wrap; paper grows.
- **Receipt signoff/date:** quiet printed details at 9px above 700px and 8px on mobile, line height 1.3, with a thin paper-colored text stroke over the art.
- **Label:** the receipt's semantic real/invented classification is 10px SpecialElite, weight 400, line height 1.4 and no tracking.
- **Export controls:** 22px native SVGs in 44px square targets. Tooltips use 12px Buenard; receipt-following status uses 15px Buenard at line height 1.4.
- **Action:** uppercase button text. Mobile fixes it at 11px and reduces tracking to 0.03em.

The busy button uses the user-selected `🟍✹☾✹🟍` sequence. A locally hosted 2.7kB symbol-font subset keeps these glyphs consistent across devices, at 0.9em with a fixed 5em width. Reveal one Unicode code point at a time so the outer star is never split; ordinary page labels and content retain Buenard, with SpecialElite confined to the receipt/export.

The live receipt grows with its title, full reading, artwork, and signoff. It has no fixed content-height region, text-fitting loop, clamp, or ellipsis. Daily readings support up to 120 Unicode characters; historical authored fallback copy retains its earlier 80-character limit. The fixed-size downloaded PNG has its own wrapping and fitting template, documented in `docs/receipt-sharing.md`; its export behavior does not reduce live reading type.

## Layout

The current homepage's composition belongs to `.impeccable/surfaces/src-pages-index-astro.md`. Its reusable spatial grammar is one illustrated focal object, quiet peripheral navigation, and centered readable supporting text below.

The cabinet retains a 3:4 stage inside a content-height machine wrapper, normally `min(700px, 64vw)`, and 740px at 1600px and above. At 701–1100px the cabinet becomes 68vw and the masthead joins document flow, with a 6px gap before the machine. At 700px and below the masthead also stays in flow; the cabinet is centered at 125% viewport width with a 620px cap. The mobile crop favors face, action, and result while the sky artwork moves toward the edges.

The paper result aligns with the cabinet slot through a negative top margin, then occupies normal document flow. Its width is 72% of the machine on desktop, 86% at tablet width, and 80% on mobile. The centered words occupy 54% of the paper width (56% mobile). Receipt copy has 64px top padding at every width. Download and Copy sit at the receipt’s upper-right (right 24%, top 6px), with tooltips above; About remains alone at the page upper-right. Export status follows the receipt in document flow; factual disclosure follows the full paper height. Disclosure has a 480px maximum width, narrowing to 420px on mobile. The page supports widths from 320px. Observed 12px, 20px, and 24px steps recur in ordinary gaps and margins; the illustration uses measured proportional placement rather than an invented universal spacing grid. `docs/receipt-layout.md` records the receipt measurements and reflow evidence.

## Elevation & Depth

Painted cabinet shading, brass highlights, paper grain, and the paper's own silhouette provide most depth. Live interface shadows are small and material-specific. The action uses `0 2px 5px #32181266`; the fortune stock uses `drop-shadow(0 7px 5px #54311c30)`. Ordinary prose, links, and disclosure have no card shadow.

The resting action also has a local worn-brass halo behind its face (`0 2px 12px 4px #dfb567c9`), derived from the existing gold with alpha. This invitation belongs to the cabinet action; it does not introduce a new palette accent or a general glow treatment.

**The Material Depth Rule.** Add depth where an object physically meets another surface; keep ordinary text content on the paper ground.

## Shapes

The cabinet, finials, and clouds are image silhouettes. Preserve their proportions and genuine transparency when producing replacements. The current receipt preserves the user-edited flared stock from `assets/plates/fortune-paper-edited.png`, preserved pixel-for-pixel in `public/art/dispensed-paper.png`. A canvas splits it at source y=500, extending only the blank upper area; the lower stars, clouds, torn edge, and flared silhouette scale uniformly with paper width. Superseded `receipt-stock.png` and the original `assets/plates/fortune-paper.png` remain historical references. The action is a brass-rimmed pill; keyboard focus has a small rounded outline. Thin rules and custom star SVGs provide the sparse surrounding ornament.

The sky uses one continuous cloud bank with genuine transparency between the celestial objects and a naturally scalloped lower edge. The former separated cloud-panel edges are resolved. The receipt extension replaces the former fixed paper rendering; it does not close historical whole-page or cabinet plate concerns.

## Components

### Primary action

A real button sits over the cabinet's blank action plaque. Its transparent hit area is 44px high; the visible face uses vermilion paint, cream uppercase lettering, a 1px brass rim, and the pill radius. The face keeps an 8.5 aspect ratio within the hit area. Cabinet-relative placement belongs to the homepage surface brief.

The visible face groups the label and decorative sky in a centered flex row with a 6px gap and 4px horizontal padding. Apply pill styling to that face only, so nested text spans retain their own roles. Hover darkens the paint and moves it upward 1px; active moves it downward 1px. The 160ms transitions cover background and translation. Keyboard focus uses a 3px `focus` outline with 5px offset.

While resting, enabled, on screen, visible, and motion-enabled, the local halo pulses over 3.2 seconds with ease-in-out timing, opacity 0.15–0.85, and scale 0.98–1.04. It stops during a request, in a hidden tab, off screen, when paused, and under reduced motion.

Activation immediately disables repeat requests, sets `aria-busy`, and shows “Reading” followed by “Issuing.” Full accessible labels confirm receipt and describe each phase; the decorative sky is hidden from assistive technology. During either busy phase, `🟍✹☾✹🟍` types one character at a time at 240ms steps, holds its full pattern, then repeats. Its reserved width prevents label movement. This is activity feedback, with no fabricated percentage or duration. Paused, reduced-motion, hidden-tab, and off-screen states use the full static pattern with no typing interval and no halo. Completion restores “Blame the cosmos,” its normal accessible name, and availability; completion and page exit clear the typing timer. These button cues retain the clerk's existing still-first, reading, and dispensing sequence.

### Navigation and motion control

The linked brand and About link remain ordinary HTML navigation. Underlines thicken from 1px to 2px on link hover. About is 20px on desktop and 16px on mobile.

Quiet project links live in the footer: Source code links directly to the repository, and License · AGPL-3.0 opens the separate license page. These links use 14px type, wrap with an 8px row gap and 22px column gap, and have a minimum 32px link height. About retains the site's explanation.

The motion control is a quiet underlined text button, 14px on desktop and 13px on mobile, with no filled background. It records a pause preference locally. The operating system's reduced-motion setting turns character animation off and disables this toggle with an explanatory label.

### Fortune paper

The receipt is a content-height paper object with live SpecialElite HTML text. Classification, title and full reading occupy a centered upper column. Below, the native-proportion cloud/star scene holds symbolic art centrally, a fixed Bureau seal on the left, a randomly selected smudged stamp on the right, and the issue date and two-line “Filed by the cosmos. Responsibility declined.” signoff. The paper is hidden during reading and dispensing, then revealed once with the existing 650ms clipped feed and small downward translation.

The lower scene has aspect ratio 1482/562. Its event-art square is 36% of paper width at left 32% and top -2%. Body/sign placements put the full-size sign behind the centered half-size body at opacity 0.15; contain sizing preserves silhouettes. The resolver uses selected event metadata, named scenes and reusable compositions before kind-level and generic fallbacks. Failed generic art can be omitted while preserving the reading. All scene art is decorative.

Each issue captures the chosen fortune, artwork and presentation together. Presentation contains a permanent ISO issue instant and one of six stamps, excluding the immediately preceding stamp. The printed date is formatted in America/New_York from that saved instant; downloads reuse the same presentation across midnight.

The label's semantic distinction must survive future styling. A source disclosure appears only for real events and supplies the fact, a separate labeled traditional interpretation when available, calculation window, and provenance, including the pyswisseph calculation source. The project's AGPL-3.0 source and license are available through the footer; licensing was chosen by the user.

**The Growing Paper Rule.** Let the live receipt grow to preserve all title and reading text at its established readable size; never shrink the reading to fit a decorative plate.

### Opening paper and export controls

The opening paper reads “Bad Day?” followed by one of six questions from `src/lib/intro-questions.ts`. Initialization chooses once per page load; these prompts never enter the issued-reading catalog. The Moon version asks “Has the Moon put your motivation on airplane mode?” The introductory classification is empty and hidden; “Before we begin” is absent. The opening has generic invented artwork, no issued stamp/date and no exportable selection. A normal request replaces it with the chosen fortune, visible classification, artwork and frozen presentation.

Download and Copy occupy the receipt’s upper-right, anchored within the narrow top edge of the flared paper at right 24% and top 6px, in a named “Save your fortune” group. Two 44px square buttons contain authored 22px native SVGs, accessible names and above-control hover/focus tooltips. About remains alone at the page upper-right at every width. Both start disabled with “Get a fortune first” tooltips, enable after an actual issue and disable during issuing or an export operation. There is no Share button, platform panel, social-network action or native-sharing path.

A polite status region follows the receipt in document flow, centered at a maximum width of 360px with 20px side padding and 15px Buenard at line height 1.4; it disappears when empty. Download prepares the cached PNG as `cosmic-bullshit-fortune.png` and announces that it is ready to save. Copy retains the chosen title when applicable, full reading, real/invented label, brand and homepage URL; success explicitly identifies the link as the homepage. Failures offer retry or the other action. Clipboard availability depends on browser permissions.

The cached 1080 × 1350 PNG preserves the exact selected fortune, resolved artwork, fixed Bureau seal, frozen stamp/date, brand and domain. Receipt controls are excluded. Website text begins at y=1317 below the border/cloud clip at y=1306. The separate 1200 × 630 homepage preview remains static. Source social atlas and exact prompt remain archival in `assets/receipt-art/social-icons.*`; the three derived public social icons were removed. The scoped receipt-corner review returned ship for the requested correction; the historical whole-page gate remains open. See `docs/receipt-sharing.md` for export behavior and verification limits.

### License reading page

The separate license page uses the existing ochre paper, plum ink, and Buenard type for a quiet reading surface. It has a 760px maximum width, 28px side padding, 20px body type at 1.55 line height, and a responsive 36–48px heading. Project notices and the full raw AGPL text remain readable with wrapping; a native disclosure contains the full license. Repository browsing, free source download, credits, and return links remain ordinary underlined navigation. Its composition belongs to `.impeccable/surfaces/src-pages-license-astro.md`.

### Character window

The resting WebP and muted inline video share one fixed, clipped glass window: left 26%, top 23%, width 48%, height 34% of the cabinet stage. The window stays fixed while the character performs. Video is shown only after playback starts; the still is the fallback.

**The Still First Rule.** Keep the clerk still most of the time; animate one restrained gesture only after a random 15–30 second pause or a user request.

Ten idle variants avoid immediate repetition, including the two fist gestures originally generated as readings. Requests interrupt idle and run one of five reading variants followed by one of three dispensing variants. Each pool independently avoids immediately repeating its previous clip. Animation is silent, has an 8.5-second safety timeout per clip, and stops while hidden, paused, or under reduced motion. Reduced motion also disables CSS animation, transitions, and smooth scrolling.

### Asset provenance

Shipping original page raster sources are `assets/plates/cabinet.png`, `sky-panorama.png`, and `paper.png`. The retained `assets/plates/fortune-paper.png` is the original paper source reference; it is not rendered by the growing receipt. The 1774×887 RGBA panorama joins the moon and airplane at left with Saturn at right in the existing plum engraving and cream fill. Its exact generation prompt is embedded in the PNG and retained in `sky-panorama.prompt.txt` and `sky-panorama.png.json`. Original `left-sky.png` and `right-sky.png` plates remain as generation references with their provenance; the page no longer renders them directly. Each retained plate has a matching `.png.json` generation record and `.prompt.txt` prompt; `.base-prompt.txt` retains earlier prompt history where present. These are generated production plates, not crops presented as an approved final page.

The receipt adds 34 prepared plum-and-cream engravings under `public/art/{bodies,signs,states,scenes}/` plus the current flared paper, seven stamp/seal images and panorama; the superseded `receipt-stock.png` remains historical. All illustrations are 480 × 480 RGBA PNGs with a 24px transparent inset. Their five generated source images, exact prompts, source identities, and crop recipes remain in `assets/receipt-art/`, `generations.json`, and `crops.json`; the prepared PNGs embed the exact generation prompt, while the manifests retain source identities and preparation recipes. `assets/receipt-concepts/stamp-generations-v2.json` retains the stamp prompts and generation identities. `public/art/share-panorama.png` copies the existing approved sky panorama. Shipping `public/art` PNG provenance covers all 44 rasters with zero missing records. `docs/receipt-art.md` is the inventory and resolver contract. Approved `receipt-120-proof-v3.png` and `share-120-proof-v3.png` in `assets/receipt-concepts/` remain the historical visual authorities, with the later website-lowering instruction governing the export footer. The separate `public/social-preview.png` is a deterministic composition of the approved cabinet, paper texture, local Buenard, and brand-star geometry; its `.png.json` records source hashes and the preparation recipe.

Character-generation records are in `assets/animation-provenance.json`; it preserves the Kling 3.0 job IDs and prompts, including the superseded first reading and the steadier-lighting revision. Current character media lives in `public/media/v2/`. `scripts/prepare_media.py` applies the same native 396×376 crop at (216, 254) to all eighteen 828×1108 originals without scaling, encoding silent H.264 at CRF 17 with the slow preset. The lossless BGRA WebP resting image comes from the first decoded frame of the delivered `idle.mp4`, preserving its decoded RGB exactly. `public/media/v2/resting-window.webp.json` records the recipe, source hashes, and generation record. The new namespace keeps the current poster and videos together; earlier media and its provenance remain for cached clients and history. Keep these records when transforming or replacing assets; do not treat the historical entries as a guarantee that every generated variant ships.

Remaining softness inherited from the generated 540×720 reference is an asset limitation, not a reusable design treatment or a detail recoverable by upscaling.

## Do's and Don'ts

### Do:

- **Do** preserve warm paper, plum ink, and restrained vermilion action.
- **Do** keep text and interaction in live HTML above the illustration.
- **Do** preserve the clerk's identity, steady lighting, fixed window, and long still pauses.
- **Do** retain visible factual-versus-invented labels, keyboard focus, motion preferences, and asset provenance.
- **Do** let the receipt grow for the full chosen reading and use the same frozen selection for download and copy.

### Don't:

- **Don't** replace the illustration's material depth with generic floating cards.
- **Don't** bake changing fortune text or the interactive action label into artwork.
- **Don't** shrink live reading text, clamp content, or use the homepage preview as a selected-fortune image.
- **Don't** turn unresolved plate edges, crop drift, or old-comp geometry differences into reusable design rules.
- **Don't** describe this documentation or the taller-cabinet approval as a closed finish review.
