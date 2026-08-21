# GradeCraft Work Handoff

## Current milestone

**Package version:** 2.0.12  
**Milestone:** Release-evidence hardening after cross-platform source completion  
**Release state:** PWA, Windows, macOS, Linux, Android, and iOS/iPadOS source support is implemented. Browser screenshot evidence is now automated, but the exact release commit still needs positive CI/E2E/Native/CodeQL evidence plus real platform build/smoke evidence before publication is called green.  
**Date:** 2026-08-21

## Completed product scope

GradeCraft is a privacy-first TypeScript + React application delivered through a shared PWA frontend and Tauri 2 native shell. The shared product includes weighted and points grading, custom courses/categories/assignments/scales, GPA, what-if planning, weighted target-score solving, semester organization/search, charts, English/Hindi localization, local persistence/recovery, JSON and CSV portability, encrypted backups, offline PWA behavior, accessibility preferences, responsive layouts, onboarding, and light/dark/system themes.

Native source support covers Windows, macOS, Linux, Android, and iOS/iPadOS. Native exports use system save dialogs and the Tauri filesystem plugin while browser/PWA exports retain normal download behavior.

## Continuation completed on 2026-08-21

### Data-safety fixes

- Fixed encrypted restore cancellation so successfully decrypted data is not treated as accepted when the user declines the final destructive replacement confirmation.
- Encrypted restore passphrases are now retained when that confirmation is cancelled, allowing the user to retry without unnecessary re-entry.
- Plain JSON/CSV export write failures now surface a localized user-facing safety message instead of being logged silently.
- Added English and Hindi export-failure messaging without exposing raw filesystem exceptions.
- Preserved the existing rule that successful encrypted backup operations clear passphrases from live component state.

### Regression coverage

`tests/DataPage.test.tsx` now covers:

- successful encrypted export clearing passphrase fields;
- native encrypted-export save cancellation without false success;
- plain backup export write rejection with visible user feedback;
- standard restore cancellation without replacing local state;
- encrypted restore cancellation while retaining the entered passphrase.

### Publication screenshot evidence automation

Added `e2e/publication-screenshots.spec.ts` to exercise and capture deterministic full-page candidates from the real production UI for:

1. onboarding;
2. course dashboard;
3. representative course detail;
4. what-if planner;
5. GPA view;
6. settings in light theme;
7. settings in dark theme;
8. import/export.

The normal E2E workflow now uploads screenshot candidates only after successful Chromium E2E. The artifact name includes the exact commit SHA, and `EVIDENCE.txt` records commit/workflow/run identifiers.

The tag-release workflow now captures the same views against the already-built `dist/` artifact and uploads `release-screenshots-<tag>-<commit-sha>` only after release E2E succeeds. Its `EVIDENCE.txt` also records the tag.

These outputs are explicitly **candidate evidence**, not automatically approved repository screenshots. A release operator must verify the exact successful run and visually inspect the files before promoting them into `docs/screenshots/`. Browser screenshots are not evidence that any native package was built.

### Release-gate hardening

`scripts/check-release-gate.mjs` now requires:

- `e2e/publication-screenshots.spec.ts` to remain present;
- normal E2E screenshot artifact wiring and evidence metadata;
- tag-release screenshot artifact wiring and tag/commit evidence metadata;
- the existing shared/native quality, version, package, security-capability, and workflow markers.

This prevents screenshot-evidence tooling from silently disappearing while the repository still reports that its static release structure is valid.

### Documentation synchronized

Updated:

- `docs/screenshots/README.md` with the candidate-to-publication promotion procedure;
- `docs/testing.md` with the new DataPage regressions and screenshot E2E coverage;
- `docs/release-readiness.md` with browser screenshot evidence requirements and platform-evidence boundaries;
- `docs/release.md` with exact normal/tag screenshot artifact behavior;
- `ROADMAP.md` to record completed screenshot automation while keeping actual verified screenshot publication unchecked;
- `CHANGELOG.md` with the data-safety fixes and release-evidence additions.

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

