# GradeCraft Work Handoff

## Current milestone

**Package version:** 2.0.12
**Branch:** `feature/full-cross-platform-support`
**Base commit:** `28616a38a079f1917115983f00cdcefe5aa97df5`
**Pull request:** #21 — `feat: complete cross-platform runtime and native verification`
**Milestone:** Full cross-platform runtime, responsive/mobile adaptation, native permission separation, and real native compile verification
**Date:** 2026-08-24

## Current support state

GradeCraft now has one shared React/TypeScript product surface for:

- responsive browser use;
- installable PWA use;
- ChromeOS through the browser/PWA target;
- Windows native desktop through Tauri;
- macOS native desktop through Tauri;
- Linux native desktop through Tauri;
- Android native application builds through Tauri;
- iOS/iPadOS native application builds through Tauri.

The grade engine, state model, persistence schema, localization, accessibility behavior, backup/encrypted-backup formats, CSV portability, and UI remain shared rather than being forked per operating system.

## Cross-platform continuation completed on 2026-08-24

### Shared runtime/platform detection

Added `src/platform/runtime.ts` as the single shared platform-environment adapter.

It detects:

- browser vs installed PWA vs Tauri native runtime;
- Windows, macOS, Linux, Android, iOS/iPadOS, generic web, and unknown native fallback;
- phone, tablet, and desktop form factor;
- touch/coarse-pointer availability;
- standalone installation state.

The detector handles the iPadOS Safari case where the browser can expose `MacIntel` while reporting multiple touch points.

At application startup it publishes:

- `data-platform`;
- `data-runtime`;
- `data-form-factor`;
- `data-touch`;
- `data-standalone`.

`src/main.tsx` initializes this environment before React renders.

### Mobile-safe responsive UI

Added `src/platform/platform.css`, loaded after the shared stylesheet.

The platform layer now includes:

- `env(safe-area-inset-*)` support for cutouts, rounded display corners, status regions, and gesture areas;
- `100dvh` sizing for mobile browser and installed-app viewport changes;
- additive safe-area spacing around the topbar, content, footer, onboarding, and dialogs;
- touch-target minimum sizing for coarse-pointer devices;
- 16px phone form controls to avoid unwanted mobile zoom behavior;
- sticky installed-phone navigation behavior;
- horizontal mobile navigation scrolling;
- short landscape-phone layout adjustments;
- safe-area-aware content width;
- overscroll suppression only for installed PWA/native runtimes, preserving normal browser pull-to-refresh behavior.

`index.html` now includes `viewport-fit=cover`, standard mobile standalone metadata, and Apple mobile-web-app metadata so installed PWA/native-like mobile presentation can use the safe-area rules correctly.

### Native capability separation

The native permission model is now target-specific:

- `src-tauri/capabilities/default.json`
  - platform-neutral shared capability;
  - local `main` window only;
  - `core:default` only.
- `src-tauri/capabilities/desktop-export.json`
  - generated desktop schema;
  - Linux, macOS, and Windows only;
  - dialog and file-write permissions required by user-requested exports.
- `src-tauri/capabilities/mobile-export.json`
  - generated mobile schema;
  - iOS and Android only;
  - dialog and file-write permissions required by user-requested exports.

This removes the desktop-schema assumption from mobile permissions while retaining the shared native export implementation.

### Real native build CI

`.github/workflows/native.yml` now verifies actual compilation instead of only native-project generation.

Desktop matrix:

- Ubuntu;
- Windows;
- macOS.

Each desktop runner regenerates native icons, performs `npm run native:check`, and compiles the debug desktop application with `npm run native:build -- --debug --no-bundle`.

Android CI:

1. configures Java and the installed Android NDK;
2. initializes the Android project;
3. compiles an x86_64 debug APK with `npm run android:build -- --debug --apk --target x86_64 --ci`;
4. uploads the APK as short-lived build evidence.

iOS CI:

1. runs on macOS;
2. initializes the iOS project;
3. compiles an unsigned Apple-Silicon simulator application with `npm run ios:build -- --debug --target aarch64-sim --no-sign`.

Store signing, notarization, provisioning, and production signing secrets remain deliberately outside pull-request CI.

### Cross-platform regression tests

Added `tests/platform.test.ts` covering:

- Android native phone detection;
- iPadOS PWA detection when Safari reports `MacIntel`;
- Windows native desktop detection;
- generic desktop browser fallback;
- root platform/runtime/form-factor/touch/standalone attributes.

### Release-gate hardening

`scripts/check-release-gate.mjs` now requires and validates:

- mobile installation/safe-area metadata;
- platform startup wiring;
- runtime and layout adaptation files;
- platform regression tests;
- all three native capability files;
- exact desktop/mobile capability platform sets and generated schemas;
- Android minimum SDK and explicit iOS minimum system version;
- actual desktop, Android APK, and iOS simulator compile commands in Native CI;
- Android smoke-build artifact retention;
- the existing CI, E2E, CodeQL, release, credential-isolation, screenshot-integrity, and PWA checksum gates.

### Strict quality-gate repairs found during PR validation

GitHub Actions exposed strictness defects that predated or were adjacent to the cross-platform work. They were fixed instead of weakening the checks.

TypeScript fixes:

- added explicit React class `override` modifiers in `ErrorBoundary`;
- preserved non-optional course narrowing in `CoursePage` callbacks;
- guarded indexed file inputs in data tests;
- typed the throwing ErrorBoundary test fixture as `never`;
- dispatched the native dialog `cancel` event explicitly;
- used Testing Library `within(dialog)` for scoped role queries.

Lint fixes:

