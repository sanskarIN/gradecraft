# ADR 0008: Tauri cross-platform application shell

## Status

Accepted.

## Context

GradeCraft began as a client-only React/TypeScript progressive web application. The PWA architecture already provides strong portability, offline operation, local persistence, and a single implementation of grade calculations. It does not by itself produce native desktop installers, Android APK/AAB packages, or iOS application projects.

Maintaining separate native user interfaces in Kotlin, Swift, .NET, Electron, or another framework would duplicate product logic and substantially increase the risk that grading rules, backup formats, accessibility behavior, localization, and privacy guarantees diverge between platforms.

## Decision

Use Tauri 2 as a thin native shell around the existing Vite/React frontend.

The supported native targets are:

- Windows
- macOS
- Linux
- Android
- iOS/iPadOS

The existing browser/PWA target remains supported and is not replaced.

`src/` remains the primary application implementation. `src-tauri/` owns only native runtime configuration, native plugin registration, security capabilities, generated target projects, and packaging concerns.

The native shell registers the Tauri dialog and filesystem plugins so GradeCraft can save exported JSON/CSV data through native file pickers. Native capabilities are restricted to the local `main` window. Remote content is not granted native access.

The canonical application icon remains `public/icons/icon.svg`; Tauri icons are generated from it during native commands.

The web service worker is registered only on HTTP/HTTPS origins. Packaged Tauri applications use bundled frontend assets and therefore do not register the PWA service worker.

## Consequences

### Positive

- Grade calculations, GPA logic, validation, localization, accessibility, storage schemas, and portability formats remain shared.
- One frontend serves web, desktop, Android, and iOS.
- Desktop builds can produce native operating-system packages without an Electron/Chromium bundle.
- Android and iOS can use native file dialogs while preserving the same data format as the PWA.
- Native functionality is permission-gated through Tauri capabilities.
- Existing browser tests continue to validate most product behavior.

### Costs

- Native contributors must install Rust and platform-specific build dependencies.
- iOS development and release packaging require macOS/Xcode.
- Android development requires the Android SDK, NDK, Java runtime, and related command-line tools.
- Store publication still requires platform signing credentials and developer accounts; these are release-environment concerns, not repository secrets.
- A small amount of runtime-aware code is required where browser-only APIs such as service workers or downloads differ from native WebViews.

## Alternatives considered

### Keep PWA only

Rejected because it does not satisfy the requirement for first-class native packages across desktop and mobile.

### Electron for desktop plus a separate mobile framework

Rejected because it would introduce multiple application shells and duplicate platform integration work. Electron also does not solve Android/iOS packaging.

### Rewrite in Flutter, .NET MAUI, Kotlin Multiplatform, or another UI framework

Rejected because the current React/TypeScript application, tests, domain model, and accessibility work are already mature. A rewrite would create unnecessary regression risk and would not improve the core grading logic.

## Verification

Cross-platform support is guarded by:

- `npm run native:check` for the Rust/Tauri layer;
- `.github/workflows/native.yml` on Ubuntu, Windows, and macOS;
- Android/iOS scaffold generation in CI;
- the existing `npm run verify` web quality gate;
- version synchronization checks spanning `package.json`, Cargo, and Tauri configuration;
- the build and release procedures in `docs/platforms.md`.
