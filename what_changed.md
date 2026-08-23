# GradeCraft Work Handoff

## Current milestone

**Package version:** 2.0.12  
**Milestone:** Release-evidence, data-safety, accessibility, and publication hardening after cross-platform source completion  
**Release state:** PWA, Windows, macOS, Linux, Android, and iOS/iPadOS source support is implemented. Repository release gates, screenshot provenance/checksums, PWA archive checksums, persistence warnings, workflow rerun controls, and least-privilege publication are now hardened. The exact final commit still requires positive CI/E2E/Native/CodeQL evidence plus real platform build/smoke evidence before publication is called green.  
**Date:** 2026-08-23

## Continuation completed on 2026-08-23

This continuation started from `c984bae1e6ddae2284c25b08f5d989904c01799b`. Repository comparison after the implementation/documentation pass showed the branch **47 commits ahead, 0 behind**, across 28 changed files before this handoff update.

### Workflow reliability and exact-ref verification

- Added `workflow_dispatch` to CI, Native, and CodeQL; E2E already supported manual dispatch and retains it.
- Added per-workflow/ref concurrency groups with `cancel-in-progress: true` to CI, E2E, Native, and CodeQL so superseded runs do not obscure the newest verification state.
- Extended `scripts/check-release-gate.mjs` so manual exact-ref verification and concurrency controls cannot silently disappear.

### Workflow credential hardening

- Every project-code checkout in CI, E2E, Native, CodeQL, and tagged release verification now uses `persist-credentials: false`.
- The static release gate counts checkout occurrences and requires matching credential-isolation settings for every checkout, including all three Native jobs.
- Tagged publication is split into two jobs:
  - `verify` runs project code with read-only repository permission;
  - `publish` depends on `verify`, downloads only staged verified release files, receives `contents: write`, and does not check out or execute repository project code.
- The release gate protects the read-only verification/write-only publication boundary.

### Screenshot evidence provenance and integrity

- Normal E2E screenshot evidence now records repository, commit, ref, triggering event, workflow, run ID, and run attempt.
- Tagged screenshot evidence records the same provenance plus the release tag.
- Both workflows hash every PNG into `SHA256SUMS.txt` before artifact upload and fail the evidence step if the manifest is empty.
- The release gate requires the provenance and hash-manifest wiring.
- `docs/screenshots/README.md`, `docs/testing.md`, `docs/release.md`, and `docs/release-readiness.md` now require checksum verification before screenshot promotion.

### PWA release artifact integrity

- Tagged releases generate `gradecraft-pwa.zip.sha256` after packaging the already-verified `dist/` output.
- The ZIP and checksum are staged together as a short-lived Actions artifact before the write-capable publish job starts.
- GitHub releases publish both `gradecraft-pwa.zip` and `gradecraft-pwa.zip.sha256`.
- The release gate requires PWA checksum generation, staging, download, and publication wiring.

### Local persistence resilience

- Fixed startup behavior when Local Storage reads throw `SecurityError` or another access exception; GradeCraft now falls back safely instead of crashing before its storage error handling runs.
- A failed/interrupted recovery-record read no longer triggers destructive cleanup of possibly recoverable data.
- `clearData()` now reports failure safely instead of throwing through the UI.
- `AppProvider` tracks whether the latest persistence write succeeded.
- Failed local-data clearing does not reset only the in-memory view while stale data remains persisted.
- A localized English/Hindi alert tells users when changes could not be persisted and may be lost on reload.
- Storage logging continues to record only safe error classifications, not raw storage contents.

### Persistence regression coverage

`tests/storage.test.ts` now additionally covers:

- denied primary storage access;
- interrupted recovery inspection without destructive cleanup;
- failed local-data clearing.

`tests/App.test.tsx` now covers the visible persistence-failure warning.

### Dialog accessibility and behavior

- Reusable native `<dialog>` instances now expose their visible heading through `aria-labelledby`.
- Modal close controls require an explicit accessible label instead of a hardcoded English label.
- Dashboard, course/assignment, and grading-scale dialogs pass the existing localized cancel text as that close label.
- Controlled dialog closure ignores the follow-up native `close` event after the parent has already closed state, preventing duplicate close callbacks.
- Added `tests/Modal.test.tsx` for dialog/heading association, explicit close naming, and native cancel handling.

### Navigation accessibility

