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
- safe topbar/content/footer/onboarding/dialog spacing;
- touch-target minimum sizing for coarse-pointer devices;
- 16px phone form controls to avoid unwanted mobile zoom behavior;
- sticky installed-phone navigation behavior;
- horizontal mobile navigation scrolling;
- short landscape-phone layout adjustments;
- safe-area-aware content width.

`index.html` now includes `viewport-fit=cover`, standard mobile standalone metadata, and Apple mobile-web-app metadata so installed PWA/native-like mobile presentation can use the safe-area rules correctly.

### Native capability separation

Replaced the previous single desktop-schema capability with three target-appropriate capability files:

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

This removes the desktop-schema assumption from the mobile permission definition while preserving the existing shared export implementation.

### Real native build CI

Upgraded `.github/workflows/native.yml` from scaffold-oriented validation to compilation-oriented validation.

Desktop matrix:

- Ubuntu;
- Windows;
- macOS.

Each desktop runner now:

1. installs its required toolchain/dependencies;
2. regenerates native icons;
3. runs `npm run native:check`;
4. compiles the actual debug desktop application with `npm run native:build -- --debug --no-bundle`.

Android CI now:

1. selects Java 17 and the installed Android NDK;
2. initializes the generated Android project;
3. compiles an x86_64 debug APK using `npm run android:build -- --debug --apk --target x86_64 --ci`;
4. uploads the APK as a short-lived workflow artifact when the build succeeds.

iOS CI now:

1. runs on macOS;
2. initializes the generated iOS project;
3. compiles an unsigned Apple-Silicon simulator application with `npm run ios:build -- --debug --target aarch64-sim --no-sign`.

Store signing, notarization, provisioning, and production signing secrets remain deliberately outside pull-request CI.

### Cross-platform regression tests

Added `tests/platform.test.ts` covering:

- Android native phone detection;
- iPadOS PWA detection when Safari reports `MacIntel`;
- Windows native desktop detection;
- generic desktop browser fallback to the web target;
- publication of platform/runtime/form-factor/touch/standalone root attributes.

### Release-gate hardening

Extended `scripts/check-release-gate.mjs` so cross-platform support cannot silently regress.

The static gate now requires and validates:

- `index.html` mobile installation/safe-area metadata;
- `src/main.tsx` platform initialization and stylesheet wiring;
- `src/platform/runtime.ts`;
- `src/platform/platform.css`;
- `tests/platform.test.ts`;
- all three native capability files;
- exact desktop and mobile capability platform sets;
- generated desktop/mobile capability schema references;
- Android minimum SDK configuration;
- explicit iOS minimum system version;
- actual desktop compile commands in Native CI;
- actual Android APK compile command in Native CI;
- actual unsigned iOS simulator compile command in Native CI;
- Android smoke-build artifact retention;
- all previously existing CI, E2E, CodeQL, release, credential-isolation, screenshot-integrity, and PWA checksum gates.

### Documentation updated

Updated `README.md` with:

- browser and PWA as explicit first-class targets;
- Windows/macOS/Linux/Android/iOS/iPadOS/ChromeOS support matrix;
- runtime and form-factor adaptation behavior;
- safe-area/touch/mobile behavior;
- platform-aware security capability structure;
- `src/platform/` architecture entry;
- actual Native CI compilation coverage.

Updated `docs/platforms.md` with:

- runtime/form-factor attribute contract;
- safe-area and dynamic-viewport behavior;
- Android CI compilation command;
- iOS unsigned simulator compilation command;
- desktop/mobile capability split;
- platform regression gates;
- real native compilation matrix;
- safe-area troubleshooting;
- updated source layout.

## Commits created in this continuation

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

This handoff update is committed separately after the implementation commits above.

## Pull-request verification

PR #21 was opened from `feature/full-cross-platform-support` into `main` after the implementation/release-gate/docs pass.

The connected repository is the authoritative execution environment for this continuation because the local shell still cannot resolve `github.com`, so a clean local clone and registry-backed dependency installation cannot be performed here. No local passing result is fabricated.

The exact PR head must receive positive evidence from the applicable GitHub workflows before the branch is treated as fully verified.

## Exact validation commands

Shared/browser verification:

```bash
npm install
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
```

Desktop source/runtime check:

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

These are not source-code blockers, but they require real platform/store environments and credentials and therefore must not be falsely declared complete from repository source inspection alone:

1. Windows installer smoke testing on a real Windows host.
2. macOS bundle signing/notarization and smoke testing on a real macOS host.
3. Linux bundle smoke testing on intended distributions/package formats.
4. Android APK/AAB device or emulator smoke testing and production signing.
5. iOS/iPadOS simulator/device smoke testing plus Apple signing/provisioning for distribution.
6. Browser-to-native and native-to-native backup/CSV interoperability smoke tests on real built applications.
7. App-store listing, signing, privacy, and publication steps for stores that are actually used.

Android keystores, Apple certificates, provisioning credentials, notarization credentials, and store secrets must remain outside Git.

## Persistence/data migration

Application storage schema remains version `1`.

The cross-platform work in this continuation changes runtime detection, layout adaptation, native permission declarations, CI verification, and documentation. It does not change the grade data model, JSON backup format, encrypted-backup format, or CSV portability format, so no user-data migration is required.

## Existing major hardening retained from the previous handoff

The 2026-08-23 handoff and its complete historical detail remain available in Git history at blob/commit history preceding this update. The current branch retains its work, including:

- local persistence failure handling and visible English/Hindi warnings;
- recovery-record safety;
- guarded local-data clearing;
- accessible modal heading/close semantics;
- `aria-current` navigation state;
- stale what-if route recovery;
- cross-platform filename sanitation;
- screenshot provenance and SHA-256 manifests;
- PWA archive checksum publication;
- read-only verification/write-only release publication separation;
- non-persisted checkout credentials;
- CI/E2E/Native/CodeQL manual dispatch and concurrency controls;
- version synchronization, release-tag checks, CodeQL, dependency audit, Playwright, coverage, documentation-link checks, bundle budgets, and release-readiness validation.

## Next exact work

1. Inspect CI/E2E/Native/CodeQL results for the newest PR #21 head SHA.
2. Fix every actionable workflow failure on the feature branch instead of weakening the checks.
3. Update this handoff with final workflow evidence if further fixes are required.
4. Merge PR #21 only when the repository reports it mergeable and required validation is acceptable.
5. Keep real device/store signing and final distribution evidence as explicit release tasks rather than source-level claims.
