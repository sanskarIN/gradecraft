# GradeCraft Work Handoff

## Current milestone

**Package version:** 2.0.12  
**Release state:** 2.0.12 release-candidate metadata prepared; positive clean-runner and browser evidence is still required before tagging  
**Date:** 2026-08-19

## Completed product scope

GradeCraft is a privacy-first TypeScript + React PWA with weighted and points grading, custom courses/categories/assignments/scales, GPA, what-if planning, weighted target-score solving, semester organization/search, charts, English/Hindi localization, local persistence/recovery, JSON and CSV portability, encrypted backup files, PWA offline support, accessibility preferences, responsive layouts, and open-source project/community documentation.

The repository also includes unit/domain/data/component/property tests, Playwright browser journeys, CI, E2E, CodeQL, Dependabot, release automation, documentation-link checks, secret checks, release-readiness checks, production bundle budgets, release tag validation, coverage artifacts, and Playwright diagnostics.

## Version 2.0.12 continuation

- Fixed the About screen so it no longer depends on a hardcoded `GradeCraft 1.0.0` localization value.
- The About screen now derives its displayed application version directly from `package.json`.
- Removed hardcoded semantic-version strings from the English and Hindi message catalogs.
- Added `scripts/check-version-sync.mjs` and `npm run version:check`.
- The version gate checks semantic-version validity, a dated matching `CHANGELOG.md` release heading, this handoff's package version, package-derived About version wiring, and absence of hardcoded GradeCraft semantic versions in localization catalogs.
- Added `version:check` to `npm run verify` and the CI workflow.
- Expanded `release:gate` so the version-check file, script, and CI invocation are required release infrastructure.
- Prepared package/changelog/handoff metadata atomically for **2.0.12** so `main` does not contain a partially bumped release state.

## Existing final-audit safeguards retained in 2.0.12

- Documentation links are verified locally and in CI.
- The release-readiness gate checks required files, scripts, community files, PWA files, CI wiring, release wiring, and project identity/support markers.
- Production JavaScript/CSS/total bundle sizes are subject to executable budgets.
- Release tags must match `package.json` exactly.
- Tag releases run the full verification suite, dependency audit, Chromium E2E against the already verified production build, retain diagnostics, and package only after gates pass.
- Deterministic property coverage exercises generated grade calculations, target-score solvers, and CSV edge-label round trips.

## Prior deterministic evidence

The previous final audit recorded a dependency-free harness that passed **200 generated grade cases**, **100 feasible points-target cases**, **3 weighted-target cases**, and **9 CSV label round trips**, plus isolated strict TypeScript compilation of the changed property-test surface and standalone fixture checks for release-tag, bundle-budget, and release-readiness scripts.

That prior evidence remains useful regression evidence but does not replace positive full verification for the exact 2.0.12 commit.

## Exact 2.0.12 release gates

Run from a clean network-enabled checkout:

```bash
npm install
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
npm run release:tag -- v2.0.12
```

Do not label the exact 2.0.12 candidate green until these checks and the corresponding GitHub Actions/CodeQL evidence are positively visible.

## Remaining external publication work

1. Inspect positive CI, E2E, CodeQL, dependency-audit, version-sync, release-gate, and bundle-budget results for the exact release commit.
2. Capture real screenshots from the positively verified production build and place them in `docs/screenshots/`.
3. Publish a hosted demo only if desired and only after smoke-testing that exact deployment.
4. Confirm repository settings such as branch protection/Discussions separately if desired.

These are release evidence or repository-setting tasks, not known missing core application features.

## Open issues

- Latest audited open-issue search: **none**.
- No known blocker/critical product defect remains from the repository audit.

## Migration notes

Application schema version remains `1`. Package version 2.0.12 does not require a persistence migration. Future breaking persistence changes must add explicit migrations and migration tests.

## 2.0.12 release notes draft

GradeCraft 2.0.12 packages the completed privacy-first grade-management experience with weighted target planning, semester organization/search, English/Hindi localization, authenticated portable backups, staged flexible CSV import, stronger data-integrity safeguards, subpath-safe PWA updates, expanded automated tests, executable release/performance gates, diagnostic CI artifacts, tag/version enforcement, and package-derived user-visible versioning protected by a synchronization gate.

## Recent 2.0.12 preparation commits

- `297a12f` — fix: derive About version from package metadata
- `d381f5f` — refactor: remove hardcoded English app version
- `151eae9` — refactor: remove hardcoded Hindi app version
- `2ea1ba4` — build: add package version synchronization gate
- `1afe748` — build: enforce version synchronization during verification
- `61b2c16` — ci: enforce version synchronization
- `8d5134c` — build: require version gate in release readiness
