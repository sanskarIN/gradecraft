# GradeCraft Work Handoff

## Current milestone

**Version:** 1.0.0 release-candidate + Phase 6 audit branch  
**Phase:** Phase 6 — final audit and release verification  
**Date:** 2026-08-19  
**Working branch:** `phase6/release-audit`  
**Pull request:** #2 — `feat: complete weighted planning and release audit`  
**PR state:** Open, draft, mergeable  
**Base branch/head:** `main` at `1177bf730c43f0dad1d996ee4b4e3c7df93c7477`  
**Audited code head immediately before this handoff update:** `f13b54f0154ca1f5b1c3b40176e1088f19e6c4ff`  
**PR size at that audited code head:** 128 meaningful commits over `main`, 62 changed files

This file is the authoritative continuation checkpoint. Do not describe the release as verified until the latest CI, E2E, CodeQL, dependency, build, and clean-checkout evidence is actually green.

## Completed work

### Product and domain

- Implemented the TypeScript + React PWA architecture and complete local-first student grade-calculator product baseline.
- Implemented points-based and weighted-category calculations.
- Implemented custom courses, categories, weights, assignments, grading scales, credit hours, GPA profiles, score trends, and category contribution views.
- Implemented temporary what-if overrides that never mutate saved grades.
- Added points-mode required-score planning.
- Added weighted-category required-score planning, including categories that do not yet have graded work.
- Made target-score planning use the active what-if scenario instead of only persisted scores.
- Fixed weighted planner category selection so a valid positive-weight category is chosen even when the first category has zero weight.
- Added strict target range and future-score input validation.
- Added validation requiring at least one course category.
- Hardened category validation against duplicate category IDs and now also rejects duplicate category names case-insensitively after trimming, preventing ambiguous CSV category mapping.
- Hardened grading-scale validation against duplicate band IDs, duplicate labels, duplicate thresholds, incomplete scales without a 0% fallback band, out-of-range GPA values, and oversized scale text.
- Added deterministic property-style grade tests covering hundreds of generated valid point-based and weighted grade combinations and asserting results remain within valid percentage bounds.

### Persistence and data integrity

- Kept privacy-first browser Local Storage persistence with recovery-copy behavior and explicit delete controls.
- Hardened backup/restore schema validation so restored data must satisfy domain invariants instead of only structural checks.
- Rejects duplicate course, category, assignment, grading-scale, and grade-band identifiers.
- Rejects empty persisted entity identifiers and unknown grading-scale references.
- Rejects assignments referring to missing categories.
- Rejects invalid weighted totals, invalid assignments, incomplete grading scales, empty course names, courses without categories, duplicate category names, and backups without any usable grading scale.
- Rejects restored course colors unless they are safe 3- or 6-digit hexadecimal color values, preventing imported style values from becoming arbitrary CSS resource-bearing values.
- Added bounded persisted text validation for course names/codes, category names, assignment names, grading-scale names, and band labels.
- Added strict calendar-date validation for assignment due dates, including correct leap-day handling.
- Course editing prevents removal of a category that still owns assignments, preventing orphaned assignment references.
- Assignment undo is now invalidated if the deleted assignment's original category is removed before Undo is used, preventing the undo path from recreating an orphaned assignment reference.
- Improved recovery behavior so a corrupted primary Local Storage record can be restored from a valid recovery record and the primary record is repaired where possible.
- Prevents corrupted primary content from replacing a known-valid recovery record during the next save.
- Local persistence now degrades safely if browser storage is blocked or inaccessible instead of throwing through application startup or save/delete operations.
- Exposes persistence failure state to the application and shows an explicit user-visible alert warning that current changes may not survive leaving the tab.
- Explicit local-data deletion now suppresses the immediate post-reset persistence write, leaving GradeCraft's primary and recovery storage keys removed for the reset operation instead of instantly writing default state back.
- Kept explicit schema version `1` and migration entry point for future versions.

### CSV and backup safety

