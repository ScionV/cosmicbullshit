---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/styles/home.css", "src/scripts/fortune-machine.ts"]
---

# Homepage prototype

Mode: Experience. One button gives a humorous cosmic excuse; real sky events and invented nonsense are clearly distinguished. Use existing approved character, still and reactions. Astro with TypeScript, static Cloudflare deployment linked to ScionV/cosmicbullshit.

## Direction contract

THESIS: The visitor consults a charmingly exhausted fortune-machine clerk and receives a paper excuse. The entertainment is the homepage.

OWN-WORLD: Ochre paper, plum ink, vermilion action, a painted plum cabinet and worn brass. Readable type and controls sit alongside the approved illustration.

STORY: Arrive, press Blame the cosmos, see a skeptical reading, then receive a labeled fortune. More excuses remain one press away.

FIRST VIEWPORT: One central cabinet, readable paper result emerging below its slot, quiet masthead/premise left, About top right, celestial illustration at the edges. Action sits on the cabinet. Mobile prioritizes face, action and result.

FORM: User-selected Dubious Fortune, first grounded candidate, evolved by explicit user request into the cosmic bureaucrat machine; seed:c8646a1b9ae7689c. Reference .impeccable/mocks/decision/fortune-machine-v1.png; user-approved resting frame and reaction clips govern character identity and motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Motion: predominantly still, random 15–30 second pause between nonrepeating idle clips; requests take priority. Steady face lighting, muted inline clips, still fallback and reduced-motion support. User chose AGPL-3.0 and open-source publication; the footer links directly to Source code and to the separate `/license/` reading page. About contains the site's explanation. No false factual event claims or fake causal assertions.

## Implemented system and evidence

The code uses ochre paper (`--paper: #e8c898`), plum ink (`--ink: #40192e`), vermilion action (`--action: #9c321e`), worn brass (`--gold: #dfb567`), and plum keyboard focus (`--focus: #722d47`). Buenard is locally hosted as a variable font with a declared 400–700 weight range. `DESIGN.md` records the extracted token system; `.impeccable/design.json` carries its component previews and motion extensions.

The cabinet stage is 3:4. The user approved the taller production cabinet during formal asset review. The original decision comp still has the earlier shorter geometry; its proportions must not silently override that later approval. Current desktop and mobile screenshots are under `.impeccable/review/`. Automated comparisons and plate fidelity remain open; the taller-cabinet approval does not close the page finish review.

The user's connected-cloud request is implemented as one 1774×887 RGBA `assets/plates/sky-panorama.png`: moon and airplane at left, Saturn at right, and one continuous plum-engraved, cream-filled cloud bank. Genuine alpha between stars and around a naturally scalloped lower edge resolves the former separated-panel edges. The original left/right sky plates remain generation references with provenance and are no longer rendered directly. The exact panorama prompt is embedded in the PNG and retained in its `.prompt.txt` and `.png.json` records.

One decorative Astro `Image` serves responsive WebP widths of 1120, 1536, and 2048px. The centered artwork uses `width: max(100%, 1120px)` and a 120px top offset on desktop; the offset is 200px at 701–1100px, 20px at 700px and below, and -40px at 360px and below. Mobile retains a 1120px artwork width and 0.75 opacity. At 1120px and above, `main#consult` has `min-height: calc(50vw + 120px)` to contain the full panorama. Cabinet, interaction, and palette remain unchanged.

The action's transparent 44px-high hit area is 30% of cabinet width, placed at left 35.2% with its center at 64.1% of cabinet height. Its visible pill face has an 8.5 aspect ratio and 1px brass rim, fitting the illustrated plaque while retaining a taller hit area. Action type is `clamp(11px, 1.05vw, 14px)` with 0.06em tracking, becoming 11px and 0.03em tracking at 700px and below. The existing action colors remain unchanged.

Friends testing the site found the action easy to miss and its waiting state unclear. The requested refinement adds a slight local gold halo behind the resting button and a moon-and-stars symbol sequence during requests. The halo uses the existing gold with alpha, a 3.2-second ease-in-out pulse, opacity 0.15–0.85, and scale 0.98–1.04. It runs only while the action is resting, enabled, on screen, visible, and motion-enabled. It stops while busy, hidden, off screen, paused, or under reduced motion; cabinet placement and the 44px target remain unchanged.

