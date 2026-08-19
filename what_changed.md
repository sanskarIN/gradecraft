# GradeCraft Work Handoff

## Current milestone

**Version:** 1.0.0 release-candidate + Phase 6 audit branch  
**Phase:** Phase 6 — final audit and release verification  
**Date:** 2026-08-19  
**Working branch:** `phase6/release-audit`  
**Pull request:** #2 — `feat: complete weighted planning and release audit`  
**PR state:** Open, draft, mergeable  
**Base branch/head:** `main` at `1177bf730c43f0dad1d996ee4b4e3c7df93c7477`  
**Audited code head immediately before this handoff update:** `c4008056d95c616c11162e57b6322c3bbf5aedbe`  
**PR size at that audited code head:** 226 meaningful commits over `main`, 91 changed files

This file is the authoritative continuation checkpoint. Do not describe the release as verified until the latest CI, E2E, CodeQL, dependency, build, clean-checkout, PWA, and accessibility evidence is actually green. Historical commit/status sections below are retained for traceability; the **Latest GitHub Actions checkpoint before this handoff commit**, **Known limitations / open issues**, and **Next exact tasks** sections supersede older status statements.

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
- Required at least one course category.
- Hardened category validation against duplicate IDs and duplicate names after trimming, Unicode NFKC compatibility normalization, and stable case folding.
- Hardened grading-scale validation against duplicate band IDs, duplicate labels, duplicate thresholds, incomplete scales without a 0% fallback band, out-of-range GPA values, oversized scale text, and duplicate grading-profile names after normalized comparison.
- Added safe grading-scale deletion. A scale cannot be deleted while referenced by a course and GradeCraft always retains at least one grading profile.
- Added reducer-level grading-scale deletion invariants in addition to Settings UI protection.
- Trimmed category names before course persistence and grading-profile/band labels before profile persistence while retaining user-facing display text.
- Added deterministic property-style grade tests covering hundreds of generated valid point-based and weighted grade combinations and asserting results remain within valid percentage bounds.
- Added a deterministic 10,000-assignment benchmark harness for point-based and weighted calculations.
- Fixed target-score presentation so an “at least” required score is rounded upward rather than normally rounded downward, preventing displayed guidance from understating the true minimum.

### Persistence and data integrity

- Kept privacy-first browser Local Storage persistence with recovery-copy behavior and explicit delete controls.
- Hardened backup/restore schema validation so restored data must satisfy domain invariants instead of only structural checks.
- Rejects duplicate course, category, assignment, grading-scale, and grade-band identifiers.
- Rejects empty persisted entity identifiers and unknown grading-scale references.
- Rejects assignments referring to missing categories.
- Rejects invalid weighted totals, invalid assignments, incomplete grading scales, empty course names, courses without categories, duplicate category names, duplicate grading-profile names, and backups without any usable grading scale.
- Rejects restored course colors unless they are safe 3- or 6-digit hexadecimal color values, preventing imported style values from becoming arbitrary CSS resource-bearing values.
- Added bounded persisted text validation for course names/codes, category names, assignment names, grading-scale names, and band labels.
- Added strict calendar-date validation for assignment due dates, including correct leap-day handling.
- Added canonical ISO timestamp validation for application, course, and assignment persistence timestamps.
- Course editing prevents removal of a category that still owns assignments, preventing orphaned assignment references.
- Assignment undo is invalidated if the deleted assignment's original category is removed before Undo is used, preventing the undo path from recreating an orphaned assignment reference.
- Improved recovery behavior so a corrupted primary Local Storage record can be restored from a valid recovery record and the primary record is repaired where possible.
- Prevents corrupted primary content from replacing a known-valid recovery record during the next save.
- Local persistence degrades safely if browser storage is blocked or inaccessible instead of throwing through application startup or save/delete operations.
- Exposes persistence failure state to the application and shows an explicit user-visible alert warning that current changes may not survive leaving the tab.
- Explicit local-data deletion suppresses the immediate post-reset persistence write, leaving GradeCraft's primary and recovery storage keys removed for the reset operation instead of instantly writing default state back.
- Kept explicit schema version `1` and migration entry point for future versions.
- Added a dedicated migration regression suite so current-version acceptance, unsupported-version rejection, non-object rejection, and malformed-current-version rejection are explicit.

### CSV and backup safety

