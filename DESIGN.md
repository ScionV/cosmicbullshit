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
    fontFamily: "Buenard, Georgia, serif"
    fontSize: "clamp(18px, 1.9vw, 28px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  label:
    fontFamily: "Buenard, Georgia, serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.11em"
  action:
    fontFamily: "Buenard, Georgia, serif"
    fontSize: "clamp(12px, 1.05vw, 16px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.08em"
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
    padding: "0 6px"
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
---

# Design System: Cosmic Bullshit

## Overview

**Creative North Star: "The Weary Cosmic Clerk"**

Cosmic Bullshit feels like an old printed amusement made operational: warm ochre paper, plum engraving, worn brass, and an exhausted but charming clerk. The illustration carries the ornate personality; the surrounding interface stays readable and spare. The humor is warm, absurd, and plainly entertainment.

This document records the implemented system in `src/pages/index.astro`, `src/styles/home.css`, and `src/scripts/fortune-machine.ts`. It describes code authority, not a finish verdict. The user approved the taller production cabinet during asset review; the original decision comp retains shorter geometry. Automated comparison and plate concerns remain open and are not converted into design rules.

**Key Characteristics:**

- Warm printed material and plum ink.
- One locally hosted serif family with a compact hierarchy.
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

### Named Rules

**The Ink and Paper Rule.** Use plum text on the warm paper ground for ordinary content; reserve vermilion for the primary action.

## Typography

**Display Font:** Buenard, with Georgia and serif fallbacks.
**Body Font:** Buenard, with the same fallbacks.

The local variable font is served from `public/fonts/Buenard.ttf` with a declared normal weight range of 400–700 and `font-display: swap`. Its literary serif character connects live text with printed ornament. Bold weight establishes hierarchy; body copy remains open and readable.

### Hierarchy

- **Display:** the brand uses the frontmatter's responsive size, bold weight, tight tracking, and short line height. It becomes 36px at tablet width, 32px on mobile, and 26px at 360px and below.
- **Headline:** explanatory section heading; 30px on mobile.
- **Body:** explanatory prose; 18px on mobile. The section width is capped at 720px including side padding.
- **Fortune:** compact, centered, bold result text on paper. Invented results use the responsive frontmatter role; real-event results begin at 23px on desktop and 21px on mobile.
- **Label:** a small uppercase content classification on the fortune, not a decorative eyebrow. Real-event labels become 9px with tighter tracking on mobile.
- **Action:** uppercase button text. Mobile fixes it at 12px and reduces tracking to 0.05em.

Fortune copy is fitted within the upper 58% of its paper bounds. The script can reduce result type toward 16px and supporting text toward 11px to keep long content inside that region. These are containment limits, not a general type scale.

## Layout

The current homepage's composition belongs to `.impeccable/surfaces/src-pages-index-astro.md`. Its reusable spatial grammar is one illustrated focal object, quiet peripheral navigation, and centered readable supporting text below.

The main cabinet is a 3:4 stage, normally `min(700px, 64vw)`, and 740px at 1600px and above. At 701–1100px it becomes 68vw with 80px top clearance. At 700px and below the masthead joins document flow; the cabinet is centered at 125% viewport width with a 620px cap. The mobile crop favors face, action, and result while the sky artwork moves toward the edges.

The paper result and controls align to proportions of the cabinet rather than a generic card grid. Supporting factual disclosure has a 440px maximum width, narrowing to 380px on mobile. The page supports widths from 320px. Observed 12px, 20px, and 24px steps recur in ordinary gaps and margins; the illustration uses measured proportional placement rather than an invented universal spacing grid.

## Elevation & Depth

Painted cabinet shading, brass highlights, paper grain, and the paper's own silhouette provide most depth. Live interface shadows are small and material-specific. The action uses `0 2px 5px #32181266`; the fortune stock uses `drop-shadow(0 7px 5px #54311c30)`. Ordinary prose, links, and disclosure have no card shadow.