- Kept JSON full backup/restore and CSV assignment import/export.
- Kept spreadsheet-formula neutralization on exported CSV cells.
- Fixed protected CSV text round trips so neutralized values are restored correctly on GradeCraft re-import.
- Preserved legitimate user text that intentionally starts with an apostrophe.
- Kept quoted-field parsing, score validation, category-weight validation, file-size limits, and browser-local parsing.
- Added calendar validation for CSV due dates so impossible dates are rejected before importing.
- Added bounded CSV category and assignment text fields so oversized imported content cannot bypass normal form limits.
- CSV import now rejects duplicate column names instead of silently accepting an ambiguous header and selecting the last duplicate field.
- Category names are unique within a course, eliminating case-insensitive category-name ambiguity in CSV mapping.
- Kept CSV course selection valid after restoring/replacing data with a different set of course IDs.

### UI, accessibility, and localization readiness

- Kept responsive phone/tablet/desktop layouts, onboarding, light/dark/system theme, compact mode, reduced motion, focus visibility, semantic forms/tables, native dialogs, and offline states.
- Centralized the major English UI messages in `src/i18n/en.ts` and externalized the new persistence-system warning in `src/i18n/system.ts`.
- Externalized application-shell, onboarding, dashboard, course, assignment-form, course-form, GPA, what-if, data-transfer, settings, About, modal, grade-ring, trend-chart, and contribution-chart text.
- Added descriptive assignment Edit/Delete accessible names.
- Improved chart semantics and preserved non-color textual values.
- Native modal dialogs now have explicit accessible names wired with `aria-labelledby` and stable React-generated IDs.
- Modal content is unmounted while closed so cancelled local form drafts reset before the next editing session.
- Controlled modal closing avoids duplicate close callbacks.
- First-run onboarding now moves focus into the onboarding dialog and marks application background regions inert for the duration of onboarding, preventing keyboard and assistive-technology interaction with hidden background controls.
- Kept the required `Made by the Sanskar` credit and contact/funding links.

### What-if and route resilience

- What-if calculations remain non-destructive and scenario-aware.
- Points and weighted target-score solving are covered for active and previously inactive weighted categories.
- A stale or missing course ID in a `what-if` hash route now falls back to an available course instead of producing a broken planner state.
- What-if course selection also re-synchronizes if the available course set changes while the page remains mounted.

### PWA and deployment

- Kept the manifest, editable SVG icon source, service worker, offline shell, and production-only service-worker registration.
- Added `VITE_BASE_PATH` deployment configuration so GradeCraft can be built for root hosting or a repository subpath.
- Made manifest/icon references and service-worker registration base-path aware.
- Made the manifest start URL and scope relative to its deployment location.
- Reworked the service-worker navigation strategy so application updates can refresh the navigation shell while a cached shell remains available offline.
- Scoped service-worker handling to same-origin requests inside the registration scope.
- Hardened service-worker registration so a browser registration failure does not create an unhandled promise rejection.
- The service-worker install phase parses the built `index.html` and attempts to precache same-origin, in-scope application assets discovered from its `src` and `href` references, in addition to the core shell resources.
- Service-worker activation waits for both obsolete-cache cleanup and `clients.claim()`.
- Cache ownership is now isolated with the `gradecraft-` prefix. Activation only deletes obsolete GradeCraft-owned caches instead of deleting unrelated Cache Storage entries from other same-origin applications.
- Runtime cache reads now open the current GradeCraft cache explicitly rather than using global `caches.match`, preventing accidental reads from unrelated same-origin caches.
- The current shell cache is `gradecraft-shell-v4`.
- Added a Playwright journey for an offline reload immediately after the first installed worker claims the page, covering the first-visit offline shell rather than only a previously warmed runtime cache.

### Browser security baseline

- Added a same-origin client-side Content Security Policy baseline in `index.html` covering scripts, styles, images, manifests, connections, workers, objects, base URLs, and form actions.
- Added `no-referrer` metadata to avoid leaking navigation referrers from the application document.
- Kept the CSP development-compatible with Vite/React by allowing the inline script/style behavior required by the development runtime and current component styling.
- Documented that production hosts with header control should deploy and test a stricter response-header CSP where practical.
- Added static regression coverage for the CSP/referrer policy and service-worker cache ownership/scope rules.