- Kept JSON full backup/restore and CSV assignment import/export.
- Kept spreadsheet-formula neutralization on exported CSV cells.
- Fixed protected CSV text round trips so neutralized values are restored correctly on GradeCraft re-import.
- Preserved legitimate user text that intentionally starts with an apostrophe.
- Added strict CSV due-date validation so impossible calendar dates are rejected before importing.
- Added bounded CSV category and assignment text fields so oversized imported content cannot bypass normal form limits.
- CSV import rejects duplicate column names instead of silently accepting an ambiguous duplicate header.
- CSV import rejects more than 10,000 assignment rows even when a file remains under the 5 MB UI file-size limit.
- CSV import preserves omitted `categoryWeight` as omitted intent instead of silently converting it to `0%`.
- CSV import rejects an explicit category weight that conflicts with the weight of an existing normalized category in the target course.
- CSV category matching uses the same Unicode-normalized comparison rule as domain validation.
- Category names are unique within a course, eliminating normalized category-name ambiguity in CSV mapping.
- CSV course selection remains valid after restoring/replacing data with a different set of course IDs.
- Added deterministic punctuation, multiline, formula-like, apostrophe, emoji, Hindi, and compatibility-Unicode CSV round-trip cases.
- Hardened CSV quoting so a quote cannot begin in the middle of an unquoted field and non-whitespace text after a closing quote is rejected instead of being interpreted ambiguously.
- Backup parsing converts malformed JSON, unsupported envelopes, and incompatible/invalid GradeCraft data into approved user-facing messages rather than exposing raw internal schema/parser exception text.
- Centralized expected user-safe errors in `src/errors/UserFacingError.ts`; unexpected exceptions use approved operation-specific fallback text in the UI.
- Data-transfer operations expose an asynchronous busy state and disable overlapping restore/import actions while a file is being read and validated.

### UI, accessibility, and localization readiness

- Kept responsive phone/tablet/desktop layouts, onboarding, light/dark/system theme, compact mode, reduced motion, focus visibility, semantic forms/tables, native dialogs, and offline states.
- Centralized major English UI messages in `src/i18n/en.ts`.
- Externalized persistence-system warnings in `src/i18n/system.ts`, grading-scale lifecycle messages in `src/i18n/settings.ts`, and data-transfer loading/fallback/conflict messages in `src/i18n/dataTransfer.ts`.
- Externalized application-shell, onboarding, dashboard, course, assignment-form, course-form, GPA, what-if, data-transfer, settings, About, modal, grade-ring, trend-chart, and contribution-chart text.
- Added descriptive assignment Edit/Delete accessible names.
- Improved chart semantics and preserved non-color textual values.
- Native modal dialogs have explicit accessible names wired with `aria-labelledby` and stable React-generated IDs.
- Modal content is unmounted while closed so cancelled local form drafts reset before the next editing session.
- Controlled modal closing avoids duplicate close callbacks.
- Modal closing restores focus to the still-connected control that opened the dialog.
- First-run onboarding moves focus into the onboarding dialog and marks application background regions inert for the duration of onboarding, preventing keyboard and assistive-technology interaction with hidden background controls.
- Primary navigation exposes the current destination with `aria-current="page"` and a visible active-state treatment.
- Settings provides direct entry points to privacy/data transfer and About in addition to appearance, accessibility, grading-profile, update, and delete controls.
- Data-transfer surfaces use `aria-busy` while file operations are active.
- Kept the required `Made by the Sanskar` credit and contact/funding links.

### What-if and route resilience

- What-if calculations remain non-destructive and scenario-aware.
- Points and weighted target-score solving are covered for active and previously inactive weighted categories.
- A stale or missing course ID in a `what-if` hash route falls back to an available course instead of producing a broken planner state.
- What-if course selection re-synchronizes if the available course set changes while the page remains mounted.
- Displayed minimum target scores use upward rounding so the “need at least” statement remains conservative.

### PWA and deployment

- Kept the manifest, editable SVG icon source, service worker, offline shell, and production-only service-worker registration.
- Added `VITE_BASE_PATH` deployment configuration so GradeCraft can be built for root hosting or a repository subpath.
- Made manifest/icon references and service-worker registration base-path aware.
- Made the manifest start URL and scope relative to its deployment location.
- Reworked the service-worker navigation strategy so application updates can refresh the navigation shell while a cached shell remains available offline.
- Scoped service-worker handling to same-origin requests inside the registration scope.
- Hardened service-worker registration so a browser registration failure does not create an unhandled promise rejection.
- The service-worker install phase parses built `index.html` and attempts to precache same-origin, in-scope application assets discovered from its `src` and `href` references, in addition to core shell resources.
- Service-worker activation waits for both obsolete-cache cleanup and `clients.claim()`.
- Cache ownership is isolated with the `gradecraft-` prefix. Activation only deletes obsolete GradeCraft-owned caches instead of deleting unrelated Cache Storage entries from other same-origin applications.
- Runtime cache reads open the current GradeCraft cache explicitly rather than using global `caches.match`, preventing accidental reads from unrelated same-origin caches.
- The current shell cache is `gradecraft-shell-v5`.
- Added a dedicated maskable SVG PWA icon and manifest entries separating `purpose: any` and `purpose: maskable`.
- The maskable icon is included in the install-time core cache.
- Added Playwright coverage for an offline reload immediately after the first installed worker claims the page, covering first-visit offline shell behavior rather than only a previously warmed runtime cache.
- Added manifest-source regression tests for portable scope/start URL and separate install-icon purposes.

### Browser security baseline