**The Material Depth Rule.** Add depth where an object physically meets another surface; keep ordinary text content on the paper ground.

## Shapes

The cabinet, finials, clouds, and flared fortune sheet are image silhouettes. Preserve their proportions and genuine transparency when producing replacements. The action is a brass-rimmed pill; keyboard focus has a small rounded outline. Thin rules and custom star SVGs provide the sparse surrounding ornament.

The visible bounding edges of illustration plates in current screenshots are unresolved asset concerns. They are not a prescribed framing device.

## Components

### Primary action

A real button sits over the cabinet's blank action plaque. It uses vermilion paint, cream uppercase lettering, a 2px brass rim, and the pill radius. Its minimum height is 42px on desktop and 44px on mobile.

Hover darkens the paint and moves it upward 1px; active moves it downward 1px. The 160ms transitions cover background and translation. Busy state disables repeat activation and changes the label through reading and issuing states. Keyboard focus uses a 3px `focus` outline with 5px offset.

### Navigation and motion control

The linked brand and About link remain ordinary HTML navigation. Underlines thicken from 1px to 2px on link hover. About is 20px on desktop and 16px on mobile.

The motion control is a quiet underlined text button, 14px on desktop and 13px on mobile, with no filled background. It records a pause preference locally. The operating system's reduced-motion setting turns character animation off and disables this toggle with an explanatory label.

### Fortune paper

The illustration is separate from live text. A content label distinguishes “Invented nonsense” from “Real sky · comic excuse”; the factual version includes a separate comic interpretation. The paper is hidden during reading and dispensing, then revealed once with a 650ms clipped feed and a small downward translation.

The label's semantic distinction must survive future styling. A source disclosure appears only for real events and supplies the fact, calculation window, and provenance. The current code links to the project's AGPL-3.0 source and pyswisseph calculation source; licensing was chosen by the user.

### Character window

The resting WebP and muted inline video share one fixed, clipped glass window: left 26%, top 23%, width 48%, height 34% of the cabinet stage. The window stays fixed while the character performs. Video is shown only after playback starts; the still is the fallback.

**The Still First Rule.** Keep the clerk still most of the time; animate one restrained gesture only after a random 15–30 second pause or a user request.

Five idle variants avoid immediate repetition. Requests interrupt idle and run one of two nonrepeating reading variants followed by dispensing. Animation is silent, has an 8.5-second safety timeout per clip, and stops while hidden, paused, or under reduced motion. Reduced motion also disables CSS animation, transitions, and smooth scrolling.

### Asset provenance

Shipping raster sources are `assets/plates/cabinet.png`, `fortune-paper.png`, `left-sky.png`, `right-sky.png`, and `paper.png`. Each plate has a matching `.png.json` generation record and `.prompt.txt` prompt; `.base-prompt.txt` retains the earlier prompt history. These are generated production plates, not crops presented as an approved final page.

Character-generation records are in `assets/animation-provenance.json`; it preserves the Kling 3.0 job IDs and prompts, including the superseded first reading and the steadier-lighting revision. `public/media/resting-window.webp.json` records the resting crop's derivation from `.impeccable/mocks/character/resting-frame-v1.png`. Keep these records when transforming or replacing assets; do not treat the historical entries as a guarantee that every generated variant ships.

## Do's and Don'ts

### Do:

- **Do** preserve warm paper, plum ink, and restrained vermilion action.
- **Do** keep text and interaction in live HTML above the illustration.
- **Do** preserve the clerk's identity, steady lighting, fixed window, and long still pauses.
- **Do** retain visible factual-versus-invented labels, keyboard focus, motion preferences, and asset provenance.

### Don't:

- **Don't** replace the illustration's material depth with generic floating cards.
- **Don't** bake changing fortune text or the interactive action label into artwork.
- **Don't** turn unresolved plate edges, crop drift, or old-comp geometry differences into reusable design rules.
- **Don't** describe this documentation or the taller-cabinet approval as a closed finish review.