### Dependency and configuration hardening

- Updated Vite from the earlier 6.0.7 line to `6.4.3` and `@vitejs/plugin-react` to `4.7.0` while retaining exact direct dependency versions in `package.json`.
- Hardened ESLint configuration for Node/script and service-worker runtime globals, including the service-worker `fetch` global.
- Promoted the React Refresh export rule from warning behavior to an error-compatible configuration and explicitly allowed the exported `useApp` hook.
- Kept strict TypeScript checks, typed linting, deterministic whitespace/line-ending format checks, tests, production build, secret scan, and high-severity dependency audit in CI.
- Added a temporary branch-only `Lockfile Once` workflow intended solely to generate and commit `package-lock.json` from a network-enabled GitHub runner because the execution sandbox could not access npm. This workflow must be removed once its purpose is complete.

### Testing

- Extended `tests/whatIf.test.ts` with weighted target planning, empty-category activation, invalid target input, and scenario helper coverage.
- Added `tests/gradeProperties.test.ts` with deterministic property-style tests for point-based and weighted grade invariants.
- Extended `tests/schema.test.ts` with duplicate identifiers, incomplete scales, empty course names, missing categories, duplicate category names, empty internal identifiers, missing grading scales, unsafe color values, and bounded course identity fields.
- Extended `tests/csv.test.ts` with secure formula-hardening round trips, intentional leading-apostrophe preservation, valid/invalid due dates, bounded imported names, and duplicate-header rejection.
- Added `tests/CourseForm.test.tsx` to prevent regression of category/assignment referential integrity.
- Extended `tests/validation.test.ts` for duplicate category names, duplicate grading thresholds/IDs, complete 0%-fallback coverage, missing categories, due-date validation, leap-day handling, and bounded text fields.
- Added `tests/Modal.test.tsx` for modal draft reset, controlled close callback semantics, and accessible dialog naming.
- Updated `tests/setup.ts` with a jsdom dialog lifecycle shim only when the environment lacks native `showModal` support.
- Extended `tests/storage.test.ts` with recovery-copy repair, corrupted-primary backup protection, and blocked-storage behavior.
- Added `tests/AppContext.test.tsx` to verify explicit local-data deletion leaves the GradeCraft storage keys removed through the reset operation.
- Extended `tests/App.test.tsx` with onboarding background isolation/focus behavior and the user-visible persistence-failure warning.
- Added `tests/WhatIfPage.test.tsx` for stale what-if route recovery.
- Added `tests/DataPage.test.tsx` for CSV course-selection recovery after full-data replacement.
- Added `tests/CoursePage.test.tsx` to ensure assignment undo cannot recreate a reference to a category removed after deletion.
- Added `tests/securityMetadata.test.ts` for browser security/referrer metadata.
- Added `tests/serviceWorkerSource.test.ts` for service-worker cache ownership, cache-read isolation, same-origin filtering, and scope filtering.
- Extended Playwright `e2e/core.spec.ts` with the primary weighted workflow: onboarding → create weighted course → add assignment → open what-if planner → calculate required target score.
- Extended Playwright with first-installed-service-worker offline reload coverage.
- Updated `docs/testing.md` with the expanded unit, property-style, integration, component, E2E, storage-resilience, security-metadata, cache-safety, accessibility, and PWA release checks.

### CI and repository quality

- Kept CI, E2E, CodeQL, Dependabot, release workflow, issue templates, PR template, funding configuration, documentation, secret scan, and npm audit steps.
- Added same-ref concurrency cancellation to CI, E2E, and CodeQL to reduce obsolete runs during a high-commit audit.
- The audit branch intentionally contains many small meaningful commits and should not be squash-merged if preserving the requested reviewable history is desired.
- PR #2 remains draft while release verification is incomplete.

### Documentation

