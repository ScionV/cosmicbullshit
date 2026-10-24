---
version: 1
slug: "src-pages-license-astro"
primary_target: "src/pages/license.astro"
related_targets: ["src/styles/home.css", "LICENSE", "NOTICE"]
---

# License and source reading page

Mode: Read. Make the project's open-source license, complete source, notices, and credits available from the homepage footer.

## Direction contract

THESIS: A quiet paper reading surface gives visitors the license and source information in the same printed world as the clerk.

OWN-WORLD: Existing ochre paper texture, plum ink, locally hosted Buenard, and ordinary underlined links. Preserve the incumbent palette and type family.

STORY: Arrive from License · AGPL-3.0, browse or download the complete source, read calculation and artwork credits and project notices, expand the full AGPL text, then return to the clerk.

FIRST VIEWPORT: A return link leads into “License & source code,” the AGPL-3.0-only statement, source browsing and free download links, then calculation and credit information. The full license remains in a native disclosure below the project notices.

FORM: One centered reading column with a 760px maximum width and padding of 48px 28px 72px. Body type is 20px with 1.55 line height; the main heading uses `clamp(36px, 5vw, 48px)` with 1.1 line height and -0.02em tracking. Section headings are 28px. Raw notices and license text use the inherited serif at 16px and wrap within the column.

FINISH: Reviewed within the requested refinement scope; the independent reviewer returned ship with no material fixes. This does not close the homepage's pre-existing whole-build comparison and plate-fidelity gate.

## Implemented system and evidence

`src/pages/license.astro` renders `LICENSE` and `NOTICE` directly as raw text. Links expose the repository, free main-branch source archive, Astro, pyswisseph, Swiss Ephemeris, and Buenard's SIL Open Font License. The homepage footer also provides a direct Source code link. The page has return links above and below the reading content.

The layout inherits the existing focus treatment, link hover treatment, paper texture, and minimum page width of 320px. Preformatted legal text uses wrapping and anywhere overflow handling to avoid horizontal scrolling.

Review evidence is `.impeccable/review/license-top-390.png` and `license-top-1440.png`. Browser checks covered source and legal links and overflow; Astro check and build passed.