- Added a same-origin client-side Content Security Policy baseline in `index.html` covering scripts, styles, images, fonts, manifests, connections, workers, media, frames, objects, base URLs, and form actions.
- Added `no-referrer` metadata to avoid leaking navigation referrers from the application document.
- Tightened the CSP so scripts are restricted to `'self'`; inline scripts are not permitted.
- Inline styles remain permitted because current bounded React UI style properties are used for progress widths and safe course colors.
- Added static regression coverage proving the script directive does not contain `'unsafe-inline'` and object/base/frame restrictions remain present.
- Documented that production hosts with header control should deploy and test equivalent or stricter response-header policy where practical.

### Logging and secret handling

- Structured logging redacts sensitive key names including credential, identity, course, assignment, category, grade, and score-related context.
- Generic string values are also scanned for email and bearer-token patterns so secrets are not exposed merely because they appear under a non-sensitive key.
- The repository secret scanner covers normal source/document/config text plus `.env`, `.env.*`, and therefore `.env.example`.
- Secret scanning includes private-key, GitHub token, Google API key, OpenAI-style key, AWS access key, and Slack token patterns.
- Generated build, coverage, Playwright report/result, dependency, and Git metadata directories are excluded from repository source scanning.

### Dependency and configuration hardening

- Updated Vite from the earlier 6.0.7 line to `6.4.3` and `@vitejs/plugin-react` to `4.7.0` while retaining exact direct dependency versions in `package.json`.
- Hardened ESLint configuration for Node/script and service-worker runtime globals, including the service-worker `fetch` global.
- Promoted the React Refresh export rule from warning behavior to an error-compatible configuration and explicitly allowed the exported `useApp` hook.
- Kept strict TypeScript checks, typed linting, deterministic whitespace/line-ending format checks, tests, production build, secret scan, and high-severity dependency audit in CI.
- Included `benchmarks/` in the strict application TypeScript project so typed lint/project-service checks do not treat benchmark code as an out-of-project file.
- Added `npm run docs:links` to validate repository-relative Markdown/image link targets without requiring network access.
- Added `npm run release:version-check` to require agreement between `package.json`, the About version string, and the changelog release section.
- Added both repository checks to `npm run verify` and CI.
- Extended Vitest coverage scope from domain/data modules to the centralized error module as well.
- A temporary branch-only lockfile-generation workflow was added earlier to work around sandbox npm-network failure, but repeated branch pushes did not produce a verified `package-lock.json`; the ineffective temporary workflow has now been removed and will not ship.
- `package-lock.json` remains absent, so deterministic `npm ci` conversion is intentionally blocked until a real network-enabled install can generate and verify the lockfile.

### Release automation and repository settings guidance

- CI runs typecheck, lint, format verification, documentation links, release-version consistency, secret-pattern scanning, tests with coverage, production build, and high-severity npm audit.
- E2E installs Playwright Chromium and runs the browser journeys.
- E2E uploads `playwright-report/` and `test-results/` as a seven-day artifact when the browser job fails, making browser failures diagnosable without local reproduction.
- CodeQL remains enabled on pushes/pull requests to `main` plus the scheduled scan.
- Tagged release automation verifies the tag exactly matches `v${package.json version}` before publishing.
- Tagged release automation runs the complete verification and high-severity dependency audit before packaging.
- Tagged release automation packages `dist/` as `gradecraft-pwa.zip` and generates `gradecraft-pwa.zip.sha256`.
- Tagged release publishing uses GitHub's authenticated `gh release create` CLI instead of the previous third-party `softprops/action-gh-release` action.
- Release documentation explicitly instructs verifying the published archive against the checksum file before distribution.
- Added static release-workflow tests protecting tag/version matching, checksum generation, and native GitHub CLI publishing.
- Updated `docs/github-settings.md` to align recommended `main` protection checks with the current CI/E2E/CodeQL workflows, prohibit treating superseded/pending checks as final-head evidence, recommend security settings, and document release checksum expectations.

### Testing