- Updated `README.md` to include weighted target planning and accurate release-candidate features.
- Updated `CHANGELOG.md` with the additional reliability, data-integrity, CSV ambiguity, explicit-delete, browser-policy, PWA cache-isolation, accessibility, validation, testing, and dependency-hardening work.
- Updated `ROADMAP.md` to mark weighted target-score planning, deployment portability, and English catalog extraction complete.
- Updated `SECURITY.md` with current CSV/restore hardening, browser CSP/referrer posture, PWA cache/scope behavior, storage-failure behavior, secret handling, and production CSP guidance.
- Updated `docs/setup.md` with root/subpath PWA configuration and verification.
- Updated `docs/release.md` with deployment-base checks, first-visit offline validation, update/cache cleanup checks, and an explicit rule not to tag while release-candidate checks are merely pending or queued.
- Updated `docs/testing.md` with current regression, property-style, component, static security, cache-isolation, E2E, and PWA scope.
- Updated `docs/accessibility.md` with dialog naming, onboarding focus/background isolation, modal lifecycle behavior, and persistence alerts.
- Retained the required project/community/security/privacy/architecture/setup/development/testing/release/troubleshooting/accessibility/performance/ADR documentation set.

## Files/modules added or materially changed in this audit

### Domain/data/state

- `src/domain/whatIf.ts`
- `src/domain/validation.ts`
- `src/data/schema.ts`
- `src/data/csv.ts`
- `src/data/storage.ts`
- `src/state/AppContext.tsx`
- `src/i18n/en.ts`
- `src/i18n/system.ts`

### Application/UI

- `src/main.tsx`
- `src/App.tsx`
- `src/pages/WhatIfPage.tsx`
- `src/pages/DashboardPage.tsx`
- `src/pages/CoursePage.tsx`
- `src/pages/GpaPage.tsx`
- `src/pages/DataPage.tsx`
- `src/pages/SettingsPage.tsx`
- `src/pages/AboutPage.tsx`
- `src/components/AppShell.tsx`
- `src/components/Onboarding.tsx`
- `src/components/Modal.tsx`
- `src/components/GradeRing.tsx`
- `src/components/TrendChart.tsx`
- `src/components/ContributionChart.tsx`
- `src/components/AssignmentForm.tsx`
- `src/components/CourseForm.tsx`
- `index.html`

### Tests

- `tests/whatIf.test.ts`
- `tests/gradeProperties.test.ts`
- `tests/schema.test.ts`
- `tests/csv.test.ts`
- `tests/storage.test.ts`
- `tests/validation.test.ts`
- `tests/App.test.tsx`
- `tests/AppContext.test.tsx`
- `tests/CourseForm.test.tsx`
- `tests/CoursePage.test.tsx`
- `tests/Modal.test.tsx`
- `tests/WhatIfPage.test.tsx`
- `tests/DataPage.test.tsx`
- `tests/securityMetadata.test.ts`
- `tests/serviceWorkerSource.test.ts`
- `tests/setup.ts`
- `e2e/core.spec.ts`

### PWA/build/automation

- `public/sw.js`
- `public/manifest.webmanifest`
- `vite.config.ts`
- `package.json`
- `.env.example`
- `eslint.config.js`
- `.github/workflows/ci.yml`
- `.github/workflows/e2e.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/lockfile-once.yml`

### Documentation

- `README.md`
- `CHANGELOG.md`
- `ROADMAP.md`
- `SECURITY.md`
- `docs/setup.md`
- `docs/testing.md`
- `docs/release.md`
- `docs/accessibility.md`
- `what_changed.md`

## Verification

### Local execution environment

Previously confirmed toolchain:

- `node --version` → `v22.16.0`
- `npm --version` → `10.9.2`
- `git --version` → `2.47.3`

Environment limitations encountered during this project session:

- The execution sandbox could not resolve `github.com` for a normal `git clone`.
- npm registry access previously timed out and no useful npm cache was available, so a clean local dependency installation and lockfile generation could not be completed in this sandbox.
- Because dependencies could not be installed locally, do **not** treat local type/lint/test/build verification as completed.
- Repository changes were applied through the authenticated GitHub connector and inspected from GitHub after writes.

### GitHub Actions

GitHub Actions is the network-enabled verification path for this audit.

At audited code head `f13b54f0154ca1f5b1c3b40176e1088f19e6c4ff`, the latest head-specific runs inspected were:

- CI run `32221438583` — `pending` at last inspection.
- E2E run `32221438590` — `queued` at last inspection.
- CodeQL run `32221438577` — `pending` at last inspection.

Earlier rapid-commit runs were superseded by same-ref workflow concurrency cancellation. No passing state is claimed until the latest relevant runs actually conclude successfully. This handoff-document update itself creates a newer branch head and may therefore supersede the run IDs above; the next continuation must inspect the latest head-specific runs rather than assuming these older IDs remain authoritative.

### Lockfile status

- `package-lock.json` was still absent when last checked on `phase6/release-audit` after the additional audit commits.
- `.github/workflows/lockfile-once.yml` is a temporary branch-only helper that attempts `npm install --package-lock-only --ignore-scripts` on a GitHub runner and commits a generated lockfile using `Sanskar <sanskarin@outlook.in>`.
- Do not keep this temporary workflow in the final merged release once the lockfile has been generated and verified.
- Until a verified lockfile exists, CI/release documentation intentionally continues using `npm install`; after the lockfile is committed, switch deterministic installs to `npm ci` in separate meaningful commits.

### Commit identity

Raw GitHub commit metadata for previously inspected audit code head `85b67354156034122d2a95aaa51795ec6e1287be` reports both author and committer as:

- Name: `Sanskar`
- Email: `sanskarin@outlook.in`

Connector-created continuation commits use the requested repository identity configuration. Re-check raw metadata on the final merged commit before release if authorship auditing is required.

## Known limitations / open issues

1. **Latest CI/E2E/CodeQL are not yet green.** The branch remains a draft PR and must not be described as fully release-verified until the latest head-specific checks finish successfully.
2. **No committed `package-lock.json` yet.** Direct dependencies are exact-version pinned, but transitive reproducibility is incomplete until the generated lockfile is committed and verified.
3. **The temporary lockfile workflow must be removed.** `.github/workflows/lockfile-once.yml` exists only to work around the sandbox's lack of npm network access and should not ship in the final branch after it succeeds.
4. **Real release screenshots are not yet committed.** The README intentionally does not use fake screenshots; capture real UI images only after a verified production build/deployment exists.
5. **Branch protection and GitHub Discussions are repository settings.** Guidance/configuration exists in the repository, but these settings must be enabled through GitHub repository settings when desired.
6. **Localization packs beyond English are intentionally roadmap work.** The English catalog/extraction architecture is in place, but translated packs are not part of the 1.0 release candidate.
7. **No final release tag should be created yet.** Tagging is blocked by the incomplete head-specific quality/security verification above.
8. **CSP is a client-document baseline, not a substitute for production response headers.** Hosts with HTTP header control should test and deploy a stricter header-based CSP where practical.

## Next exact tasks

1. Read the current PR #2 head SHA after this handoff commit and inspect the latest head-specific CI, E2E, and CodeQL workflow runs.
2. If any job fails, inspect the failed job output and fix every type, lint, format, unit/integration/component test, build, browser/E2E, audit, or CodeQL failure with a focused regression commit.
3. Re-check whether `package-lock.json` was generated by the temporary `Lockfile Once` workflow. If it appears, inspect it against current `package.json` before treating it as valid.
4. Once a valid lockfile exists, delete `.github/workflows/lockfile-once.yml` in its own cleanup commit.
5. Change CI, E2E, release workflow, setup/release documentation, README install commands, and other deterministic-install instructions from `npm install` to `npm ci` where appropriate, then re-run all head-specific checks.
6. Perform final clean-checkout verification with the committed lockfile: dependency install, typecheck, lint, format check, secret scan, unit/integration/component coverage, production build, Playwright E2E, `npm audit --audit-level=high`, and CodeQL.
7. Run a manual accessibility pass on the verified build: keyboard-only onboarding/course/assignment/settings/import-export/dialog flows, focus visibility and return, 200% zoom, reduced motion, both themes, and at least one screen-reader core journey.
8. Verify production PWA behavior from a clean browser context: first-load worker claim, immediate offline reload, static asset availability, network restoration, new-release navigation shell refresh, GradeCraft-only obsolete-cache deletion, and no interaction with unrelated same-origin cache entries.
9. Capture real screenshots from the verified production build and add them to `docs/screenshots/`, then update README screenshot references and any release documentation that currently describes them as pending.
10. Audit documentation links, version references, release instructions, support/contact information, BMC link, MIT license, `Made by the Sanskar`, and repository URLs against the final build.
11. Mark PR #2 ready for review only after all release-candidate verification evidence is green.
12. Merge PR #2 with a strategy that preserves the meaningful atomic commit history rather than squashing it.
13. After merge, verify the `main` branch workflows from the merged commit.
14. Only after `main` is green, create the final release tag and verify the generated release artifact and hosted/static PWA smoke tests.
15. Close or otherwise retire superseded audit PR #1 only after PR #2 is safely merged and `main` verification is complete.

