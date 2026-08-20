# GradeCraft Work Handoff

## Current milestone

**Package version:** 2.0.12  
**Release state:** Cross-platform source support is implemented for PWA, Windows, macOS, Linux, Android, and iOS/iPadOS; packaged native webviews are now security-hardened and release-gated; positive clean-runner/native-device evidence is still required before calling every platform release artifact green  
**Date:** 2026-08-20

## Completed product scope

GradeCraft is a privacy-first TypeScript + React application with one shared product implementation delivered as both a Progressive Web App and Tauri 2 native applications. The shared application includes weighted and points grading, custom courses/categories/assignments/scales, GPA, what-if planning, weighted target-score solving, semester organization/search, charts, English/Hindi localization, local persistence/recovery, JSON and CSV portability, encrypted backup files, PWA offline support, accessibility preferences, and responsive layouts.

Native source support now covers:

- Windows
- macOS
- Linux
- Android
- iOS/iPadOS

The repository includes unit/domain/data/component/property tests, Playwright browser journeys, CI, E2E, Native CI, CodeQL, Dependabot, release automation, documentation-link checks, secret checks, cross-platform release-readiness checks, web/native version synchronization, production bundle budgets, release-tag validation, coverage artifacts, Playwright diagnostics, and release-gated native webview security controls.

## Native security hardening continuation on 2026-08-20

### Packaged webview security

- Replaced the permissive `csp: null` native configuration with an explicit restrictive Content Security Policy.
- Limited packaged content to local application sources plus Tauri IPC endpoints required by native APIs.
- Allowed only the local/data/blob image sources needed by GradeCraft UI behavior.
- Blocked objects, frames, framing, off-origin form targets, mutable base URLs, and wildcard CSP sources.
- Enabled Tauri `freezePrototype` so packaged custom-protocol pages freeze `Object.prototype`.
- Kept Tauri asset CSP rewriting enabled; the release gate now rejects configuration that explicitly disables it.
- Preserved the existing local-window capability model: the `main` window receives only core defaults plus dialog/file permissions required for user-selected exports.

### Release-regression protection

- Expanded `scripts/check-release-gate.mjs` so packaged native CSP is mandatory.
- The release gate checks required CSP directives, rejects wildcard sources, requires `freezePrototype: true`, and rejects explicit disabling of Tauri asset CSP modification.
- Added `docs/adr/0009-native-webview-hardening.md` and made it a required release asset.
- Updated `SECURITY.md` with the native webview trust boundary and the new release invariants.
- Updated `docs/release-readiness.md` with native security verification and smoke-test evidence requirements.
- Updated `CHANGELOG.md` with the completed hardening work.

### CI quality-of-life improvements

- Main CI, Playwright E2E, and Native CI now cancel superseded runs for the same ref so stale commits do not consume runner time or obscure the newest verification result.
- Main CI and Native CI now support manual workflow dispatch for explicit release-evidence collection.
- Existing least-privilege workflow permissions remain unchanged.

## Cross-platform continuation completed on 2026-08-20

### Native shell and packaging

- Added `src-tauri/build.rs`.
- Added a Tauri/Rust `Cargo.toml` synchronized to GradeCraft package version `2.0.12`.
- Added shared desktop/mobile entry point `src-tauri/src/lib.rs` using `#[cfg_attr(mobile, tauri::mobile_entry_point)]`.
- Added desktop executable entry point `src-tauri/src/main.rs`.
- Added `src-tauri/tauri.conf.json` using the existing `dist/` frontend and `http://localhost:5173` development server.
- Configured native bundle identifier `in.sanskar.gradecraft`.
- Enabled Tauri bundle generation for desktop targets.
- Configured Android minimum SDK 24.
- Configured iOS minimum system version 14.0.
- Added Tauri Dialog and File System plugins for native exports.
- Added local-window native capability configuration in `src-tauri/capabilities/default.json`.
- Added `src-tauri/.gitignore` for Cargo output, generated capability schemas, and generated icon assets.

### Shared browser/native behavior

- Kept the browser/PWA download flow for normal web builds.
- Added native system save dialogs for packaged Tauri exports.
- Added platform-aware text-file writing for JSON backups, encrypted backups, and CSV exports.
- Added Android/iOS-compatible URI handling through Tauri's filesystem layer.
- Changed service-worker registration so it runs only on HTTP/HTTPS production origins and is skipped inside packaged native application protocols.
- Updated Vite to respect `TAURI_DEV_HOST` for physical-device development.
- Added device-safe HMR WebSocket configuration for mobile development.
- Kept the shared grade engine, data model, backup formats, CSV format, localization, accessibility behavior, and state model platform-independent.