- Primary navigation now marks the active destination with `aria-current="page"`.
- Course-specific what-if URLs correctly mark the what-if navigation destination current.
- `tests/App.test.tsx` covers dashboard and what-if current-navigation state.
- `docs/accessibility.md` now documents dialog heading/close semantics, current navigation announcements, and persistence alerts.

### What-if stale-route recovery

- A bookmarked what-if URL referencing a deleted course now falls back to an available course instead of rendering a blank planner.
- If the selected course later disappears from application data, planner state recovers to the first remaining course and resets stale score/category overrides.
- Added `tests/WhatIfPage.test.tsx` for deleted-course deep-link recovery.

### Cross-platform export filename safety

- Added centralized filename sanitation in `src/utils/download.ts` before either browser download or Tauri save-dialog handling.
- Illegal filesystem/path characters and ASCII control characters are replaced.
- Trailing dots/spaces are removed.
- Windows reserved device names such as `CON` and `LPT1` are made safe.
- Empty/unusable names fall back to `gradecraft-export.txt`.
- Excessively long filenames are capped while preserving an extension when possible.
- Added `tests/download.test.ts` covering all of these boundaries.

### Release-gate expansion

`scripts/check-release-gate.mjs` now protects, in addition to its previous checks:

- CI/E2E/Native/CodeQL manual dispatch support;
- concurrency cancellation controls;
- CodeQL initialization/analysis wiring;
- screenshot repository/ref/event provenance;
- screenshot SHA-256 manifests;
- PWA release ZIP checksum publication;
- staged release asset handoff;
- read-only verification/write-only publication separation;
- non-persisted checkout credentials on every project-code checkout.

### Documentation synchronized on 2026-08-23

Updated:

- `CHANGELOG.md` with an Unreleased section for persistence, accessibility, routing, export, workflow, evidence-integrity, and release-security changes;
- `docs/release.md` with screenshot hash verification, PWA archive checksum verification, and the two-job least-privilege release flow;
- `docs/testing.md` with Modal, storage-denial, persistence-warning, navigation, stale-route, and filename-safety regression coverage;
- `docs/release-readiness.md` with exact-ref rerun controls, screenshot/PWA integrity gates, checkout isolation, and the tagged publication boundary;
- `docs/accessibility.md` with current-route semantics, dialog announcement requirements, and persistence alert behavior;
- `docs/screenshots/README.md` with exact provenance and checksum verification before image promotion.

## 2026-08-23 continuation commits before this handoff update

### Workflow rerun/concurrency hardening

- `e31d39c9` — ci(quality): cancel superseded runs and allow manual verification
- `ccd150d7` — ci(e2e): cancel superseded browser runs
- `00b43c29` — ci(native): allow manual runs and cancel superseded builds
- `4b973a84` — ci(codeql): allow manual scans and cancel superseded runs
- `1a169e96` — test(release): protect rerunnable concurrency controls

### Dialog accessibility

- `c04b65b0` — fix(a11y): bind modal dialogs to visible headings
- `450b5337` — fix(a11y): localize dashboard modal close label
- `00572e59` — fix(a11y): localize course modal close labels
- `5d6d4275` — fix(a11y): localize settings modal close label
- `7d9c8fca` — refactor(a11y): require explicit modal close labels
- `f250956c` — test(a11y): cover modal naming and cancel behavior

### Persistence resilience

- `6b5ec10b` — fix(storage): survive inaccessible local storage reads
- `365ae10d` — test(storage): cover denied and interrupted reads
- `5f9c57ed` — feat(i18n): add persistence failure safety message
- `d951ba1d` — fix(storage): handle local data clear failures safely
- `e437f849` — feat(state): expose local persistence health
- `b108c3e8` — feat(data): warn when local persistence fails
- `870ddf71` — test(storage): cover failed local data clearing
- `e1df2dc9` — test(data): surface failed persistence to users

### Screenshot provenance/integrity

- `68d1e671` — ci(e2e): record screenshot provenance context
- `5c823b30` — ci(e2e): hash publication screenshot candidates
- `2cd94143` — ci(release): record tagged screenshot provenance
- `5a255e22` — ci(release): hash tagged screenshot candidates
- `2fd1e1e7` — test(release): require screenshot provenance hashes

### Navigation accessibility

- `c6d86b36` — fix(a11y): mark current primary navigation item
- `bc5ee82f` — test(a11y): cover current navigation state