- Inspected the current `main` handoff, roadmap, package scripts, workflows, release gate, data portability UI/tests, Playwright configuration/helpers/specs, screenshot documentation, and release documentation through the connected GitHub repository.
- Confirmed no open repository issues were returned during this continuation.
- Confirmed repository search returned no `TODO`, `FIXME`, `HACK`, or `XXX` markers during this continuation.
- GitHub combined-status queries exposed no status contexts for the inspected direct-push commits. An empty status response is **not** treated as a pass.

### Local execution unavailable

The execution sandbox still could not resolve `github.com` from its shell when attempting repository access, so a clean clone, registry-backed `npm install`, local `npm run verify`, Playwright execution, Cargo/native checks, and dependency audit could not be performed here. No passing test/build/CI result is fabricated.

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
2. Download the successful exact-commit `publication-screenshots-<sha>` artifact, verify `EVIDENCE.txt`, visually review every capture, and promote accepted images to `docs/screenshots/`.
3. If/when `v2.0.12` is tagged, confirm the tag workflow passes and retain/review `release-screenshots-v2.0.12-<sha>` evidence.
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
- Exact latest workflow results are still not positively visible through the available status surface, so the release is not declared green.
- Real native package builds, device smoke tests, signing/notarization/provisioning, cross-target portability checks, and approved screenshots remain external evidence tasks.

## Migration notes

Application schema version remains `1`. These 2.0.12 hardening changes do not require a persistence migration and do not change JSON/CSV/encrypted-backup formats.

Before uninstalling a native application or clearing application data, users who need to retain local grades should export a backup.

## 2.0.12 release notes draft

GradeCraft 2.0.12 delivers the privacy-first grade-management experience through one shared React/TypeScript product across web/PWA, Windows, macOS, Linux, Android, and iOS/iPadOS source targets. The candidate combines weighted and points grading, GPA and what-if planning, semester organization/search, English/Hindi localization, local recovery, authenticated portable backups, flexible staged CSV import, hardened spreadsheet export boundaries, offline PWA behavior, Tauri native packaging and save dialogs, guarded destructive data operations, stronger export/restore error handling, comprehensive automated tests, deterministic publication screenshot evidence, executable web/native release gates, exact tag/version checks, and package-derived user-visible versioning.

## Recent continuation commits

### 2026-08-21 data and evidence hardening

- `59b4a426` — fix(data): preserve passphrase when restore is cancelled
- `f02442b3` — test(data): cover cancelled encrypted restores
- `f3cf80b7` — feat(i18n): add export failure safety message
- `ec33ab85` — fix(data): surface export write failures
- `760b03c1` — test(data): cover export write failure feedback
- `4cd0ee74` — test(e2e): capture publication screenshot candidates
- `b93c75a8` — ci(e2e): publish screenshot evidence artifacts
- `bbbf2b6e` — test(release): require screenshot evidence wiring
- `42810fdd` — ci(release): retain tagged screenshot evidence
- `8db4f8bb` — docs(screenshots): document verified capture workflow
- `26e1b0d3` — docs(testing): document screenshot evidence coverage
- `53c5d3ad` — docs(release): define screenshot evidence promotion
- `f26e3b44` — docs(release): integrate screenshot evidence artifacts
- `7f3fa63c` — docs(changelog): record release evidence hardening
- `50ed1e32` — docs(roadmap): track screenshot evidence automation
- `04da959c` — test(release): protect tagged screenshot evidence

### Prior native follow-up commits not previously listed in this handoff

- `303b7c71` — fix(native): make compile check fresh-checkout safe
- `eb6a13fb` — fix(native): await and handle native export outcomes
- `86ee3504` — test(native): model successful async export saves
- `7c81fb6a` — test(native): cover cancelled native backup saves

## Next exact work

1. Inspect the GitHub Actions results for the latest `main` SHA and fix any CI/E2E/native failures rather than tagging around them.
2. If E2E is green, review the exact-SHA screenshot artifact and promote only accepted real captures.
3. Run the complete 2.0.12 clean-checkout release gate from a network-enabled environment.
4. Perform real platform package builds/smoke tests and web/native portability checks.
5. Only after all required exact-commit evidence is positive, validate and create `v2.0.12`.