## Migration notes

- Current persisted schema version is `1`.
- This audit tightened validation but did not change the serialized schema shape, so no schema-version increment is required.
- Existing valid GradeCraft v1 data remains valid.
- Previously corrupted, unsafe, ambiguous, or internally inconsistent backup data may now be rejected instead of being accepted into application state.
- Rejection cases now include unsafe/non-hex course colors, impossible due dates, oversized bounded text fields, duplicate/empty IDs, duplicate category names, missing category/scale references, incomplete grading scales, empty scale collections, invalid weighted totals, invalid scores, and courses without categories.
- Any future persisted shape change must add an explicit migration and migration regression test.

## Release notes draft

GradeCraft 1.0 provides privacy-first local grade tracking, weighted and points-based grade calculations, custom grading scales, credit-weighted GPA, scenario-aware what-if planning, weighted target-score solving, charts, CSV/JSON portability, responsive themes, accessibility controls, configurable root/subpath PWA deployment, an offline-capable application shell, data-integrity validation, local persistence recovery, browser security metadata, cache ownership isolation, and automated quality/security workflows.

The Phase 6 audit additionally hardens restored-data invariants, CSV round trips and ambiguous headers, category referential integrity and naming, grading-scale completeness, calendar-date validation, bounded imported/persisted text, safe course-color restoration, blocked-storage behavior, explicit deletion semantics, user-visible persistence failures, stale route/data selections, native dialog lifecycle/accessibility, first-run focus isolation, first-install offline precaching, service-worker cache isolation/update/activation behavior, deployment portability, localization readiness, lint/runtime configuration, dependency patching, deterministic property-style grade tests, and expanded component/browser regression coverage.

This release-candidate text is a draft. Do not state that CI, CodeQL, E2E, npm audit, clean-checkout build, accessibility review, or release verification passed until those checks are actually completed on the final merged code and recorded here.

## Phase 6 audit commit history — initial audited sequence

The previous handoff explicitly recorded these first 56 meaningful audit commits over `main`:

1. `a9ee620` — feat: add weighted target score solver
2. `53926e3` — test: cover weighted target planning
3. `d9e9010` — feat: expose weighted target planning in what-if UI
4. `3a52376` — refactor: expand English message catalog
5. `4c8bc81` — refactor: externalize application shell strings
6. `6036b38` — refactor: externalize onboarding strings
7. `6e99d39` — refactor: add what-if message formatters
8. `0a22ebb` — refactor: externalize what-if planner strings
9. `cba5b75` — docs: document weighted target planning
10. `2c0c33c` — fix: include scenario overrides in target planning
11. `e76121b` — fix: reject duplicate persisted entity identifiers
12. `730de24` — test: cover persisted identifier collisions
13. `08f6ed4` — fix: preserve CSV text during formula hardening
14. `18406db` — test: cover secure CSV round trips
15. `d0ffd96` — fix: protect course category references
16. `a6a7daf` — test: guard categories with existing assignments
17. `1d36de9` — fix: reject ambiguous grading scale bands
18. `906acd5` — test: cover grading scale ambiguity
19. `1384402` — fix: require complete grading scale coverage
20. `80ef45f` — test: require complete grading scale coverage
21. `9b8fccc` — fix: enforce domain invariants on restored data
22. `4faf6ec` — test: cover restored domain invariants
23. `a147755` — ci: cancel superseded quality runs
24. `63e3c7f` — ci: cancel superseded browser runs
25. `da311b1` — ci: cancel superseded CodeQL runs
26. `6365b6c` — refactor: centralize remaining English UI messages
27. `4f3f4c4` — refactor: externalize modal accessibility text
28. `c7fd2f9` — refactor: externalize grade ring fallback text
29. `55a9b15` — refactor: externalize trend chart messages
30. `273819d` — refactor: externalize contribution chart messages
31. `0844951` — refactor: externalize assignment form strings
32. `01a3977` — refactor: externalize course form strings
33. `1646dad` — refactor: externalize dashboard strings
34. `9f39dbc` — refactor: externalize GPA page strings
35. `fa50085` — refactor: externalize About page strings
36. `c361287` — refactor: externalize data transfer strings
37. `f3a0040` — refactor: externalize settings strings
38. `74cbeb5` — refactor: externalize course detail strings
39. `f7c422c` — test: cover weighted planning user journey
40. `98b8384` — build: support configurable deployment base path
41. `f84d504` — docs: document deployment base path setting
42. `c4c0534` — build: make static app metadata base-path aware
43. `8edbb22` — build: register service worker within deployment base
44. `9a80eb3` — build: make PWA manifest subpath portable
45. `e674dcf` — fix: refresh navigation shell without breaking offline mode
46. `4591f26` — docs: mark weighted planning refinement complete
47. `ccb6124` — docs: record release audit improvements
48. `e768cb8` — docs: explain portable PWA deployment setup
49. `96ace3b` — fix: select a positive-weight planning category
50. `d28a38e` — docs: add release base-path verification
51. `d4ba488` — build: harden lint configuration for runtime globals
52. `49b4f05` — docs: expand release-candidate testing coverage
53. `b3d11d0` — fix: require at least one course category
54. `dd3ea39` — test: cover missing category validation
55. `f26ef9e` — fix: reject empty persisted entity identifiers
56. `86fa91b` — test: cover empty restored identifiers and categories

## Phase 6 audit commit history — continued work recorded after the previous handoff

The following continuation commits are explicitly verified from this session's GitHub writes/inspection. PR #2 reported **128 commits over `main`** at audited code head `f13b54f0154ca1f5b1c3b40176e1088f19e6c4ff`; the PR commit graph is authoritative for any intermediary audit commits not enumerated in the earlier handoff list or this continuation list.

