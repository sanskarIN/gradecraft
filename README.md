# GradeCraft

<p align="center">
  <img src="public/icons/icon.svg" width="112" alt="GradeCraft logo" />
</p>

<p align="center"><strong>Know where you stand. Plan where you want to go.</strong></p>

<p align="center">
  <a href="https://github.com/sanskarIN/gradecraft/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/sanskarIN/gradecraft/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://github.com/sanskarIN/gradecraft/actions/workflows/native.yml"><img alt="Native CI" src="https://github.com/sanskarIN/gradecraft/actions/workflows/native.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-blue.svg" /></a>
  <a href="https://buymeacoffee.com/sanskarIN"><img alt="Buy Me a Coffee" src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-sanskarIN-FFDD00?logo=buy-me-a-coffee&logoColor=000000" /></a>
</p>

**GradeCraft** is a privacy-first, offline-capable student grade calculator built from one TypeScript + React codebase and delivered as both a Progressive Web App and native Tauri applications. It supports weighted and points-based grading, what-if planning, custom GPA scales, semester organization, charts, encrypted backups, flexible CSV transfer, English/Hindi UI, and accessible keyboard-friendly workflows.

> **Made by the Sanskar**

## Platforms

GradeCraft targets the major web, desktop, tablet, and mobile platforms from the same application codebase:

| Platform | Support | Delivery |
| --- | --- | --- |
| Web | Supported | Responsive browser application / static `dist/` build |
| PWA | Supported | Installable offline-capable app on compatible desktop and mobile browsers |
| Windows | Supported | Tauri native desktop application |
| macOS | Supported | Tauri native desktop application |
| Linux | Supported | Tauri native desktop application |
| Android | Supported | Tauri Android application, APK/AAB builds |
| iOS / iPadOS | Supported | Tauri iOS application and Apple distribution workflow on macOS |
| ChromeOS | Supported through modern browser/PWA | Progressive Web App |

Native packaging uses Tauri 2 while the PWA remains a first-class target. The grade engine, data schema, backups, CSV format, localization, accessibility behavior, UI, and tests stay shared instead of being reimplemented per operating system.

The frontend detects browser/PWA/native runtime and phone/tablet/desktop form factor, exposes those signals through root data attributes, handles mobile display cutouts and gesture safe areas, preserves touch-friendly target sizing, and uses dynamic viewport units for installed mobile applications.

See [`docs/platforms.md`](docs/platforms.md) for platform prerequisites, native build commands, Android executable/package commands, iOS requirements, signing boundaries, artifact locations, and troubleshooting.

## Screenshots

Real release screenshots should be captured from verified built applications and placed in `docs/screenshots/`. The repository does not use misleading mock screenshots as proof of functionality.

## Features

- Weighted categories with strict 100% weight validation
- Unweighted points-based calculation
- Custom courses, categories, assignments, credit hours, and grading scales
- Optional semester/term metadata with grouped dashboard views and filtering
- What-if score overrides that never mutate saved grades
- Target-score planning for both points-based and weighted-category courses
- Credit-weighted GPA using user-defined scale profiles
- Score trend and category contribution charts
- CSV export with spreadsheet-formula neutralization
- CSV import with reviewable arbitrary header mapping and common alias suggestions
- Full JSON backup/restore
- Optional authenticated encrypted backup files for storage with any user-chosen provider
- Privacy-first local browser/WebView storage with a recovery copy and delete controls
- English and Hindi interface catalogs with a persisted language setting
- Offline PWA shell with service-worker caching
- Native Windows, macOS, Linux, Android, and iOS shells through Tauri 2
- Native save dialogs for JSON, encrypted-backup, and CSV exports
- Runtime-aware browser/PWA/native and platform detection
- Mobile safe-area, dynamic-viewport, touch-target, and phone/tablet adaptations
- Light, dark, and system themes
- Reduced-motion and compact accessibility preferences
- Responsive phone/tablet/desktop layouts
- Keyboard navigation, visible focus states, semantic tables/forms, and screen-reader labels
- Application-level error recovery UI
- No account, backend, analytics, or required cloud service

## Privacy model

Grade data is stored locally in the current browser or installed application's WebView storage. GradeCraft does not require sign-in or transmit grades, backup contents, or backup passphrases to a GradeCraft server. Imports are parsed locally.

Native packaging does not introduce a backend. Tauri uses a shared core capability plus separate desktop and mobile export capabilities, keeping native dialog and file-write access limited to the local GradeCraft window and the user-requested export workflow.

See [`PRIVACY.md`](PRIVACY.md), [`SECURITY.md`](SECURITY.md), and [`docs/architecture.md`](docs/architecture.md).

## Encrypted backups

Encrypted backup export is optional. GradeCraft derives an encryption key from the passphrase in the client, encrypts the backup with authenticated encryption, and saves only the encrypted backup file. The passphrase is not stored by GradeCraft and must be kept separately by the user.

Losing the passphrase makes the encrypted backup unrecoverable. This is intentional: GradeCraft has no server-side recovery key.

The same standard/encrypted backup formats are used on web, desktop, and mobile so users can move their own data between platforms.

## Tech stack

### Shared application