- Extended `tests/whatIf.test.ts` with weighted target planning, empty-category activation, invalid target input, scenario helper coverage, and conservative target-score display rounding.
- Added `tests/gradeProperties.test.ts` with deterministic property-style tests for point-based and weighted grade invariants.
- Extended `tests/schema.test.ts` with duplicate identifiers, incomplete scales, empty course names, missing categories, duplicate category names, empty internal identifiers, missing grading scales, unsafe color values, bounded course identity fields, and malformed persistence timestamps.
- Refactored schema test fixtures so their timestamps and unrelated fields remain valid and each regression isolates the intended invalid invariant.
- Added `tests/schemaScaleNames.test.ts` for persisted grading-profile name collisions after Unicode normalization.
- Extended `tests/csv.test.ts` with secure formula-hardening round trips, intentional leading-apostrophe preservation, valid/invalid due dates, bounded imported names, duplicate-header rejection, bounded row counts, optional weight semantics, and malformed quote-placement rejection.
- Added `tests/csvProperties.test.ts` with deterministic punctuation, multiline, formula-like, apostrophe, emoji, Hindi, and compatibility-Unicode round trips.
- Added `tests/CourseForm.test.tsx` to prevent regression of category/assignment referential integrity and verify category trimming on save.
- Extended `tests/validation.test.ts` for duplicate category names, Unicode-equivalent names/labels, grading-profile name collisions, duplicate grading thresholds/IDs, complete 0%-fallback coverage, missing categories, canonical ISO timestamps, due-date validation, leap-day handling, and bounded text fields.
- Added `tests/Modal.test.tsx` for modal draft reset, controlled close callback semantics, accessible dialog naming, and focus restoration.
- Updated `tests/setup.ts` with a jsdom dialog lifecycle shim only when the environment lacks native `showModal` support.
- Extended `tests/storage.test.ts` with recovery-copy repair, corrupted-primary backup protection, and blocked-storage behavior.
- Added `tests/AppContext.test.tsx` to verify explicit local-data deletion remains cleared through reset and to protect grading-profile deletion invariants.
- Extended `tests/App.test.tsx` with onboarding background isolation/focus behavior, current-page navigation semantics, and the user-visible persistence-failure warning.
- Added `tests/WhatIfPage.test.tsx` for stale what-if route recovery.
- Extended `tests/DataPage.test.tsx` for CSV course-selection recovery, transfer busy state, and category-weight conflict handling.
- Added `tests/CoursePage.test.tsx` to ensure assignment undo cannot recreate a reference to a category removed after deletion.
- Added `tests/SettingsPage.test.tsx` for Settings shortcuts plus grading-profile name/deletion integrity and trimmed profile persistence.
- Added `tests/securityMetadata.test.ts` for browser CSP/referrer metadata and no-inline-script regression.
- Added `tests/serviceWorkerSource.test.ts` for service-worker cache ownership, cache-read isolation, same-origin filtering, and scope filtering.
- Added `tests/manifest.test.ts` for portable PWA manifest URLs and icon purposes.
- Added `tests/migrations.test.ts` for explicit storage-version migration behavior.
- Added `tests/UserFacingError.test.ts` for safe expected/fallback message selection.
- Added `tests/releaseWorkflow.test.ts` for release tag/version matching, checksum generation, and native publisher protection.
- Extended Playwright `e2e/core.spec.ts` with the primary weighted workflow: onboarding → create weighted course → add assignment → open what-if planner → calculate required target score.
- Extended Playwright with first-installed-service-worker offline reload coverage.
- Updated `docs/testing.md` with the expanded unit, property-style, deterministic fuzz, migration, integration, component, E2E, storage-resilience, security-metadata, cache-safety, release-workflow, accessibility, repository-check, performance, and PWA release checks.

### CI and repository quality

- Kept CI, E2E, CodeQL, Dependabot, release workflow, issue templates, PR template, funding configuration, documentation, secret scan, and npm audit steps.
- Added same-ref concurrency cancellation to CI, E2E, and CodeQL to reduce obsolete runs during a high-commit audit.
- Added offline repository-relative documentation-link verification.
- Added release-version consistency verification.
- Added Playwright failure diagnostics retention.
- Hardened tagged release publishing with tag/version matching and SHA-256 artifacts.
- Removed the ineffective temporary lockfile-generation workflow rather than shipping a branch-only workaround.
- The audit branch intentionally contains many small meaningful commits and should not be squash-merged if preserving the requested reviewable history is desired.
- PR #2 remains draft while release verification is incomplete.

### Documentation

- Updated `README.md` with current hardened release-candidate features, commands, architecture directories, privacy/security posture, benchmark command, and verification commands.
- Updated `CHANGELOG.md` with reliability, data-integrity, grading-profile lifecycle, CSV ambiguity/bounds/strict quoting, explicit-delete, browser-policy, PWA cache/icon, accessibility, validation, testing, release-integrity automation, and dependency-hardening work.
- Updated `ROADMAP.md` to mark completed release-hardening refinements while leaving localization packs, optional semester grouping, real screenshots, and hosted demo work explicit.
- Updated `SECURITY.md` with current CSV/restore hardening, canonical timestamps, CSP/referrer posture, PWA cache/scope behavior, storage-failure behavior, user-safe exceptions, structured-log redaction, and secret-scanning coverage.
- Updated `PRIVACY.md` with local recovery-copy behavior, console-log redaction, local import validation, external-link behavior, and explicit-delete semantics.
- Updated `CONTRIBUTING.md` with complete verification commands, benchmark guidance, untrusted-data expectations, safe-message expectations, and accurate PR verification claims.
- Updated `docs/architecture.md` with domain/data/errors/state/UI/i18n/platform/verification layers, persistence invariants, normalized identity comparison, and security boundaries.
- Updated `docs/development.md` with all verification/repository/security/benchmark commands and engineering rules.
- Updated `docs/setup.md` with root/subpath PWA configuration and verification.
- Updated `docs/release.md` with complete verification gates, benchmark/a11y/PWA checks, tag/package matching, SHA-256 release artifacts, checksum verification guidance, and native GitHub CLI publishing.
- Updated `docs/testing.md` with current regression, deterministic fuzz, migration, component, static security, cache-isolation, release-workflow, E2E, repository check, benchmark, and PWA scope.
- Updated `docs/accessibility.md` with current-page navigation, dialog naming/focus restoration, onboarding focus/background isolation, transfer busy state, modal lifecycle behavior, and persistence alerts.
- Updated `docs/performance.md` with the deterministic large-course benchmark workflow.
- Updated `docs/troubleshooting.md` with grading-profile lifecycle, CSV row/weight validation, browser-storage failure, and PWA cache guidance.
- Updated `docs/github-settings.md` with current required-check guidance, security settings, discussions guidance, and release-integrity expectations.
- Retained the required project/community/security/privacy/architecture/setup/development/testing/release/troubleshooting/accessibility/performance/ADR documentation set.

