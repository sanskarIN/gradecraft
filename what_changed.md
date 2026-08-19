# GradeCraft Work Handoff

## Current milestone

**Version:** 1.0.0 release-candidate + Phase 6 audit branch  
**Phase:** Phase 6 — final audit and release verification  
**Date:** 2026-08-19  
**Working branch:** `phase6/release-audit`  
**Pull request:** #2 — `feat: complete weighted planning and release audit`  
**PR state:** Open, draft, mergeable  
**Current audited code head before this handoff update:** `86fa91b5c106e8bcb95bafb9b0972313a335b9e2`

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
- Hardened grading-scale validation against duplicate band IDs, duplicate labels, duplicate thresholds, incomplete scales without a 0% fallback band, and out-of-range GPA values.

### Persistence and data integrity

- Kept privacy-first browser Local Storage persistence with recovery copy behavior and explicit delete controls.
- Hardened backup/restore schema validation so restored data must satisfy domain invariants instead of only structural checks.
- Rejects duplicate course, category, assignment, grading-scale, and grade-band identifiers.
- Rejects empty persisted entity identifiers and unknown grading-scale references.
- Rejects assignments referring to missing categories.
- Rejects invalid weighted totals, invalid assignments, incomplete grading scales, empty course names, and courses without categories during restore.
- Course editing now prevents removal of a category that still owns assignments, preventing orphaned assignment references.
- Kept explicit schema version `1` and migration entry point for future versions.

### CSV and backup safety

- Kept JSON full backup/restore and CSV assignment import/export.
- Kept spreadsheet-formula neutralization on exported CSV cells.
- Fixed protected CSV text round trips so neutralized values are restored correctly on GradeCraft re-import.
- Preserved legitimate user text that intentionally starts with an apostrophe.
- Kept quoted-field parsing, score validation, category-weight validation, file-size limits, and browser-local parsing.

### UI, accessibility, and localization readiness

- Kept responsive phone/tablet/desktop layouts, onboarding, light/dark/system theme, compact mode, reduced motion, focus visibility, semantic forms/tables, native dialogs, and offline states.
- Centralized the remaining major English UI messages in `src/i18n/en.ts`.
- Externalized application-shell, onboarding, dashboard, course, assignment-form, course-form, GPA, what-if, data-transfer, settings, About, modal, grade-ring, trend-chart, and contribution-chart text.
- Added descriptive assignment Edit/Delete accessible names.
- Improved chart semantics and preserved non-color textual values.
- Kept the required `Made by the Sanskar` credit and contact/funding links.

### PWA and deployment

- Kept the manifest, editable SVG icon source, service worker, offline shell, and production-only service-worker registration.
- Added `VITE_BASE_PATH` deployment configuration so GradeCraft can be built for root hosting or a repository subpath.
- Made manifest/icon references and service-worker registration base-path aware.
- Made the manifest start URL and scope relative to its deployment location.
- Reworked the service-worker navigation strategy so application updates can refresh the navigation shell while a cached shell remains available offline.
- Scoped service-worker handling to same-origin requests inside the registration scope.
- Bumped the shell cache key and kept old-cache cleanup on activation.

### Testing

- Extended `tests/whatIf.test.ts` with weighted target planning, empty-category activation, invalid target input, and existing scenario helper coverage.
- Extended `tests/schema.test.ts` with duplicate identifiers, incomplete scales, empty course names, missing categories, and empty internal identifiers.
- Extended `tests/csv.test.ts` with secure formula-hardening round trips and intentional leading-apostrophe preservation.
- Added `tests/CourseForm.test.tsx` to prevent regression of category/assignment referential integrity.
- Extended `tests/validation.test.ts` for duplicate grading thresholds/IDs, complete 0%-fallback coverage, and missing categories.
- Extended Playwright `e2e/core.spec.ts` with the primary weighted workflow: onboarding → create weighted course → add assignment → open what-if planner → calculate required target score.
- Updated `docs/testing.md` with the expanded unit, integration, component, E2E, and PWA release checks.

### CI and repository quality

- Kept CI, E2E, CodeQL, Dependabot, release workflow, issue templates, PR template, funding configuration, documentation, secret scan, and npm audit steps.
- Added same-ref concurrency cancellation to CI, E2E, and CodeQL to reduce obsolete runs during a high-commit audit.
- Hardened ESLint configuration for Node/script and service-worker runtime globals.
- Promoted the React Refresh export rule from a warning to an error-compatible configuration and explicitly allowed the `useApp` hook export.
- Kept strict TypeScript checks, typed linting, deterministic whitespace/line-ending format checks, tests, production build, secret scan, and high-severity dependency audit in CI.

### Documentation

- Updated `README.md` to include weighted target planning and accurate release-candidate features.
- Updated `CHANGELOG.md` with Phase 6 audit additions, changes, and fixes.
- Updated `ROADMAP.md` to mark weighted target-score planning, deployment portability, and English catalog extraction complete.
- Updated `docs/setup.md` with root/subpath PWA configuration and verification.
- Updated `docs/release.md` with deployment-base and offline/update smoke checks.
- Updated `docs/testing.md` with current regression and E2E scope.
- Retained the required project/community/security/privacy/architecture/setup/development/testing/release/troubleshooting/accessibility/performance/ADR documentation set.

