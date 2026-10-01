# Curriculum correction pass — 1 October 2026

## Summary of key revisions

Replaced the neutron-count heuristic with explicit Ar-37/C-14 decay records and an honest unknown-record state; retained the existing stable-isotope list. Corrected ion superscripts and qualified the electron-filling model. Defined orbital notation and hydrogen model limits. Kept out-of-range infrared photons off the 50–1600 nm strip and listed their actual wavelengths. Replaced the drawn-radius collision with adaptive velocity-Verlet Coulomb integration. Removed the unverified historical quotation and exact scattering-frequency claim. Labelled the half-life chart and narrowed perfect-score feedback.

All three repositories received a comment explaining the shared opaque-token fallback catch, removing its existing `no-empty` lint error without changing its behaviour.

## Edited curriculum

Edits are integrated into the learner-facing components and course data in this change. This is the correction pass approved after the review, not a new subject-matter expansion or certification of every scientific statement.

## Verification performed

- `npm run build`: passed. Database migration wrapper skipped because no external database is configured; these curricula run without a database.
- `npm run typecheck`: passed.
- `npm run lint`: no errors; pre-existing warnings remain.
- `node --test scripts/curriculum.test.mjs`: 5 focused checks passed, executing the actual TS/TSX source through the installed TypeScript compiler.
- Existing application-data and auth tests, run separately: 55 passed.
- Desktop (1280 × 800) and mobile (390 × 844) development and built-output render checks: visible content, no uncaught page errors or horizontal overflow. Screenshots visually inspected.
- Interactive acceptance used Playwright with a locally available Chromium binary because the repository’s expected browser download was unavailable and `agent-browser` was not installed. The Vite-only network-interface workaround was outside the repository and is not part of the change.

### Full-suite limitation

`npm test` is **not green**: eight share-card fixture tests fail in `scripts/grok-pwa-plugin.test.mjs`. The same eight failures were reproduced in untouched baseline source copies of each repository (189/197 script tests passed before this change). Their generic fixture title/card expectations conflict with the repositories’ existing site metadata and custom card. The curriculum tests introduce no additional failing tests. Because the script-test stage fails, the chained application-data/auth stage was executed separately. These unrelated template tests were not rewritten by this curriculum correction pass.

## Scope and remaining questions

This pass is not an exhaustive accessibility audit, specialist scientific certification, or comprehensive source verification of every lesson. It does not establish independent learner mastery. Unsupported nuclides and ion configurations remain explicitly outside the verified model. The gold-foil model is qualitative and does not predict experimental percentages. Review the full curriculum again before adding new subject matter.

## Sources supporting substantive corrections

- KAERI [Argon-37 nuclide record](https://atom.kaeri.re.kr/cgi-bin/nuclide?nuc=Ar37): electron capture to chlorine-37.
- OpenStax [Bohr’s model of hydrogen](https://openstax.org/books/university-physics-volume-3/pages/6-4-bohrs-model-of-the-hydrogen-atom): simplified energy-level model and limitations.
- NCBI Bookshelf [Principles of Membrane Transport](https://www.ncbi.nlm.nih.gov/books/NBK26815/): the retrieved search extract states that water can diffuse through lipid bilayers; direct page retrieval was blocked by CAPTCHA.
- RCSB PDB [8OIN](https://www.rcsb.org/structure/8OIN): 55S mammalian mitochondrial ribosome.
- OpenStax [Cell Cycle](https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle): chromosome separation and daughter nuclei.
- KAERI [Carbon-14 nuclide record](https://atom.kaeri.re.kr/cgi-bin/nuclide?nuc=C14): beta-minus decay to nitrogen-14.
- OpenStax [Simple Machines](https://openstax.org/books/physics/pages/9-3-simple-machines): ideal force-distance trade and work conservation.

### Focused numerical evidence

All 15 downward level-1–6 hydrogen transitions are positive and finite; four exceed 1600 nm. The 6 → 5 line is approximately 7459.88 nm. Head-on speeds 340, 520 and 760 reverse under Coulomb repulsion with relative energy drift below 0.2% in the sampled trials; the higher-energy turning points are inside the former eight-pixel collision radius. Symmetric offset trials match to the regression tolerance. These checks validate the offered parameter range, not every possible initial condition.