### PWA release integrity and least privilege

- `768acaf9` — ci(release): generate PWA archive checksum
- `c9b1e6d6` — ci(release): publish PWA checksum beside archive
- `ec2c9e58` — test(release): require published PWA checksum
- `37d28913` — ci(release): isolate write permission to publish job
- `0844dbc1` — test(release): protect least-privilege publish split

### Checkout credential isolation

- `71f49bb1` — ci(security): avoid persisted checkout credentials in quality job
- `829014b8` — ci(security): avoid persisted checkout credentials in E2E
- `9c479925` — ci(security): avoid persisted credentials in native jobs
- `787b2eba` — ci(security): avoid persisted checkout credentials in CodeQL
- `f5806c06` — ci(security): avoid persisted credentials during release verification
- `8af427ae` — test(security): require isolated checkout credentials

### Routing and export hardening

- `b9c34c9d` — fix(routing): recover stale what-if course selections
- `528a5db7` — test(routing): cover stale what-if deep links
- `b3b154ed` — fix(export): sanitize filenames across native and web targets
- `08705c68` — test(export): cover cross-platform filename sanitization

### Documentation synchronization

- `889ee979` — docs(changelog): record continuation hardening
- `8c98eeb6` — docs(release): document integrity and least-privilege publication
- `b9768008` — docs(testing): document new resilience regressions
- `4a48e72a` — docs(readiness): add workflow and artifact integrity gates
- `e1ab1d97` — docs(a11y): document dialog and navigation semantics
- `1ed1d6f2` — docs(screenshots): require checksum verification before promotion

## Existing cross-platform implementation retained

- Tauri/Rust shared desktop/mobile runtime under `src-tauri/`.
- Native identifier `in.sanskar.gradecraft`.
- Desktop all-target bundling configuration.
- Android minimum SDK 24 and iOS minimum system version 14.0.
- Local-window capability with dialog/file-write permissions required by exports.
- Native icon generation from `public/icons/icon.svg`.
- Device-aware Vite hosting/HMR for Tauri mobile development.
- Service-worker registration restricted to HTTP/HTTPS production origins so packaged native WebViews skip PWA worker registration.
- Shared domain/data/state/localization/backup formats across web and native targets.
- Native CI on Ubuntu, Windows, macOS plus Android/iOS project generation.
- Package/changelog/handoff/About/native version synchronization.
- Static release gate, documentation links, secret scan, bundle budgets, dependency audit, CodeQL, Playwright diagnostics, coverage artifacts, and release tag validation.

## Verification performed / not performed in this environment

### Source/repository inspection performed

- Inspected the current `main` handoff, roadmap, package scripts, workflows, release gate, storage/state/UI persistence paths, reusable modal, navigation, what-if routing, shared download utility, tests, screenshot documentation, and release documentation through the connected GitHub repository.
- Compared the continuation start SHA to the post-documentation SHA and confirmed the repository was 47 commits ahead and 0 behind before this handoff commit.
- GitHub combined-status/workflow surfaces did not provide positive executable evidence at the beginning of the continuation. Missing status contexts are not treated as a pass.

### Local execution unavailable

The execution sandbox could not resolve `github.com` from its shell when repository access was attempted earlier in this continuation, so a clean clone, registry-backed `npm install`, local `npm run verify`, Playwright execution, Cargo/native checks, and dependency audit were not performed here. No passing test/build/CI result is fabricated.

The repository-side workflows remain the authoritative executable verification path until a network-enabled clean checkout is available.

## Exact 2.0.12 shared release gates

Run from a clean network-enabled checkout:

```bash
npm install
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
npm run native:icons
npm run native:check
npm run release:tag -- v2.0.12
```

Then run the applicable target build:

```bash
# Windows/macOS/Linux
npm run native:build

# Android
npm run android:init
npm run android:build -- --apk
npm run android:build -- --aab

# iOS/iPadOS on macOS
npm run ios:init
npm run ios:build
```

## Publication evidence still required