## Files/modules added or materially changed in this audit

- `src/domain/whatIf.ts`
- `src/domain/validation.ts`
- `src/data/schema.ts`
- `src/data/csv.ts`
- `src/i18n/en.ts`
- `src/main.tsx`
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
- `tests/whatIf.test.ts`
- `tests/schema.test.ts`
- `tests/csv.test.ts`
- `tests/validation.test.ts`
- `tests/CourseForm.test.tsx`
- `e2e/core.spec.ts`
- `public/sw.js`
- `public/manifest.webmanifest`
- `index.html`
- `vite.config.ts`
- `.env.example`
- `eslint.config.js`
- `.github/workflows/ci.yml`
- `.github/workflows/e2e.yml`
- `.github/workflows/codeql.yml`
- `README.md`
- `CHANGELOG.md`
- `ROADMAP.md`
- `docs/setup.md`
- `docs/testing.md`
- `docs/release.md`
- `what_changed.md`

## Verification

### Local execution environment

Previously confirmed toolchain:

- `node --version` → `v22.16.0`
- `npm --version` → `10.9.2`
- `git --version` → `2.47.3`

Environment limitations encountered during this project session:

- The execution sandbox could not resolve `github.com` for a normal `git clone`.
- npm registry access previously timed out, so a clean local dependency installation and lockfile generation could not be completed in this sandbox.
- Because dependencies could not be installed locally, do **not** treat local type/lint/test/build verification as completed.

### GitHub Actions

GitHub Actions is the network-enabled verification path for this audit.

At audited code head `86fa91b5c106e8bcb95bafb9b0972313a335b9e2`, the current PR-triggered runs were created as:

- CI run `32217789942` — `pending` at last inspection.
- E2E run `32217789939` — `pending` at last inspection.
- CodeQL run `32217789940` — `pending` at last inspection.

Earlier rapid-commit runs were superseded; workflow concurrency cancellation is now configured. No passing state is claimed until the latest relevant runs actually conclude successfully.

### Commit identity

GitHub Actions run metadata for audit commit `d4ba48864eb2b18c71506b765b4f5c0523b825be` reports both the head commit author and committer as:

- Name: `Sanskar`
- Email: `sanskarin@outlook.in`

This confirms the requested commit email is present in the Git metadata exposed by GitHub for connector-created audit commits.

## Known limitations / open issues

1. **Latest CI/E2E/CodeQL are still pending.** The branch remains a draft PR and must not be described as fully release-verified until those checks finish successfully.
2. **No committed `package-lock.json` yet.** Direct dependencies are exact-version pinned, but a lockfile should be generated and committed from a network-enabled npm install before the final release tag for stronger transitive reproducibility.
3. **Real release screenshots are not yet committed.** The README intentionally does not use fake screenshots; capture real UI images only after a verified build/deployment.
4. **Branch protection and GitHub Discussions are repository settings.** Guidance/configuration exists in the repository, but these settings must be enabled through GitHub repository settings when desired.
5. **Localization packs beyond English are intentionally roadmap work.** The English message catalog and extraction baseline are now substantially complete.

## Next exact tasks

1. Re-check CI run `32217789942`, E2E run `32217789939`, and CodeQL run `32217789940` for the audited code head.
2. If any job fails, inspect its job logs and fix every type, lint, format, test, build, browser, audit, or CodeQL failure with a regression commit.
3. Generate and commit `package-lock.json` from a successful network-enabled `npm install`, then change CI/release installation to `npm ci` if the resulting lockfile is committed and verified.
4. After all release-candidate checks pass, capture real screenshots from the verified build and add them to `docs/screenshots/` plus README.
5. Re-run final clean-checkout verification and audit repository links/documentation against the actual build.
6. Mark PR #2 ready only after verification evidence is green; merge with a normal merge/rebase strategy that preserves the meaningful atomic commit history rather than squashing it.
7. After merge, verify the `main` branch workflows and only then create a final release tag.

## Migration notes

- Current persisted schema version is `1`.
- This audit tightened validation but did not change the serialized schema shape, so no schema-version increment is required.
- Existing valid GradeCraft v1 data remains valid.
- Previously corrupted or internally inconsistent backup data may now be rejected instead of being accepted into application state.
- Any future persisted shape change must add an explicit migration and migration regression test.

## Release notes draft

GradeCraft 1.0 provides privacy-first local grade tracking, weighted and points-based grade calculations, custom grading scales, credit-weighted GPA, scenario-aware what-if planning, weighted target-score solving, charts, CSV/JSON portability, responsive themes, accessibility controls, a configurable offline PWA shell, security/data-integrity validation, and automated quality/security workflows.

The Phase 6 audit additionally hardens restored-data invariants, CSV round trips, category referential integrity, grading-scale completeness, service-worker updates, deployment portability, localization readiness, lint/runtime configuration, and primary browser journey coverage.

## Phase 6 audit commit history

The audit branch currently contains 56 meaningful commits over `main` before this handoff commit:

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