## Files/modules added or materially changed in the complete audit

### Domain/data/errors/state

- `src/domain/whatIf.ts`
- `src/domain/validation.ts`
- `src/data/schema.ts`
- `src/data/csv.ts`
- `src/data/storage.ts`
- `src/data/backup.ts`
- `src/data/logger.ts`
- `src/errors/UserFacingError.ts`
- `src/state/AppContext.tsx`
- `src/i18n/en.ts`
- `src/i18n/system.ts`
- `src/i18n/settings.ts`
- `src/i18n/dataTransfer.ts`

### Application/UI

- `src/main.tsx`
- `src/App.tsx`
- `src/navigation.css`
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

### Tests and benchmarks

- `tests/whatIf.test.ts`
- `tests/gradeProperties.test.ts`
- `tests/schema.test.ts`
- `tests/schemaScaleNames.test.ts`
- `tests/csv.test.ts`
- `tests/csvProperties.test.ts`
- `tests/storage.test.ts`
- `tests/migrations.test.ts`
- `tests/validation.test.ts`
- `tests/UserFacingError.test.ts`
- `tests/App.test.tsx`
- `tests/AppContext.test.tsx`
- `tests/CourseForm.test.tsx`
- `tests/CoursePage.test.tsx`
- `tests/Modal.test.tsx`
- `tests/SettingsPage.test.tsx`
- `tests/WhatIfPage.test.tsx`
- `tests/DataPage.test.tsx`
- `tests/securityMetadata.test.ts`
- `tests/serviceWorkerSource.test.ts`
- `tests/manifest.test.ts`
- `tests/releaseWorkflow.test.ts`
- `tests/setup.ts`
- `e2e/core.spec.ts`
- `benchmarks/gradeMath.bench.ts`

### PWA/build/scripts/automation

- `public/sw.js`
- `public/manifest.webmanifest`
- `public/icons/icon-maskable.svg`
- `vite.config.ts`
- `vitest.config.ts`
- `tsconfig.app.json`
- `package.json`
- `.env.example`
- `eslint.config.js`
- `scripts/check-format.mjs`
- `scripts/check-secrets.mjs`
- `scripts/check-links.mjs`
- `scripts/check-version.mjs`
- `.github/workflows/ci.yml`
- `.github/workflows/e2e.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/release.yml`
- `.github/dependabot.yml`

The temporary `.github/workflows/lockfile-once.yml` was created during the audit as an attempted network-enabled lockfile workaround and has now been deleted. It must not be restored unless a future continuation has a concrete, verified reason to do so.

### Documentation/community

- `README.md`
- `CHANGELOG.md`
- `ROADMAP.md`
- `SECURITY.md`
- `PRIVACY.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SUPPORT.md`
- `LICENSE`
- `docs/setup.md`
- `docs/development.md`
- `docs/testing.md`
- `docs/release.md`
- `docs/accessibility.md`
- `docs/architecture.md`
- `docs/performance.md`
- `docs/troubleshooting.md`
- `docs/github-settings.md`
- `docs/adr/0001-client-only-pwa.md`
- `docs/adr/0002-hash-routing.md`
- `docs/adr/0003-storage-versioning.md`
- `docs/screenshots/README.md`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`
- `.github/pull_request_template.md`
- `.github/release.yml`
- `.github/FUNDING.yml`
- `what_changed.md`

## Verification

### Local execution environment

Previously confirmed toolchain:

- `node --version` → `v22.16.0`
- `npm --version` → `10.9.2`
- `git --version` → `2.47.3`

Environment limitations encountered during this project session:

- A new clean clone retry of `https://github.com/sanskarIN/gradecraft.git` from the execution sandbox still failed because the sandbox could not resolve `github.com`.
- npm registry access previously timed out and no useful npm cache was available, so a clean local dependency installation and lockfile generation could not be completed in this sandbox.
- Because dependencies could not be installed locally, do **not** treat local typecheck, typed lint, format, repository checks, coverage tests, benchmark, production build, npm audit, or Playwright verification as completed.
- Repository changes were applied through the authenticated GitHub connector and inspected from GitHub after writes.

### Latest GitHub Actions checkpoint before this handoff commit

