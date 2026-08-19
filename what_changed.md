# GradeCraft Work Handoff

## Current milestone

**Package version:** 2.0.12  
**Release state:** final repository hardening is on `main`; a dedicated PR is being used to obtain positive network-enabled CI/E2E/audit evidence before tagging  
**Date:** 2026-08-19

## Completed product scope

GradeCraft is a privacy-first TypeScript + React PWA with weighted and points grading, custom courses/categories/assignments/scales, GPA, what-if planning, weighted target-score solving, semester organization/search, charts, English/Hindi localization, local persistence/recovery, JSON and CSV portability, encrypted backup files, PWA offline support, accessibility preferences, responsive layouts, and open-source project/community documentation.

The repository includes unit/domain/data/component/property tests, Playwright browser journeys, CI, E2E, CodeQL, Dependabot, release automation, documentation-link checks, secret checks, release-readiness checks, version synchronization, production bundle budgets, release-tag validation, coverage artifacts, and Playwright diagnostics.

## Version 2.0.12 continuation

- Prepared package/changelog/handoff metadata atomically for **2.0.12**.
- Fixed the About screen to derive its application version from `package.json` rather than a hardcoded translation value.
- Removed semantic-version literals from English/Hindi catalogs.
- Added `scripts/check-version-sync.mjs`, `npm run version:check`, CI integration, and release-gate protection for the version infrastructure.
- Updated README, development, testing, architecture, release-readiness, release process, roadmap, changelog, and security documentation for the 2.0.12 workflow.
- Added ADR 0007 documenting `package.json` as the single application-version source and explicitly separating package version from persistence-schema version.
- Hardened CSV spreadsheet-export neutralization for `=`, `+`, `-`, `@`, tab, carriage-return, and line-feed prefixes while preserving protected label round trips.
- Added focused CSV regression coverage plus deterministic property cases for the expanded prefix set.
- Updated the release gate so ADR 0007 is required release infrastructure.

## CI blocker discovered and fixed

A PR-triggered GitHub Actions run on Dependabot PR #4 provided network-enabled evidence that the previous ESLint configuration was a real release blocker:

- dependency installation succeeded,
- TypeScript checking succeeded,
- ESLint failed before the remaining CI gates,
- typed project-service parsing was incorrectly applied to JS/MJS files outside the TypeScript projects (`eslint.config.js`, `public/sw.js`, and repository scripts), and
- `react-refresh/only-export-components` produced an intentional AppContext warning that was fatal because lint runs with `--max-warnings=0`.

The current `main` fix scopes type-aware rules to `*.ts`/`*.tsx`, gives Node/service-worker JavaScript explicit globals, keeps normal recommended JavaScript linting, and disables only the known React-refresh false positive for `src/state/AppContext.tsx`. The corrected config passed a direct Node syntax check.

## Dependency/security evidence discovered

The same network-enabled PR installation reported **8 npm audit findings: 2 low, 1 moderate, 3 high, and 2 critical** on the older dependency set represented by that PR merge base. That run stopped at lint before its explicit `npm audit --audit-level=high` step, so it is not sufficient evidence to identify which final 2.0.12 dependency changes resolve every high/critical advisory.

Several Dependabot PRs remain open, including React/React DOM same-major updates and major Vite, TypeScript, ESLint, and Vitest/tooling updates. These are not being blindly merged into 2.0.12. Their PR-triggered CI/E2E evidence must be evaluated against the corrected current main baseline first.

## Repository maintenance cleanup

- Closed stale audit PR #1 as superseded by the completed direct-main audit work.
- Closed stale draft audit PR #2 as superseded by current `main` and 2.0.12 release preparation.
- Latest audited open-issue search: **none**.
- Final code search found no `TODO`, no `FIXME`, no `not implemented` marker, and no stale `GradeCraft 1.0.0` reference.
- Remaining open PRs are dependency-maintenance PRs, not unfinished product-feature PRs.

## Deterministic evidence from this continuation

- The package-version JSON import pattern used by About compiled under GradeCraft's Bundler/JSON TypeScript settings.
- Version synchronization passed a valid 2.0.12 fixture and rejected a fixture that reintroduced `GradeCraft 1.0.0` into a locale catalog.
- Release-tag validation accepted `v2.0.12` and rejected mismatched `v2.0.13`.
- The hardened CSV implementation passed an isolated compiled round-trip harness for formula prefixes, tab/LF/CR prefixes, apostrophes, and Hindi Unicode.
- Prior deterministic harness evidence remains: **200 generated grade cases**, **100 feasible points-target cases**, **3 weighted-target cases**, and the earlier CSV edge-label suite.

These checks do not replace positive dependency-backed verification for the exact final candidate.

## Exact 2.0.12 release gates

From a clean network-enabled checkout:

```bash
npm install
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
npm run release:tag -- v2.0.12
```

The dedicated `audit/2.0.12-final-ci` PR exists specifically to expose PR-triggered CI/E2E/CodeQL evidence for the corrected current baseline. Do not tag 2.0.12 until high/critical dependency findings are resolved and all required checks are positively green.

## Remaining release work

1. Obtain positive CI/E2E/CodeQL evidence on the corrected current baseline.
2. Identify and resolve every high/critical npm advisory using compatible dependency updates; do not merge major toolchain upgrades solely because Dependabot opened them.
3. Re-run the full quality, E2E, audit, version, release, and performance gates after dependency changes.
4. Generate a trustworthy npm lockfile from the successful network-backed dependency resolution; no lockfile is fabricated in the restricted execution environment.
5. Capture real screenshots from that positively verified production build.
6. Publish and smoke-test a hosted demo only if desired.
7. Confirm repository settings such as branch protection/Discussions separately if desired.

## Migration notes

Application schema version remains `1`. Package version 2.0.12 does not require a persistence migration. Future breaking persistence changes must add explicit migrations and migration tests.

## 2.0.12 release notes draft

GradeCraft 2.0.12 packages the completed privacy-first grade-management experience with weighted target planning, semester organization/search, English/Hindi localization, authenticated portable backups, staged flexible CSV import, stronger data-integrity and spreadsheet-export safeguards, subpath-safe PWA updates, expanded automated tests, executable release/performance/version gates, diagnostic CI artifacts, package/tag enforcement, package-derived user-visible versioning, and corrected TypeScript-aware ESLint scoping. Final release remains blocked until the network-enabled dependency audit is clean at the configured high-severity threshold and all CI/E2E gates pass.
