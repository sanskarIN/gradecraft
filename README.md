# GradeCraft

<p align="center">
  <img src="public/icons/icon.svg" width="112" alt="GradeCraft logo" />
</p>

<p align="center"><strong>Know where you stand. Plan where you want to go.</strong></p>

<p align="center">
  <a href="https://github.com/sanskarIN/gradecraft/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/sanskarIN/gradecraft/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-blue.svg" /></a>
  <a href="https://buymeacoffee.com/sanskarIN"><img alt="Buy Me a Coffee" src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-sanskarIN-FFDD00?logo=buy-me-a-coffee&logoColor=000000" /></a>
</p>

**GradeCraft** is a privacy-first, offline-capable student grade calculator built as a TypeScript + React progressive web app. It supports weighted and points-based grading, what-if planning, custom GPA scales, semester organization, charts, encrypted backups, flexible CSV transfer, English/Hindi UI, and accessible keyboard-friendly workflows.

> **Made by the Sanskar**

## Screenshots

Real release screenshots should be captured from the verified built application and placed in `docs/screenshots/`. The repository does not use misleading mock screenshots as proof of functionality.

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
- Privacy-first local browser storage with a recovery copy and delete controls
- English and Hindi interface catalogs with a persisted language setting
- Offline PWA shell with service-worker caching
- Light, dark, and system themes
- Reduced-motion and compact accessibility preferences
- Responsive phone/tablet/desktop layouts
- Keyboard navigation, visible focus states, semantic tables/forms, and screen-reader labels
- Application-level error recovery UI
- No account, backend, analytics, or required cloud service

## Encrypted backups

Encrypted backup export is optional. GradeCraft derives an encryption key from the passphrase in the browser, encrypts the backup with authenticated encryption, and downloads only the encrypted backup file. The passphrase is not stored by GradeCraft and must be kept separately by the user. The encrypted file can then be stored with any provider the user chooses.

Losing the passphrase makes the encrypted backup unrecoverable. This is intentional: GradeCraft has no server-side recovery key.

## Supported platforms

GradeCraft targets modern evergreen browsers on desktop and mobile. It can be installed as a PWA where the browser and operating system support web-app installation.

## Tech stack

TypeScript, React 19, Vite, Vitest, Testing Library, Playwright, ESLint, GitHub Actions, CodeQL, Web Crypto, browser Local Storage, and Service Worker APIs.

## Quick start

Requirements: Node.js 20.19+ and npm.

```bash
git clone https://github.com/sanskarIN/gradecraft.git
cd gradecraft
npm install
npm run dev
```

## Development setup

See [`docs/setup.md`](docs/setup.md) and [`docs/development.md`](docs/development.md).

```bash
npm run typecheck
npm run lint
npm run format:check
npm run docs:links
npm run security:secrets
npm test
npm run build
npm run test:e2e
```

For the combined local quality gate:

```bash
npm run verify
```

## Build and release

```bash
npm install
npm run verify
npm run build
```

The production PWA bundle is emitted to `dist/`. See [`docs/release.md`](docs/release.md).

## Architecture

- `src/domain/` — pure grade, GPA, what-if, validation, and data model rules
- `src/data/` — local persistence, backup, encrypted backup, CSV, and safe logging
- `src/i18n/` — typed English/Hindi catalogs and specialized portable-data messages
- `src/state/` — explicit application-state wiring
- `src/components/` — reusable accessible UI primitives
- `src/pages/` — route-level product experiences
- `tests/` and `e2e/` — automated verification
- `scripts/` — repository quality, format, secret, and documentation checks

Read [`docs/architecture.md`](docs/architecture.md) and [`docs/adr/`](docs/adr/).

## Security and privacy

Grade data is stored locally in the browser. GradeCraft does not require sign-in or transmit grades, backup contents, or backup passphrases to a GradeCraft server. Imports are parsed locally. The browser entry point uses a restrictive Content Security Policy and no-referrer policy. See [`PRIVACY.md`](PRIVACY.md) and [`SECURITY.md`](SECURITY.md).

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