The visible face groups the label and an assistive-technology-hidden sky in a centered flex row with a 6px gap and 4px horizontal padding. Face styling applies only to the face wrapper. Activation immediately disables repeat requests, sets `aria-busy="true"`, shows “Reading,” and supplies the full accessible label “Reading the stars. Your request has been received.” Dispensing changes the visible label to “Issuing” and accessible label to “Issuing your cosmic excuse.” The decorative `🟍✹☾✹🟍` sequence types at 240ms steps, holds the full pattern, and repeats within a fixed 5em width. Its locally hosted symbol-font subset uses 0.9em normal-weight type; ordinary type stays Buenard. Reveal whole Unicode code points to avoid splitting the outer star. There is no fake percentage. The button's own intersection observer gates its motion independently of character playback. Paused, reduced-motion, hidden-tab, and off-screen busy states retain the full static pattern with no typing interval. Completion restores the original label, accessible name, and enabled state; completion and page exit clear the timer. Existing 15–30 second idle pauses and reading/dispensing playback remain intact.

The still and video share a fixed glass window at left 26%, top 23%, width 48%, height 34%. Five idle clips avoid immediate repetition with a randomized 15–30 second pause after each completed clip. A request interrupts idle, chooses between two reading clips, then dispenses before revealing live HTML fortune text. Paused, hidden-tab, and reduced-motion states retain a still fallback. The paper reveal runs once per issue; the artwork itself does not supply changing result text.

Shipping production plate provenance lives alongside each PNG in `assets/plates/` as `.png.json` and `.prompt.txt`, with earlier prompt history in `.base-prompt.txt`. `assets/animation-provenance.json` preserves generation prompts and job IDs, including superseded history. Current character media is served together from `public/media/v2/`: all eight clips use the native 396×376 crop at (216, 254) from 828×1108 originals without scaling, encoded as silent H.264 at CRF 17 with the slow preset. The lossless BGRA WebP poster is the first decoded frame of the delivered idle clip. `scripts/prepare_media.py` and `public/media/v2/resting-window.webp.json` retain the recipe and source hashes. The namespace avoids pairing an old cached poster with current clips; earlier media and records remain for cached clients and history. Remaining softness inherited from the generated 540×720 reference is an asset limitation, not a design rule. Retain these records when replacing or transforming assets. Do not canonize visible plate edges or unresolved crop differences as part of the direction.

## Scoped refinement review

The independent refinement reviewer returned **ship** for the requested footer/license separation, plaque-sized action, and aligned native-resolution character media, with no material fixes. Evidence: `.impeccable/review/refine-{320,390,700,1100,1440}.png`, `refine-reading.png`, and `license-top-{390,1440}.png`. Production browser checks covered real-video reading/dispensing, footer/source/legal navigation, and overflow; Astro check and build passed. Pixel comparison found exact RGB agreement between the poster and the first decoded delivered idle frame (maximum difference 0); all eight clip starts had best alignment offset (0, 0).

This scoped verdict does not close the earlier whole-build comparison and plate-fidelity gate.

## Scoped connected-cloud review

The independent fresh reviewer returned **ship** for the connected panorama, with no material fixes. Evidence: `.impeccable/review/clouds-before-user.png` and `clouds-{320,390,700,1100,1440,1906,2560}.png`. Browser checks at all seven widths found no horizontal overflow or JavaScript errors, all images complete, and the full panorama's vertical bounds inside the main region. Astro check and build passed; the 23 existing font/color design advisories remain unchanged.

The separated cloud edges are resolved. Cabinet and fortune-paper concerns remain outside this request, and this scoped verdict does not close the historical whole-page comparison and plate-fidelity gate.

## Scoped button feedback review

The independent fresh reviewer returned **ship** for the requested button halo and immediate ASCII activity feedback, with no material fixes. All 13 required captures were valid: `.impeccable/review/button-rest-{320,390,700,1440,1906}.png`, `button-reading-{320,390,700,1440,1906}.png`, `button-issuing-{320,1440}.png`, and `button-reduced-320.png`.

Production browser checks at all five widths covered full real-video requests, immediate busy feedback, changing typed characters, ignored repeat activation, issuing, completion cleanup, off-screen and pause behavior, the 44px target, and text fit without horizontal overflow. Additional checks passed for reduced motion with a delayed failed calendar request and static sky, video-failure cleanup, keyboard Enter repeats, and live motion-preference changes. No JavaScript errors were observed. Astro check and build passed with zero errors; the detector retained 23 pre-existing advisories and reported zero primary findings.

This verdict covers the new button behavior only. It does not close the historical whole-page comparison and plate-fidelity gate or resolve the cabinet and fortune-paper concerns outside this request.
