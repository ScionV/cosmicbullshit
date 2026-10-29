# Receipt review proofs

These are local visual studies, not changes to the running receipt or export.

- `receipt-user-paper-proof-v2.png` preserves the user-supplied `assets/plates/fortune-paper-edited.png` proportions, existing clouds and stars. Leo is a 15% backdrop to centered Jupiter low on the paper. The Bureau seal is permanent at left; a sample variable seal is at right. The small filing disclaimer sits at the lower right.
- `share-typewriter-proof-v2.png` studies the same vocabulary on the rectangular download format.
- `smudged-stamps-paper-proof-v2.png` shows six regenerated imperfect ink impressions on cream for inspection. Exact built-in image-generation prompts are in `stamp-generations-v2.json` and embedded in the generated sources.
- `bureau-seal-v1.png` is the new permanent Bureau of Cosmic Bullshit mark.

`compose-proof-v2.mjs` reproduces all three proofs against the local dev server. Receipt text uses locally downloaded Special Elite from https://github.com/google/fonts/tree/main/apache/specialelite; its font and Apache license are in `public/fonts/`. The font is not yet applied to live UI. The user's edited paper remains untouched; previous candidates remain available.

Production implementation still needs responsive full-length reading tests on this paper, final seal positioning across aspect ratios, per-issue stamp selection retained by sharing, font integration and normal visual review. These proofs use one existing reading to review the composition.