### Native commands

Added package scripts for:

```text
npm run native:icons
npm run native:check
npm run native:dev
npm run native:build
npm run android:init
npm run android:dev
npm run android:build -- --apk
npm run android:build -- --aab
npm run ios:init
npm run ios:dev
npm run ios:build
```

Native development/build/mobile scripts automatically generate platform icons from `public/icons/icon.svg`, leaving the existing SVG as the single canonical icon source.

### CI and release safety

- Added `.github/workflows/native.yml`.
- Native CI compile-checks the Tauri core on Ubuntu, Windows, and macOS.
- Native CI validates Android project generation on Linux with Android tooling.
- Native CI validates iOS project generation on macOS.
- Expanded `scripts/check-version-sync.mjs` to require `src-tauri/Cargo.toml` to match `package.json` and Tauri to source its application version from `../package.json`.
- Expanded `scripts/check-release-gate.mjs` so native source files, native security capabilities, native scripts, `docs/platforms.md`, ADR 0008, ADR 0009, and Native CI are required release assets.
- The release gate checks the Tauri identifier, all-target desktop bundle setting, shared `dist/` frontend path, required native permissions, required Rust plugins, and packaged webview security baseline.

### Documentation

- Added `docs/platforms.md` with complete web, Windows, macOS, Linux, Android, and iOS/iPadOS prerequisites and commands.
- Added `docs/adr/0008-tauri-cross-platform-shell.md` documenting the one-codebase Tauri decision.
- Added `docs/adr/0009-native-webview-hardening.md` documenting native CSP/prototype/capability security decisions.
- Updated README with the full platform support matrix and exact native/mobile build commands.
- Updated setup documentation with native prerequisites and first-run commands.
- Updated development documentation with desktop/mobile commands and cross-platform engineering rules.
- Updated architecture documentation with explicit shared, web, and native platform layers.
- Updated release documentation with per-platform build, smoke-test, data-compatibility, signing, and evidence requirements.
- Updated release-readiness documentation so source support is not confused with a verified signed release artifact.
- Updated the changelog with cross-platform additions and the subsequent native security hardening.

## Existing 2.0.12 safeguards retained

- The About screen derives its displayed application version directly from `package.json`.
- Hardcoded semantic-version strings are absent from the English and Hindi message catalogs.
- CSV spreadsheet-export neutralization protects tab, carriage-return, line-feed, `=`, `+`, `-`, and `@` prefixes while preserving GradeCraft round trips.
- Documentation links are verified locally and in CI.
- Production JavaScript/CSS/total bundle sizes are subject to executable budgets.
- Release tags must match `package.json` exactly.
- Tag releases run shared verification, dependency audit, Chromium E2E against the already verified production build, retain diagnostics, and package only after gates pass.
- Deterministic property coverage exercises generated grade calculations, target-score solvers, and CSV edge-label round trips.
- Packaged native builds have release-gated CSP and prototype-hardening requirements.

## Verification status for the current continuation

Repository-side source changes are complete on the hardening branch, but the exact branch head still requires positive workflow evidence before being merged or called green. No passing result is fabricated from a missing or pending status context.

Repository-side executable verification is provided by:

- `.github/workflows/ci.yml` for shared TypeScript/lint/tests/build/audit gates;
- `.github/workflows/e2e.yml` for browser journeys;
- `.github/workflows/native.yml` for desktop native compile checks and Android/iOS project generation;
- CodeQL for static security analysis.

The exact latest commit must have positive workflow evidence before the native release state is called green.

## Exact 2.0.12 release gates

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

Then run the applicable platform build from its supported host:

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

Do not label the exact 2.0.12 candidate or an individual native artifact green until the relevant shared checks, Native CI, platform build, and smoke-test evidence are positively visible.

## Platform release evidence still required

