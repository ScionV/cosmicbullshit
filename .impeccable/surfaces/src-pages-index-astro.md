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

Motion: predominantly still, random 15–30 second pause between nonrepeating idle clips; requests take priority. Steady face lighting, muted inline clips, still fallback and reduced-motion support. User chose AGPL-3.0 and open-source publication; source attribution is present in the About section. No false factual event claims or fake causal assertions.

## Implemented system and evidence

The code uses ochre paper (`--paper: #e8c898`), plum ink (`--ink: #40192e`), vermilion action (`--action: #9c321e`), worn brass (`--gold: #dfb567`), and plum keyboard focus (`--focus: #722d47`). Buenard is locally hosted as a variable font with a declared 400–700 weight range. `DESIGN.md` records the extracted token system; `.impeccable/design.json` carries its component previews and motion extensions.

The cabinet stage is 3:4. The user approved the taller production cabinet during formal asset review. The original decision comp still has the earlier shorter geometry; its proportions must not silently override that later approval. Current desktop and mobile screenshots are under `.impeccable/review/`. Automated comparisons and plate fidelity remain open; the taller-cabinet approval does not close the page finish review.

The still and video share a fixed glass window at left 26%, top 23%, width 48%, height 34%. Five idle clips avoid immediate repetition with a randomized 15–30 second pause after each completed clip. A request interrupts idle, chooses between two reading clips, then dispenses before revealing live HTML fortune text. Paused, hidden-tab, and reduced-motion states retain a still fallback. The paper reveal runs once per issue; the artwork itself does not supply changing result text.

Shipping production plate provenance lives alongside each PNG in `assets/plates/` as `.png.json` and `.prompt.txt`, with earlier prompt history in `.base-prompt.txt`. `assets/animation-provenance.json` preserves generation prompts and job IDs, including superseded history; `public/media/resting-window.webp.json` records the still crop derivation. Retain these records when replacing or transforming assets. Do not canonize visible plate edges or unresolved crop differences as part of the direction.
