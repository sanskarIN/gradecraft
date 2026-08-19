# GradeCraft Work Handoff

## Current milestone

**Package version:** 1.0.0  
**Release state:** 1.0.0 baseline plus an Unreleased release-hardening/product-refinement set  
**Phase:** Phase 6 engineering audit complete; positive runner/browser/publication evidence still required before tagging  
**Date:** 2026-08-19

## Product and engineering work completed

- TypeScript + React privacy-first PWA architecture.
- Weighted and points-based grade calculation with inactive-category renormalization.
- Custom courses, categories, category weights, assignments, credit hours, and grading-scale profiles.
- Assignment create/edit/delete with undo for assignment removal.
- Validation for impossible scores, invalid/ambiguous categories, duplicate IDs/thresholds, missing grade-scale floor, and invalid weighted totals.
- Temporary what-if score overrides that do not mutate saved grades.
- Target-score solving for both points-mode courses and weighted categories, including future activation of an empty weighted category.
- Credit-weighted GPA using each course's selected user-defined grading scale.
- Native score-trend and category-contribution charts.
- Optional semester metadata with dashboard grouping, filtering, and search.
- English and Hindi typed message catalogs with persisted language selection and document-language synchronization.
- Privacy-first Local Storage persistence with schema validation, migration boundary, recovery copy, corrupt-primary repair, and corrupt-state cleanup.
- Explicit local-data deletion controls.
- Versioned JSON backup/restore with destructive-restore confirmation.
- CSV export/import with spreadsheet-formula neutralization, numeric/range validation, arbitrary header mapping, common alias suggestions, and staged review before mutation.
- Provider-agnostic encrypted backup files using browser Web Crypto, authenticated encryption, passphrase clearing, tamper rejection, and no provider credentials.
- Guarded grading-scale deletion that blocks in-use and last-profile removal.
- Guarded category deletion that prevents orphaned assignment references.
- Responsive shell, onboarding, light/dark/system theme, reduced motion, compact mode, offline state, accessible forms, focus styles, semantic tables, screen-reader labels, and application-level error recovery.
- PWA manifest, editable SVG icon source, subpath-safe assets, service-worker registration from the deployment base, network-first navigation refresh, and cached-shell offline fallback.
- About/Support/Funding surfaces with MIT license, repository identity, contacts, Buy Me a Coffee, and **Made by the Sanskar**.
- Unit/domain, data, component, regression, deterministic property-style, and Playwright browser tests.
- CI, E2E, CodeQL, Dependabot, release workflow, issue templates, pull-request template, funding configuration, and repository guidance.
- Complete project/security/privacy/architecture/setup/development/testing/release/troubleshooting/accessibility/performance/ADR documentation.

## Final audit and release-hardening work in this continuation

- Added documentation-link validation to the main CI workflow so CI matches the documented quality contract.
- Added `scripts/check-release-gate.mjs` and `npm run release:gate` to verify required repository/docs/community files, semantic version shape, package scripts, README identity/support markers, CI gates, and release-workflow wiring.
- Added deterministic property-style tests that exercise 200 generated grade cases, feasible points-target solver consistency, weighted solver consistency, and CSV round trips for punctuation, spreadsheet-sensitive prefixes, apostrophes, Hindi Unicode, and other labels.
- Fixed the new points-target property generator so it samples only the mathematically reachable interval rather than creating false CI failures for impossible targets.
- Added `scripts/check-bundle-budget.mjs` and `npm run perf:budget` with hard uncompressed release budgets: 500 KiB per JavaScript asset, 150 KiB per CSS asset, and 750 KiB total `dist/` size.
- Added the release gate and bundle budget to `npm run verify` and main CI.
- Added coverage-report artifact preservation to CI.
- Added Playwright HTML-report preservation to the E2E workflow.
- Added `docs/release-readiness.md` as an explicit evidence matrix separating automated repository gates from manual/browser/deployment evidence.
- Expanded release-gate coverage to required root configuration, community files, ADRs, PWA files, and branding assets.
- Added `scripts/check-release-tag.mjs` and `npm run release:tag -- vX.Y.Z` so a tag must exactly match `package.json`.
- Added a Playwright prebuilt mode so release E2E can test the already verified production artifact instead of overwriting it with an unnecessary second build.
- Hardened tag releases to validate the tag, run the full verification suite, run `npm audit --audit-level=high`, install Chromium, execute E2E against the verified `dist/`, preserve the release Playwright report, and only then package/publish the zip.
- Removed the old redundant standalone build from the release workflow.
- Updated README, development, testing, performance, release, roadmap, and changelog documentation to match the final implementation and gates.
- Confirmed the repository issue search returns no open issues.
- Confirmed repository code search returns no `TODO`, `FIXME`, `not implemented`, or placeholder markers.

## Verification evidence available in this execution

Local toolchain observed:

- `node --version` → `v22.16.0`
- `npm --version` → `10.9.2`
- `tsc --version` → `5.8.3`

Standalone final-audit script checks performed locally:

- `node --check` passed for the release-tag validator.
- `node --check` passed for the bundle-budget validator.
- `node --check` passed for the release-readiness validator.
- Release-tag validation was exercised with `v1.0.0` against a `1.0.0` package and passed.
- Release-tag validation was exercised with mismatched `v1.0.1` against a `1.0.0` package and correctly failed.
- Bundle-budget validation was exercised with tiny JS/CSS artifacts and passed.
- Bundle-budget validation was exercised with a 600 KiB JS artifact and correctly failed the 500 KiB per-file limit.
- The release-readiness validator was exercised against a complete synthetic repository fixture and passed with 36 required files and 12 required package scripts.
- The same release-readiness validator correctly failed when `SECURITY.md` was removed from that fixture.