1. Obtain positive CI, E2E, Native CI, CodeQL, dependency-audit, version-sync, release-gate, test, build, and bundle-budget evidence for the exact final 2.0.12 commit.
2. Download the successful exact-commit `publication-screenshots-<sha>` artifact, verify `EVIDENCE.txt`, verify every PNG against `SHA256SUMS.txt`, visually review every capture, and promote only accepted images to `docs/screenshots/`.
3. If/when `v2.0.12` is tagged, confirm the tag workflow passes, verify `release-screenshots-v2.0.12-<sha>`, and verify the published `gradecraft-pwa.zip` against `gradecraft-pwa.zip.sha256`.
4. Build and smoke-test Windows packages on Windows.
5. Build and smoke-test macOS packages on macOS.
6. Build and smoke-test intended Linux bundle formats on Linux.
7. Build APK/AAB and smoke-test Android on an emulator/device before store publication.
8. Build/sign iOS/iPadOS on macOS and smoke-test simulator/device behavior before distribution.
9. Verify standard backup, encrypted backup, and CSV interoperability between at least one browser build and one real native build.
10. Keep Android keystores, Apple certificates, provisioning credentials, and store secrets outside Git.
11. Generate/commit a trustworthy npm lockfile only from successful registry-backed dependency resolution if reproducible transitive locking is desired; do not fabricate one offline.
12. Publish and verify a hosted demo URL only if a public demo is desired.

## Open issues / limitations

- No known blocker/critical grade-calculation defect was identified during this continuation.
- Exact final workflow results are not yet positively evidenced in this environment, so the release is not declared green.
- Real native package builds, device smoke tests, signing/notarization/provisioning, cross-target portability checks, approved screenshots, and hosted deployment evidence remain external tasks.

## Migration notes

Application schema version remains `1`. These 2.0.12 hardening changes do not require a persistence migration and do not change JSON/CSV/encrypted-backup formats.

Before uninstalling a native application or clearing application data, users who need to retain local grades should export a backup.

## 2.0.12 release notes draft

GradeCraft 2.0.12 delivers the privacy-first grade-management experience through one shared React/TypeScript product across web/PWA, Windows, macOS, Linux, Android, and iOS/iPadOS source targets. The candidate combines weighted and points grading, GPA and what-if planning, semester organization/search, English/Hindi localization, local recovery, authenticated portable backups, flexible staged CSV import, hardened spreadsheet export boundaries, safe cross-platform filenames, offline PWA behavior, Tauri native packaging and save dialogs, guarded destructive data operations, explicit persistence-failure warnings, accessible dialogs/current navigation, comprehensive automated regressions, deterministic publication screenshot evidence with provenance/checksums, executable web/native release gates, exact tag/version checks, PWA archive checksums, and least-privilege GitHub release publication.

## Prior continuation completed on 2026-08-21

### Data-safety fixes

- Fixed encrypted restore cancellation so successfully decrypted data is not treated as accepted when the user declines the final destructive replacement confirmation.
- Encrypted restore passphrases are now retained when that confirmation is cancelled, allowing the user to retry without unnecessary re-entry.
- Plain JSON/CSV export write failures now surface a localized user-facing safety message instead of being logged silently.
- Added English and Hindi export-failure messaging without exposing raw filesystem exceptions.
- Preserved the existing rule that successful encrypted backup operations clear passphrases from live component state.

### Regression coverage

`tests/DataPage.test.tsx` covers successful encrypted export clearing, native save cancellation, export write rejection, standard restore cancellation, and encrypted restore cancellation/passphrase retention.

### Publication screenshot evidence automation

Added deterministic Playwright screenshot candidate capture for onboarding, dashboard, course detail, what-if, GPA, settings light/dark, and import/export. Candidate evidence is never automatically approved as repository publication screenshots, and browser screenshots are never native build evidence.

### Prior release-gate/documentation hardening

The static gate already protected screenshot-evidence tooling, native source/capability/package/version wiring, and shared quality steps. Release/testing/readiness/screenshot/roadmap/changelog documentation was synchronized for that baseline.

## Next exact work

1. Inspect GitHub Actions results for the final `main` SHA created by this handoff and fix any CI/E2E/Native/CodeQL failures rather than tagging around them.
2. If E2E is green, download the exact-SHA screenshot artifact, verify provenance and `SHA256SUMS.txt`, visually review it, and promote only accepted real captures.
3. Run the complete 2.0.12 clean-checkout release gate from a network-enabled environment.
4. Perform real platform package builds/smoke tests and web/native portability checks.
5. Only after all required exact-commit evidence is positive, validate and create `v2.0.12`; then verify the published PWA ZIP checksum and retain exact-tag evidence.