- documented intentionally skipped scan roots instead of using empty catch blocks;
- simplified release-gate target marker quoting;
- removed control-character regular expressions from download filename sanitation while preserving the same safety policy;
- updated filename tests to assert character-code safety without prohibited regex controls;
- replaced fake-async mocks with explicit resolved promises.

Validation evidence before this handoff-only commit:

- strict TypeScript: passed;
- ESLint with zero warnings: passed;
- formatting: reached the gate and failed only because this Markdown handoff used trailing spaces for hard line breaks; those trailing spaces are removed in this commit.

Because every new commit intentionally causes the exact-head workflows to restart, CI/E2E/Native/CodeQL must be checked once more on the head containing this handoff update.

## Documentation updated

`README.md` and `docs/platforms.md` now document:

- browser/PWA/Windows/macOS/Linux/Android/iOS/iPadOS/ChromeOS support;
- runtime and form-factor detection;
- safe-area/dynamic-viewport/touch behavior;
- Android/iOS build entry points;
- platform-specific native security capabilities;
- real native CI compilation coverage;
- store-signing boundaries and troubleshooting.

## Commits created in this continuation

Core cross-platform work:

- `27277cdf` — feat(platform): add shared runtime platform detection
- `8ba06f59` — feat(platform): add mobile safe-area and touch adaptations
- `3b613089` — test(platform): cover native and browser target detection
- `7e6d00e7` — feat(platform): initialize runtime environment at startup
- `fd105df9` — feat(pwa): enable safe-area aware standalone installs
- `2114b3e7` — security(native): make baseline capability platform neutral
- `45c2fa41` — security(desktop): scope export permissions to desktop targets
- `2adf290b` — security(mobile): scope export permissions to mobile targets
- `195cefce` — ci(native): compile every supported native target
- `35bd88ab` — test(release): enforce full cross-platform build gates
- `f23495d3` — docs(platforms): document verified cross-platform architecture
- `a7341f13` — docs(platforms): cover mobile UX and native build verification
- `ec10295b` — fix(release): validate platform runtime wiring accurately
- `e65dd9e9` — docs(handoff): record complete cross-platform hardening
- `b6034278` — fix(platform): preserve browser refresh and safe-area spacing
- `2cc69103` — docs(handoff): record final mobile UX refinement

Strict validation repairs:

- `e6bf7105` — fix(types): mark error boundary overrides explicitly
- `5949691c` — fix(types): preserve course narrowing in action callbacks
- `80154d95` — test(types): guard encrypted restore file input
- `ed7777ce` — test(types): type throwing boundary fixture as never
- `2e2d83f8` — test(types): dispatch native dialog cancel event explicitly
- `051bf5a4` — test(types): use scoped dialog queries correctly
- `d00356a3` — fix(lint): document ignored formatting scan paths
- `81e9b0b8` — fix(lint): document ignored secret scan paths
- `ce0863c3` — fix(lint): simplify platform target marker checks
- `e8c3d1cf` — fix(export): sanitize control characters without control regex
- `3f8ffbdb` — test(export): assert control safety without control regex
- `2746b00d` — test(lint): use explicit resolved promises in data mocks

## Pull-request verification

PR #21 is open from `feature/full-cross-platform-support` into `main`.

The connected GitHub repository is the authoritative execution environment for this continuation because the local shell cannot resolve `github.com`; no local passing result is fabricated.

GitHub Actions now surfaces CI, E2E, Native, and CodeQL runs for the branch. Superseded runs are cancelled by workflow concurrency when a newer commit is pushed; cancellation of an older head is not treated as failure or success evidence for the new head.

## Exact validation commands

Shared/browser verification:

```bash
npm install
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
```

Desktop compile verification:

```bash
npm run native:icons
npm run native:check
npm run native:build -- --debug --no-bundle
```

Android debug smoke build:

```bash
npm run android:init -- --ci
npm run android:build -- --debug --apk --target x86_64 --ci
```

Android release package entry points:

```bash
npm run android:build -- --apk
npm run android:build -- --aab
```

iOS simulator smoke build on macOS:

```bash
npm run ios:init -- --ci
npm run ios:build -- --debug --target aarch64-sim --no-sign
```

iOS release entry point on a properly signed macOS environment:

```bash
npm run ios:build
```

## Release/publication boundaries still external

These require real platform/store environments and credentials and must not be falsely declared complete from source inspection alone:

1. Windows installer smoke testing on a real Windows host.
2. macOS signing/notarization and smoke testing on a real macOS host.
3. Linux bundle smoke testing on intended distributions/package formats.
4. Android device/emulator smoke testing and production APK/AAB signing.
5. iOS/iPadOS simulator/device smoke testing plus Apple signing/provisioning for distribution.
6. Browser-to-native and native-to-native backup/CSV interoperability smoke tests on real built applications.
7. Store listing, signing, privacy, and publication steps for stores actually used.

Android keystores, Apple certificates, provisioning credentials, notarization credentials, and store secrets must remain outside Git.

## Persistence/data migration

Application storage schema remains version `1`.

This continuation changes runtime detection, layout adaptation, native permission declarations, CI verification, tests, utility hardening, and documentation. It does not change the grade data model, JSON backup format, encrypted-backup format, or CSV portability format, so no user-data migration is required.

## Next exact work

1. Inspect CI/E2E/Native/CodeQL on the newest PR #21 head.
2. Fix every actionable failure rather than weakening a gate.
3. Merge PR #21 only after the exact-head evidence is acceptable and GitHub reports it mergeable.
4. Keep real-device/store signing and final distribution evidence as explicit release tasks.
