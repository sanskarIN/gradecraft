# GradeCraft Work Handoff

## Current milestone

**Package version:** 2.0.12  
**Release state:** 2.0.12 release-candidate metadata and final repository hardening prepared; positive clean-runner/browser evidence is still required before tagging  
**Date:** 2026-08-19

## Completed product scope

GradeCraft is a privacy-first TypeScript + React PWA with weighted and points grading, custom courses/categories/assignments/scales, GPA, what-if planning, weighted target-score solving, semester organization/search, charts, English/Hindi localization, local persistence/recovery, JSON and CSV portability, encrypted backup files, PWA offline support, accessibility preferences, responsive layouts, and open-source project/community documentation.

The repository includes unit/domain/data/component/property tests, Playwright browser journeys, CI, E2E, CodeQL, Dependabot, release automation, documentation-link checks, secret checks, release-readiness checks, version synchronization, production bundle budgets, release tag validation, coverage artifacts, and Playwright diagnostics.

## Version 2.0.12 continuation

- Fixed the About screen so it no longer depends on a hardcoded `GradeCraft 1.0.0` localization value.
- The About screen now derives its displayed application version directly from `package.json`.
- Removed hardcoded semantic-version strings from the English and Hindi message catalogs.
- Added `scripts/check-version-sync.mjs` and `npm run version:check`.
- The version gate checks semantic-version validity, a dated matching `CHANGELOG.md` release heading, this handoff's package version, package-derived About version wiring, and absence of hardcoded GradeCraft semantic versions in localization catalogs.
- Added `version:check` to `npm run verify` and the CI workflow.
- Expanded `release:gate` so the version-check file, script, and CI invocation are required release infrastructure.
- Prepared package/changelog/handoff metadata atomically for **2.0.12** so `main` never contained a partially bumped release state.
- Updated README, development, release-readiness, release process, roadmap, and changelog documentation for the 2.0.12 workflow.
- Hardened CSV spreadsheet-export neutralization so tab, carriage-return, and line-feed prefixes are protected in addition to `=`, `+`, `-`, and `@`.
- Preserved GradeCraft CSV round trips for those protected control-prefixed labels.
- Added focused CSV regression coverage and extended deterministic property coverage with tab/newline/carriage-return prefix cases.
- Updated `SECURITY.md` and the 2.0.12 changelog with the expanded CSV boundary protection.

## Existing final-audit safeguards retained in 2.0.12

- Documentation links are verified locally and in CI.
- The release-readiness gate checks required files, scripts, community files, PWA files, CI wiring, release wiring, and project identity/support markers.
- Production JavaScript/CSS/total bundle sizes are subject to executable budgets.
- Release tags must match `package.json` exactly.
- Tag releases run the full verification suite, dependency audit, Chromium E2E against the already verified production build, retain diagnostics, and package only after gates pass.
- Deterministic property coverage exercises generated grade calculations, target-score solvers, and CSV edge-label round trips.

## Verification evidence from this 2.0.12 continuation

Dependency-free checks performed in the available execution environment:

- TypeScript compilation of the `import { version as appVersion } from "../../package.json"` pattern passed with `moduleResolution: "Bundler"` and `resolveJsonModule: true`, matching GradeCraft's application TypeScript configuration.
- The new version-synchronization script passed a 2.0.12 fixture.
- The version-synchronization script correctly rejected a fixture that reintroduced `GradeCraft 1.0.0` into a localization catalog.
- The existing release-tag script accepted `v2.0.12` for package version `2.0.12`.
- The release-tag script correctly rejected mismatched `v2.0.13` and reported the expected `v2.0.12` tag.
- The hardened current CSV implementation was compiled and executed in an isolated harness.
- That harness passed **9 hardened CSV label round trips**, covering `=`, `+`, `-`, `@`, tab, line-feed, carriage-return, apostrophe, and Hindi Unicode labels.

Prior final-audit evidence also remains relevant:

- A dependency-free grade/CSV harness passed **200 generated grade cases**, **100 feasible points-target cases**, **3 weighted-target cases**, and the earlier CSV edge-label suite.
- The property-test surface passed isolated strict TypeScript compilation.
- Standalone release-tag, bundle-budget, and release-readiness fixture checks behaved correctly for pass and fail cases.

These checks are useful deterministic evidence but do not replace the full dependency-backed verification for the exact latest 2.0.12 commit.

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

## CI evidence limitation

- The connected direct-push workflow-run surface does not expose the current Actions run list.
- The latest combined-status query returned no status contexts.
- An empty workflow/status response is **not** treated as success evidence.

## Remaining external publication work

1. Inspect positive CI, E2E, CodeQL, dependency-audit, version-sync, release-gate, and bundle-budget results for the exact 2.0.12 release commit.
2. Capture real screenshots from the positively verified production build and place them in `docs/screenshots/`.
3. Publish a hosted demo only if desired and only after smoke-testing that exact deployment.
4. Confirm repository settings such as branch protection/Discussions separately if desired.
5. Generate and commit a trustworthy npm lockfile from a network-enabled dependency resolution if reproducible transitive dependency locking is desired; the current execution environment could not complete `npm install --package-lock-only`, so no lockfile was fabricated.

Items 1-4 are release evidence/settings work. Item 5 is a reproducibility improvement that requires a successful registry-backed dependency resolution; it is intentionally left explicit instead of committing an invented lockfile.

## Open issues

- Latest audited open-issue search: **none**.
- No known blocker/critical product defect remains from the repository audit.

## Migration notes

Application schema version remains `1`. Package version 2.0.12 does not require a persistence migration. Future breaking persistence changes must add explicit migrations and migration tests.

## 2.0.12 release notes draft

GradeCraft 2.0.12 packages the completed privacy-first grade-management experience with weighted target planning, semester organization/search, English/Hindi localization, authenticated portable backups, staged flexible CSV import, stronger data-integrity safeguards, hardened spreadsheet export boundaries, subpath-safe PWA updates, expanded automated tests, executable release/performance/version gates, diagnostic CI artifacts, tag/version enforcement, and package-derived user-visible versioning protected by a synchronization gate.

## Recent 2.0.12 preparation commits

- `297a12f` — fix: derive About version from package metadata
- `d381f5f` — refactor: remove hardcoded English app version
- `151eae9` — refactor: remove hardcoded Hindi app version
- `2ea1ba4` — build: add package version synchronization gate
- `1afe748` — build: enforce version synchronization during verification
- `61b2c16` — ci: enforce version synchronization
- `8d5134c` — build: require version gate in release readiness
- `2d9fe01` — release: prepare GradeCraft 2.0.12 metadata
- `71242d1` — docs: document 2.0.12 version synchronization workflow
- `54b1d8e` — docs: add 2.0.12 version gates to release readiness
- `e1bbfcd` — docs: finalize 2.0.12 release operator checklist
- `b28729e` — docs: expose version synchronization in project README
- `2dce6b7` — docs: mark 2.0.12 version integrity complete
- `9c6e79f` — security: harden CSV formula neutralization prefixes
- `8235fcc` — test: cover control-prefixed CSV formula defenses
- `a592e03` — test: extend CSV property coverage to control prefixes
- `dfa6593` — docs: document hardened CSV prefix neutralization
- `d21a2db` — docs: record 2.0.12 CSV hardening