GitHub Actions is the network-enabled verification path for this audit.

At audited code head `c4008056d95c616c11162e57b6322c3bbf5aedbe`, PR #2 reported 226 commits over `main` and 91 changed files. The head-specific runs inspected immediately before this handoff update were:

- CI run `32225578984` — `pending` at last inspection.
- E2E run `32225579251` — `pending` at last inspection.
- CodeQL run `32225579066` — `pending` at last inspection.

Earlier rapid-commit runs were superseded by same-ref workflow concurrency cancellation. No passing state is claimed until the latest relevant runs actually conclude successfully. This `what_changed.md` commit itself creates a newer branch head and will create/supersede head-specific workflow runs; the next continuation must inspect the latest PR head rather than treating the IDs above as authoritative after this commit.

### Lockfile status

- `package-lock.json` is still absent on `phase6/release-audit` at the latest audit inspection.
- Direct dependencies remain exact-version pinned in `package.json`, but transitive dependency reproducibility is incomplete without a verified lockfile.
- The temporary `.github/workflows/lockfile-once.yml` workaround was removed because repeated branch pushes did not produce a verified lockfile and the workflow was not appropriate to ship.
- CI, E2E, release documentation, and README intentionally continue using `npm install` where needed. Do not switch them to `npm ci` until a real `package-lock.json` has been generated from the current `package.json`, inspected, committed, and verified.

### Commit identity

Raw GitHub commit metadata previously confirmed audit commits with:

- Name: `Sanskar`
- Email: `sanskarin@outlook.in`

The requested commit email has therefore been observed in Git metadata for connector-created audit work. Re-check the final handoff and final merged commit raw metadata before the release tag if authorship auditing is required.

## Known limitations / open issues

1. **Latest CI/E2E/CodeQL are not yet green.** The branch remains a draft PR and must not be described as fully release-verified until the latest final head-specific checks finish successfully.
2. **No committed `package-lock.json` yet.** Direct dependencies are exact-version pinned, but transitive reproducibility is incomplete until a network-enabled install generates a lockfile for the current dependency graph and that lockfile is committed and verified.
3. **The local sandbox cannot perform the required clean clone/install verification.** DNS resolution for `github.com` still fails and npm installation previously timed out.
4. **Real release screenshots are not yet committed.** The README intentionally does not use fake screenshots; capture real UI images only after a verified production build/deployment exists.
5. **A final clean-checkout release build is not yet verified.** It must include dependency install, all `npm run verify` gates, npm audit, Playwright, and PWA smoke checks from the exact final commit.
6. **Manual accessibility verification is still required on a verified build.** Keyboard-only use, focus restoration, 200% zoom, reduced motion, light/dark contrast, and at least one screen-reader journey cannot be truthfully claimed from static/source review alone.
7. **Production response headers are hosting configuration.** The repository has a restrictive client-document CSP/referrer baseline; a host with header control should deploy and test equivalent or stricter response headers.
8. **Branch protection and GitHub Discussions are repository settings.** Guidance exists in `docs/github-settings.md`, but these settings are not represented by source commits and must be enabled through repository settings when desired.
9. **Localization packs beyond English, optional semester grouping, a hosted demo link, and real release screenshots remain roadmap items.** They are intentionally not represented as completed 1.0 functionality.
10. **No final release tag should be created yet.** Tagging is blocked by missing final green verification and lockfile/clean-install evidence.
11. **PR #2 must remain draft until the latest final head is green.** Do not mark ready, merge, or tag merely because earlier superseded runs passed or because source inspection looks correct.

## Next exact tasks

1. Read the new PR #2 head SHA after this `what_changed.md` commit and inspect the latest head-specific CI, E2E, and CodeQL workflow runs.
2. If any job fails, inspect failed job output and fix every type, lint, format, docs-link, version-check, secret-scan, unit/integration/component coverage, build, browser/E2E, audit, or CodeQL failure with a focused regression commit.
3. Generate `package-lock.json` from the **current** `package.json` in a network-enabled clean checkout using an appropriate npm install workflow, inspect it, and commit it as a real repository artifact.
4. After the lockfile is committed and verified, convert deterministic CI/E2E/release and documented clean-install paths from `npm install` to `npm ci` in focused commits, while keeping `npm install` only where contributors intentionally need dependency resolution/update behavior.
5. Re-run final clean-checkout verification from the exact release-candidate commit: install, `npm run verify`, `npm run bench` on a reference environment, `npm audit --audit-level=high`, Playwright Chromium E2E, and CodeQL.
6. Perform manual accessibility verification on the verified production build: keyboard-only onboarding/course/assignment/settings/import-export/dialog flows, active navigation, focus visibility and return, 200% zoom, reduced motion, both themes, and at least one screen-reader core journey.
7. Verify production PWA behavior from a clean browser context: manifest and any/maskable icons, first-load worker claim, immediate offline reload, static asset availability, network restoration, new-release navigation-shell refresh, GradeCraft-only obsolete-cache deletion, and no interaction with unrelated same-origin cache entries.
8. Capture real screenshots from the verified production build and add them to `docs/screenshots/`, then update README screenshot references and release documentation.
9. Run/document the repository-relative Markdown-link checker and release-version checker from the final clean checkout, and manually check external GitHub/BMC/contact links because the offline link checker intentionally does not crawl internet destinations.
10. Verify the final tag name exactly matches `v${package.json version}` and verify the release workflow publishes both `gradecraft-pwa.zip` and its SHA-256 file.
11. Mark PR #2 ready for review only after all final release-candidate verification evidence is green.
12. Merge PR #2 with a strategy that preserves the meaningful atomic commit history rather than squashing it.
13. After merge, verify the `main` branch workflows from the merged commit.
14. Only after `main` is green, create the final release tag, verify checksum/artifact publication, and complete hosted/static PWA smoke tests.
15. Close or otherwise retire superseded audit PR #1 only after PR #2 is safely merged and `main` verification is complete.