1. `99a46ae` — fix: handle service worker registration failures safely
2. `f4abeb7` — ci: generate reproducible npm lockfile
3. `f15e3a9` — fix: declare service worker fetch global
4. `36f4cde` — fix: reset modal form state after closing
5. `ecad27b` — test: emulate dialog lifecycle in jsdom
6. `f8e8b58` — test: cover modal draft reset regression
7. `176461b` — fix: avoid duplicate modal close callbacks
8. `e6c2214` — test: cover controlled modal close semantics
9. `f2786ca` — build: patch Vite security advisories
10. `2899e7e` — fix: require a usable grading scale after restore
11. `02cec8b` — test: reject backups without grading scales
12. `54688d3` — a11y: give dialogs explicit accessible names
13. `59dc3d2` — test: verify dialog accessible naming
14. `1b993d2` — test: add deterministic grade property coverage
15. `243f4dd` — fix: validate assignment calendar dates
16. `8407956` — test: cover assignment date validation
17. `109be53` — fix: reject malformed CSV due dates
18. `579f008` — test: cover CSV due date validation
19. `1f74a20` — fix: validate assignment form due dates
20. `bf818bf` — fix: preserve valid recovery data during storage repair
21. `0877171` — fix: recover when browser storage is inaccessible
22. `9acfee4` — test: cover storage recovery and access failures
23. `a3b511f` — perf: precache built PWA assets during service worker install
24. `a4255fa` — test: verify first-visit PWA offline shell
25. `2f92297` — a11y: isolate onboarding from background controls
26. `26d4dc0` — test: verify onboarding focus isolation
27. `6484fd5` — feat: expose local persistence failure state
28. `3bb7a4c` — refactor: externalize persistence warning text
29. `22feee6` — feat: warn when browser storage cannot persist changes
30. `f181081` — test: cover persistence failure warning
31. `f3aa590` — fix: keep CSV course selection valid after restore
32. `bb0dd94` — fix: recover invalid what-if course routes
33. `6c70a19` — test: cover stale what-if course routes
34. `3721ea5` — test: cover CSV selection after data restore
35. `67c2c11` — security: restrict restored course colors to safe hex values
36. `2ec40e2` — test: reject unsafe restored course colors
37. `72cbc9a` — security: bound persisted user text lengths
38. `ec40e88` — security: bound restored course identity fields
39. `703b5de` — refactor: share bounded course input limits
40. `b3257f9` — refactor: share bounded assignment input limits
41. `fb9ae48` — refactor: share grading scale input limits
42. `7f6f3ab` — security: bound imported CSV text fields
43. `e0cf68d` — test: cover bounded domain text validation
44. `626f664` — test: cover bounded CSV text validation
45. `f159406` — test: cover bounded restored course identity
46. `e1b0305` — fix: await PWA client claiming during activation
47. `4082a33` — docs: record final audit reliability and security fixes
48. `91bed0a` — docs: expand final audit testing strategy
49. `4be69c7` — docs: document onboarding and dialog accessibility hardening
50. `85b6735` — docs: strengthen offline release verification
51. `4398a9b` — docs: refresh complete Phase 6 audit handoff
52. `70e254e` — fix: reject ambiguous duplicate CSV headers
53. `9d5c140` — test: cover duplicate CSV header rejection
54. `fec5f09` — fix: reject ambiguous duplicate category names
55. `35d97f6` — test: cover duplicate category name validation
56. `578d930` — test: reject duplicate restored category names
57. `eb40fc3` — security: add client security and referrer policies
58. `135d431` — test: verify browser security metadata
59. `104d97a` — fix: keep Vite development compatible with CSP
60. `7a3cd3b` — docs: document hardened client security posture
61. `f32b9c8` — fix: only delete GradeCraft service worker caches
62. `d884a57` — test: guard service worker cache ownership
63. `5acb924` — fix: isolate runtime reads to GradeCraft cache
64. `2aa09bd` — test: verify isolated service worker cache reads
65. `7c3c769` — fix: keep explicit local data deletion cleared
66. `fa9b373` — test: verify explicit local data deletion stays cleared
67. `43cd1d4` — fix: invalidate unsafe assignment undo after category removal
68. `231174a` — test: protect undo after course category changes
69. `eecf8bd` — docs: record final data and PWA audit fixes
70. `f13b54f` — docs: cover final regression and cache safety tests

## Earlier baseline commits

- `37a3dcd` — build: configure TypeScript React PWA toolchain
- `425a827` — feat: define grade domain models and defaults
- `8b263aa` — feat: implement grade calculations and validation
- `e4cdfcb` — feat: add GPA and what-if planning engines
- `0b10a54` — feat: add validated local persistence and migrations
- `eca7b84` — feat: add secure CSV and backup portability
- `19251ed` — feat: add offline PWA platform foundation
- `bc65d7d` — feat: wire persistent app state and navigation shell
- `5f9680f` — feat: add onboarding and editable grade forms
- `b284232` — feat: add accessible grade visualizations
- `66e0bda` — feat: build course dashboard and assignment workflows
- `65166f6` — feat: add what-if planning and GPA views
- `953ece5` — feat: add privacy data settings and about surfaces
- `9f0fe81` — feat: integrate polished responsive application experience
- `a9cf3eb` — test: cover grade domain data and app boundaries
- `74ce1c7` — test: add browser onboarding journey
- `68e3747` — docs: add project community and product documentation
- `4c8150e` — docs: record architecture testing and operations guidance
- `68e8300` — chore: add GitHub community templates and funding
- `5c81a0a` — ci: add quality security e2e and release workflows
- `1177bf7` — docs: add implementation handoff and audit status