1. Confirm the latest CI, E2E, Native CI, CodeQL, dependency-audit, version-sync, release-gate, bundle-budget, and native-CSP gate results for the exact 2.0.12 release commit.
2. Build Windows native packages on Windows and smoke-test them, including startup and export dialogs under the enforced CSP.
3. Build macOS native packages on macOS and smoke-test them, including startup and export dialogs under the enforced CSP.
4. Build intended Linux package formats on Linux and smoke-test them, including startup and export dialogs under the enforced CSP.
5. Build Android APK/AAB output and smoke-test an emulator/device before store publication.
6. Build and sign the iOS/iPadOS artifact on macOS using the intended Apple distribution configuration and smoke-test simulator/device behavior.
7. Verify backup/encrypted-backup/CSV interoperability between at least one web and one native target.
8. Capture real screenshots from positively verified target builds and place them in `docs/screenshots/`.
9. Keep Android keystores, Apple signing certificates, provisioning credentials, and all store secrets outside Git.
10. Generate and commit a trustworthy npm lockfile only from a successful registry-backed dependency resolution if reproducible transitive dependency locking is desired; no lockfile is fabricated in an offline environment.

## Open issues

- No known blocker/critical grade-calculation defect is introduced by the cross-platform shell or this security-hardening continuation.
- Native build/release evidence remains an external verification item until current Actions and real platform packages are positively verified.

## Migration notes

Application schema version remains `1`. Package version 2.0.12 does not require a persistence migration. The Tauri shell uses the same application state and portability formats rather than introducing a second native data schema.

Before uninstalling a native application or clearing its application data, users who need to retain local grades should export a backup.

## 2.0.12 release notes draft

GradeCraft 2.0.12 delivers the completed privacy-first grade-management experience as one shared application across the web/PWA, Windows, macOS, Linux, Android, and iOS/iPadOS source targets. The release combines weighted target planning, semester organization/search, English/Hindi localization, authenticated portable backups, staged flexible CSV import, stronger data-integrity safeguards, hardened spreadsheet export boundaries, offline PWA behavior, native save dialogs, Tauri desktop/mobile packaging, packaged-webview CSP/prototype hardening, expanded automated tests, executable web/native release gates, diagnostic CI artifacts, tag/version enforcement, and package-derived user-visible versioning protected by synchronization checks.

## Native security hardening commits

- `e201df1` — security(native): enforce restrictive webview CSP
- `5427f9b` — security(native): freeze Object prototype in packaged app
- `cd84a97` — test(release): enforce native webview security baseline
- `bcb39c9` — ci: cancel superseded quality runs
- `f95dc19` — ci(e2e): cancel superseded browser runs
- `4648cb4` — ci(native): cancel superseded platform runs
- `b63f915` — docs(adr): record native webview hardening decision
- `e2e7550` — test(release): require native security ADR
- `fa9ab75` — docs(security): document native webview protections
- `dade94e` — docs(changelog): record native security hardening
- `1ad6642` — docs(release): add native security verification evidence

## Cross-platform implementation commits

- `63a2095` — feat(native): add Tauri build entrypoint
- `112630f` — feat(native): add cross-platform Rust manifest
- `508d8dd` — feat(native): add desktop application entrypoint
- `f3a071d` — feat(native): add shared desktop and mobile runtime
- `2816bfc` — feat(native): configure all Tauri target platforms
- `a22ea01` — feat(native): grant export-only native capabilities
- `7c73b5a` — feat(native): add cross-platform file plugins
- `9a63cb2` — feat(native): add cross-platform build commands and packages
- `042d720` — fix(native): make Vite development host mobile-aware
- `ded56ad` — fix(native): skip web service worker in packaged apps
- `fbb8875` — feat(native): save exports with native dialogs
- `d3422fd` — fix(native): generate application icons before native commands
- `67092ef` — chore(native): ignore generated native build artifacts
- `ce54a41` — test(native): enforce web and native version synchronization
- `14eef45` — ci(native): validate desktop and mobile targets
- `bc3c33e` — docs(native): add complete cross-platform build guide
- `d608d5e` — docs(architecture): record Tauri cross-platform decision
- `601841c` — fix(native): configure device-safe Vite HMR
- `65bf6dd` — docs(native): expand setup for desktop and mobile targets
- `3c5509e` — docs(native): document cross-platform development workflow
- `124deba` — docs(architecture): integrate native platform layer
- `6f47c7c` — docs(release): add native platform release gates
- `f128d42` — test(native): make cross-platform assets release-critical
- `bba3c83` — docs(readme): publish full cross-platform support matrix
- `7631398` — docs(release): add cross-platform readiness evidence
- `a078f34` — docs(changelog): record full cross-platform support