- TypeScript
- React 19
- Vite
- Web Crypto
- Local Storage
- Service Worker APIs for the PWA target

### Native shell

- Tauri 2
- Rust
- Tauri Dialog plugin
- Tauri File System plugin
- WebView2 on Windows
- WKWebView on macOS/iOS
- WebKitGTK on Linux
- Android System WebView on Android

### Quality and automation

- Vitest
- Testing Library
- Playwright
- ESLint
- GitHub Actions
- CodeQL

## Quick start: web/PWA

Requirements: Node.js 20.19+ and npm.

```bash
git clone https://github.com/sanskarIN/gradecraft.git
cd gradecraft
npm install
npm run dev
```

Production web build:

```bash
npm run build
```

The PWA bundle is emitted to `dist/`.

## Quick start: native desktop

Install Rust and the Tauri prerequisites for the current operating system, then run:

```bash
npm install
npm run native:dev
```

Compile-check the native layer:

```bash
npm run native:check
```

Create native desktop bundles for the current operating system:

```bash
npm run native:build
```

Desktop bundles are emitted under `src-tauri/target/release/bundle/`.

## Android

After installing Android Studio, SDK/Platform-Tools/Build-Tools, NDK, Java, and configuring the required environment variables:

```bash
npm install
npm run android:init
npm run android:dev
```

Build an Android APK:

```bash
npm run android:build -- --apk
```

Build an Android App Bundle for Play Store distribution:

```bash
npm run android:build -- --aab
```

Production store publishing requires signing credentials kept outside this repository.

## iOS / iPadOS

iOS development requires macOS with full Xcode.

```bash
npm install
npm run ios:init
npm run ios:dev
```

For a physical device on the local network:

```bash
npm run ios:dev -- --host
```

Create an iOS release build:

```bash
npm run ios:build
```

Final IPA/App Store distribution requires the appropriate Apple signing and provisioning setup outside Git.

## Application icons

`public/icons/icon.svg` is the canonical icon source for every target. Native commands automatically generate Tauri's platform-specific icon files before development/build operations.

You can regenerate them manually with:

```bash
npm run native:icons
```

## Development setup

Read:

- [`docs/setup.md`](docs/setup.md) — installation and first verification
- [`docs/development.md`](docs/development.md) — development commands and engineering rules
- [`docs/platforms.md`](docs/platforms.md) — complete cross-platform/native guide
- [`docs/testing.md`](docs/testing.md) — testing strategy
- [`docs/release.md`](docs/release.md) — shared and platform release gates

Core web/shared checks:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run docs:links
npm run security:secrets
npm run version:check
npm run release:gate
npm test
npm run build
npm run perf:budget
npm run test:e2e
```

Combined local shared quality gate:

```bash
npm run verify
```

Native core check:

```bash
npm run native:check
```

`verify` includes version synchronization, the static release-readiness gate, deterministic unit/component/property tests, the production build, and bundle-size budgets. Browser E2E, dependency audit, and native-platform checks remain explicit release checks so their evidence is visible separately.

## Version synchronization

`package.json` is the canonical application version source. The About screen and Tauri app config derive the application version from package metadata. Cargo also requires a version in `src-tauri/Cargo.toml`, and `npm run version:check` fails if the Cargo version, package version, changelog, handoff, or user-visible version wiring drift apart.

Before creating a release tag, run:

```bash
npm run release:tag -- vX.Y.Z
```

with the exact version from `package.json`.

## Architecture

- `src/domain/` — pure grade, GPA, what-if, validation, and data model rules
- `src/data/` — local persistence, backup, encrypted backup, CSV, and safe logging
- `src/i18n/` — typed English/Hindi catalogs and specialized portable-data messages
- `src/platform/` — runtime/platform/form-factor detection and cross-platform layout adaptations
- `src/state/` — explicit application-state wiring
- `src/components/` — reusable accessible UI primitives
- `src/pages/` — route-level product experiences
- `src/utils/` — shared utilities including browser/native export adaptation
- `src-tauri/` — native Rust shell, security capabilities, and bundle/mobile configuration
- `tests/` and `e2e/` — automated verification
- `scripts/` — repository quality, security, versioning, release-readiness, documentation, and performance checks

Read [`docs/architecture.md`](docs/architecture.md) and [`docs/adr/`](docs/adr/).

## Native CI

`.github/workflows/native.yml` compile-checks the Tauri core and builds the desktop application on Ubuntu, Windows, and macOS. It also generates and compiles an Android x86_64 debug APK and generates and compiles an unsigned Apple-Silicon iOS simulator application. Store signing is intentionally not performed in pull-request CI because signing credentials are release secrets.

## Contributing

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## License

MIT — see [`LICENSE`](LICENSE).

## Contact and support

- Business: `sanskarin@outlook.in`
- Business: `sanskarin.business@gmail.com`
- Support: `supportramsandesh@gmail.com`
- GitHub: https://github.com/sanskarIN
- Repository: https://github.com/sanskarIN/gradecraft
- Buy Me a Coffee: https://buymeacoffee.com/sanskarIN

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-sanskarIN-FFDD00?logo=buy-me-a-coffee&logoColor=000000)](https://buymeacoffee.com/sanskarIN)