## Migration notes

- Current persisted schema version is `1`.
- This audit tightened validation but did not change the serialized schema shape, so no schema-version increment is required.
- Existing valid GradeCraft v1 data remains valid.
- Previously corrupted, unsafe, ambiguous, or internally inconsistent backup data may now be rejected instead of being accepted into application state.
- Rejection cases include unsafe/non-hex course colors, impossible due dates, malformed persistence timestamps, oversized bounded text fields, duplicate/empty IDs, duplicate category names, duplicate grading-profile names, missing category/scale references, incomplete grading scales, empty scale collections, invalid weighted totals, invalid scores, and courses without categories.
- Any future persisted shape change must add an explicit migration and migration regression test.

## Release notes draft

GradeCraft 1.0 provides privacy-first local grade tracking, weighted and points-based grade calculations, custom grading scales with safe profile lifecycle management, credit-weighted GPA, scenario-aware what-if planning, weighted target-score solving, charts, CSV/JSON portability, responsive themes, accessibility controls, configurable root/subpath PWA deployment, separate any/maskable install icons, an offline-capable application shell, data-integrity validation, local persistence recovery, browser security metadata, cache ownership isolation, and automated quality/security/release workflows.

The Phase 6 audit additionally hardens restored-data invariants, normalized category/profile identities, CSV round trips, row counts, quoting and weight conflicts, category referential integrity, grading-scale completeness/lifecycle, canonical persistence timestamps, calendar-date validation, bounded imported/persisted text, safe course-color restoration, blocked-storage behavior, explicit deletion semantics, user-visible persistence failures, safe transfer errors, stale route/data selections, native dialog lifecycle/focus accessibility, current-page navigation semantics, first-run focus isolation, first-install offline precaching, service-worker cache isolation/update/activation behavior, maskable installation assets, deployment portability, localization readiness, lint/runtime configuration, dotenv secret scanning, structured-log redaction, dependency patching, deterministic property/fuzz/benchmark coverage, repository link/version gates, Playwright failure artifacts, repository-settings guidance, and checksum-protected tagged release automation.

This release-candidate text is a draft. Do not state that CI, CodeQL, E2E, npm audit, clean-checkout build, benchmark review, accessibility review, PWA smoke verification, or release verification passed until those checks are actually completed on the final merged code and recorded here.

## Phase 6 audit commit history — initial audited sequence

The earlier handoff explicitly recorded these first 56 meaningful audit commits over `main`:

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

## Phase 6 audit commit history — continued work from the previous handoff

The previous checkpoint explicitly recorded these continuation commits:

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

## Phase 6 audit commit history — this continuation

The branch moved from the previous audited code head `f13b54f0154ca1f5b1c3b40176e1088f19e6c4ff` to `c4008056d95c616c11162e57b6322c3bbf5aedbe` through exactly 98 additional meaningful commits before this handoff commit:

1. `7776fa3` — docs: finalize current GradeCraft audit handoff
2. `ecd7f6b` — feat: support grading scale deletion action
3. `e4a2035` — refactor: externalize grading scale management messages
4. `93122a1` — feat: add safe grading scale deletion controls
5. `b494fe3` — test: protect grading scale deletion invariants
6. `7563f0d` — test: cover grading scale deletion controls
7. `ebd835d` — a11y: expose current primary navigation page
8. `b1e566c` — style: highlight active primary navigation item
9. `ac55bb5` — build: load navigation state styles
10. `909c8a0` — test: expose active primary navigation semantics
11. `0c7fe8e` — feat: add data and about shortcuts to settings
12. `99406dc` — test: expose settings data and about shortcuts
13. `5e5456a` — a11y: restore focus after modal dialogs close
14. `03a9d0b` — test: verify modal focus restoration
15. `583926c` — design: add dedicated maskable PWA icon source
16. `19cd5fa` — build: declare separate any and maskable PWA icons
17. `979e28c` — build: precache maskable PWA branding asset
18. `0265584` — test: verify installable PWA manifest metadata
19. `d63fa1c` — perf: add grade calculation benchmark harness
20. `ff27119` — build: expose grade calculation benchmark command
21. `190142a` — docs: document grade calculation benchmark workflow
22. `def996f` — refactor: add centralized user-facing error type
23. `5a34cb0` — security: make backup validation errors user safe
24. `c6534dc` — security: use user-safe CSV validation errors
25. `2d23a87` — refactor: externalize data transfer fallback errors
26. `7984139` — security: surface only safe data transfer errors
27. `f79179e` — test: cover safe backup validation errors
28. `f153e52` — test: verify safe error message selection
29. `c674261` — fix: normalize Unicode text for identity comparisons
30. `605f8dc` — fix: reuse Unicode normalization for CSV category matching
31. `95b5f9d` — test: cover Unicode-normalized validation identities
32. `ec5413c` — test: add repository documentation link checker
33. `c00ec83` — build: include documentation links in verification
34. `3f8f41f` — ci: verify repository documentation links
35. `a0fb224` — test: add explicit storage migration coverage
36. `6d916ba` — test: add deterministic CSV parser fuzz coverage
37. `ff082ac` — ci: remove ineffective temporary lockfile workflow
38. `67f83ca` — security: strengthen structured log redaction
39. `0da4363` — test: cover sensitive log value redaction
40. `6b8ebd3` — refactor: externalize data transfer loading states
41. `8394c29` — feat: prevent overlapping data transfer operations
42. `ea39167` — test: cover data transfer busy state
43. `e8db4ff` — fix: trim category names before saving courses
44. `a9f380e` — fix: trim grading profile text before saving
45. `fb7ae3b` — test: verify trimmed category persistence
46. `e5d574c` — security: bound CSV assignment import size
47. `59123b3` — build: include benchmarks in strict TypeScript checks
48. `28f56cb` — test: cover bounded CSV row imports
49. `a59ce3e` — test: add release version consistency checker
50. `43c2169` — build: include release version consistency in verification
51. `e255351` — ci: verify release version references
52. `7bae17c` — ci: preserve Playwright failure diagnostics
53. `9da0581` — security: scan dotenv files for credential patterns
54. `e491616` — fix: validate canonical ISO persistence timestamps
55. `12db192` — security: reject malformed persisted timestamps
56. `3c2d1fd` — test: cover canonical ISO timestamp validation
57. `199dd06` — test: keep schema invariant fixtures independently valid
58. `72d61c8` — fix: validate unique grading scale profile names
59. `db14c59` — security: reject duplicate grading profile names on restore
60. `212c09f` — feat: prevent duplicate grading profile names
61. `5327a69` — test: cover grading profile name collisions
62. `43f90e6` — test: reject duplicate persisted grading profile names
63. `ae335b8` — test: cover grading profile name integrity
64. `876e8f2` — security: remove inline script allowance from CSP
65. `db2178c` — test: verify inline scripts stay blocked by CSP
66. `bd437a2` — fix: round required score guidance upward
67. `c413c3b` — fix: show conservative minimum target scores
68. `fb6cc23` — test: prevent understated target score guidance
69. `4ce585e` — fix: preserve optional CSV category weight intent
70. `99156cd` — refactor: externalize CSV weight conflict guidance
71. `9761be4` — fix: reject conflicting imported category weights
72. `efb073f` — test: preserve optional CSV weight semantics
73. `145173e` — test: reject conflicting CSV category weights
74. `a948498` — test: await terminal CSV conflict status
75. `8526a76` — docs: record extended Phase 6 hardening
76. `dd94758` — docs: expand Phase 6 verification coverage
77. `b62af8e` — docs: record current navigation and focus behavior
78. `cfed8c7` — docs: strengthen final release gates
79. `e6d30f7` — docs: refresh hardened release-candidate features
80. `6390573` — docs: document errors validation and verification layers
81. `377e309` — docs: mark release hardening refinements complete
82. `16c3ec5` — docs: align security posture with hardened CSP
83. `aa48701` — docs: document complete developer verification commands
84. `1cb8766` — test: include centralized errors in coverage budget
85. `c90c9e4` — docs: strengthen contributor verification guidance
86. `e8f620b` — docs: clarify local privacy and recovery behavior
87. `48c0ffe` — docs: expand storage and import troubleshooting
88. `642f354` — ci: harden tagged release artifact publishing
89. `8cb4398` — test: protect release artifact integrity workflow
90. `ae7e640` — docs: document release checksum publishing
91. `48660e2` — docs: document release workflow regression coverage
92. `6c269dd` — security: reject ambiguous CSV quote placement
93. `cbf7a6c` — test: reject malformed CSV quote placement
94. `91ca638` — docs: record complete continued GradeCraft audit handoff
95. `e776caf` — docs: record release integrity and strict CSV parsing
96. `3332d7e` — docs: align checksum verification wording with workflow
97. `4d31c12` — docs: finalize continued GradeCraft verification handoff
98. `c400805` — docs: align branch protection checks with current workflows

## Earlier baseline commits on `main`

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