Changed TypeScript/core-domain evidence:

- The changed deterministic property-test surface passed an isolated strict TypeScript compile using the observed local TypeScript compiler and compatible local module stubs.
- The actual repository implementations of `gradeMath.ts`, `whatIf.ts`, and `csv.ts` were compiled together and executed in a dependency-free deterministic harness.
- That harness passed **200 generated grade cases**, **100 feasible points-target solver cases**, **3 weighted-target solver cases**, and **9 CSV label round trips** covering commas, embedded quotes, formula-sensitive prefixes, apostrophes, and Hindi Unicode.

Execution-environment limitation:

- The available container cannot resolve `github.com`, so a fresh clone/dependency installation of the full repository cannot be performed in this execution environment.
- The GitHub connector's commit-workflow lookup is limited to pull-request-triggered runs; querying the latest direct-push commit returned no workflow runs. That empty result is **not** treated as evidence that CI passed.
- Therefore this handoff does not claim that the full dependency-backed `npm run verify`, `npm run test:e2e`, or `npm audit --audit-level=high` passed for the exact latest commit until positive clean-runner/GitHub Actions evidence is inspected.

## Known limitations / external publication work

These are not missing application features; they require repository settings, a real browser/build runner, or a deployed site:

1. Inspect positive CI, E2E, CodeQL, and dependency results for the exact release commit before tagging.
2. Capture real screenshots from the positively verified production build and place them in `docs/screenshots/`.
3. Publish and smoke-test a hosted demo only if a public demo is desired; do not add an unverified URL.
4. Enable/confirm branch protection and GitHub Discussions through repository settings if desired; the repository contains guidance/templates but connector file commits cannot enforce those settings.
5. The GitHub file-write connector does not expose author/committer email fields, so requested `sanskarin@outlook.in` is documented throughout the repository but connector-created commit metadata may use the connected GitHub identity.

## Open issues

- GitHub open-issue search at the end of this audit: **none**.
- No known blocker/critical application defect remains from the repository audit.
- Do not convert missing CI/browser evidence into a claim of a green release.

## Next exact release-operator steps

1. From a network-enabled clean checkout, run `npm install` and `npm run verify`.
2. Run `npx playwright install --with-deps chromium`, `npm run test:e2e`, and `npm audit --audit-level=high`.
3. Inspect the corresponding GitHub CI/E2E/CodeQL results and retained coverage/Playwright artifacts.
4. Perform the manual smoke/accessibility/PWA checklist in `docs/release.md` and `docs/release-readiness.md`.
5. Capture real screenshots from that verified production build.
6. When actually cutting a release, move the intended Unreleased changelog entries into the chosen version, update `package.json`, validate with `npm run release:tag -- vX.Y.Z`, and push that matching tag.

No additional product feature should be added merely to increase feature or commit count. Future work should be driven by a real bug, a measured performance/accessibility finding, a user-requested feature, or release evidence.

## Migration notes

Application schema version remains `1`. Current optional additions are backward-compatible with older valid v1 records. Any future breaking persistence change must add an explicit migration and migration fixture tests. Encrypted-backup envelope versioning remains independent from application-schema versioning.

## Release notes draft

GradeCraft's current Unreleased set adds weighted target-score planning, semester organization and dashboard search, English/Hindi localization, provider-agnostic authenticated encrypted backups, staged arbitrary-header CSV mapping, stronger storage/recovery and destructive-action safeguards, subpath-safe PWA updates, expanded E2E/regression/property coverage, executable documentation/release/performance gates, CI diagnostic artifacts, and a release workflow gated by tag/version consistency, dependency audit, and Chromium E2E.

## Recent meaningful commits from this final audit

- `a0ac632` — ci: enforce documentation link validation
- `66fa624` — build: add deterministic release readiness gate
- `a33330e` — build: wire release gate into verification
- `6ac2486` — ci: enforce release readiness gate
- `7d89146` — test: add deterministic property coverage for grade engines
- `508596f` — perf: add production bundle size budgets
- `03d4546` — build: enforce production performance budget
- `481f0d3` — ci: enforce production bundle budget
- `d3e39bd` — build: require performance checks in release gate
- `e1dd747` — ci: remove duplicate release build
- `38a2a4b` — docs: document property and release-gate verification
- `77af20b` — docs: define executable bundle performance budgets
- `9e18b32` — docs: tighten final release verification process
- `4c0f142` — ci: preserve Playwright diagnostics
- `1285f1d` — ci: publish coverage evidence
- `3484d69` — docs: add release readiness evidence matrix
- `84ffd45` — build: cover repository configuration in release gate
- `7246b02` — docs: expose final quality and release gates
- `a498784` — build: validate release tag against package version
- `92d8970` — build: expose release tag validation command
- `b9ad873` — test: allow E2E against prebuilt release artifact
- `eae3f63` — ci: gate releases on tag audit and browser tests
- `97a7fa9` — build: enforce tag and browser release controls
- `4e7b6ca` — ci: preserve release E2E diagnostics
- `e714535` — docs: record final release hardening work
- `6d36293` — docs: mark engineering roadmap final audit complete
- `b592760` — fix: constrain property targets to reachable grades
- `c9a4dbe` — docs: align development commands with final gates
- `c47b322` — docs: finalize GradeCraft release audit handoff
