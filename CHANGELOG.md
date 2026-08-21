# Changelog

All notable changes to GradeCraft are documented here.

## [Unreleased]

No unreleased changes are currently queued after the 2.0.12 release-candidate preparation.

## [2.0.12] - 2026-08-19

### Added

- Cross-platform Tauri 2 shell targeting Windows, macOS, Linux, Android, and iOS/iPadOS while preserving the existing PWA target.
- Shared Rust desktop/mobile runtime under `src-tauri/` with native bundle metadata and mobile project generation.
- Native system save dialogs and filesystem-backed export support for JSON backups, encrypted backups, and CSV on packaged applications.
- Native security capability restricted to the local `main` window and the dialog/file-write functionality required by exports.
- Native build/development commands for desktop, Android, and iOS, including APK/AAB and iOS release entry points.
- Automatic native icon generation from the canonical `public/icons/icon.svg` source.
- Native CI across Ubuntu, Windows, and macOS plus Android/iOS scaffold validation.
- Complete cross-platform setup, development, build, signing-boundary, release, and troubleshooting documentation in `docs/platforms.md`.
- ADR 0008 documenting the single-codebase Tauri shell decision.
- Weighted-category target-score solving in the what-if planner.
- Optional semester/term metadata with dashboard grouping, filtering, and search.
- Persisted English/Hindi interface selection with typed translation catalogs.
- Provider-agnostic encrypted backup files using authenticated browser/WebView cryptography.
- Arbitrary CSV column mapping with common-header suggestions and a review-before-import workflow.
- Guarded grading-scale profile deletion with in-use and last-profile protection.
- Application-level recovery boundary for unexpected render failures.
- Local Markdown documentation-link verification.
- Deterministic release-readiness validation for required files, package scripts, README identity/support markers, CI gates, and tag-release wiring.
- Executable production bundle budgets for JavaScript, CSS, and total `dist/` size.
- Release-tag/package-version consistency validation.
- Package/changelog/handoff/About/native version synchronization validation.
- Deterministic property-style coverage for generated grade cases, target-score solver consistency, and CSV Unicode/formula/control-prefix label round trips.
- CI artifacts for coverage and Playwright diagnostics.
- Dedicated release-readiness evidence documentation.
- Expanded Playwright journeys for course grading, GPA, localization persistence, and mapped CSV import.
- Deterministic Playwright publication-screenshot coverage for onboarding, dashboard, course detail, what-if planning, GPA, light/dark settings, and import/export views.
- Successful E2E and tag-release screenshot artifacts containing exact commit/run evidence metadata, with tag metadata on release captures.
- Regression coverage for localization, encrypted backups, semester compatibility, weighted planning, PWA deployment rules, storage recovery, grading-scale safeguards, category references, restore cancellation, export write failures, and control-prefixed CSV cells.

### Changed

- GradeCraft is now documented and structured as one shared React/TypeScript application delivered through both PWA and native Tauri shells.
- Vite development hosting now respects `TAURI_DEV_HOST` and advertises a device-safe HMR websocket for physical mobile development.
- Production service-worker registration now runs only on HTTP/HTTPS so packaged native WebViews do not try to register the PWA worker.
- Browser downloads remain unchanged while native exports route through operating-system save dialogs and platform-aware filesystem writes.
- The release gate now treats native source files, capabilities, platform documentation, native scripts, Native CI, and browser screenshot-evidence wiring as required release assets.
- Version synchronization now verifies `src-tauri/Cargo.toml` and requires Tauri to source its application version from `package.json`.
- Setup, architecture, development, release-readiness, and release documentation now include explicit native-platform evidence and signing boundaries.
- The About screen derives the displayed application version directly from `package.json` instead of duplicating a version literal in localization catalogs.
- Expanded interface string externalization across onboarding, dashboard, course editing, assignments, GPA, data portability, settings, what-if planning, and About/support views.
- CSV imports now stage detected headers before mutating course data.
- Backup restore now validates/decrypts first and requires explicit confirmation before replacing current local data.
- Successful encrypted backup operations clear passphrase fields from live component state.
- PWA assets, manifest scope, and service-worker registration support subpath/static hosting.
- PWA navigation uses network-first refresh with cached-shell fallback instead of indefinitely cache-first HTML.
- Playwright journeys are included in the strict application TypeScript project.
- Playwright can run against an already-built release artifact so the exact verified `dist/` output is exercised before packaging.
- `npm run verify` includes documentation-link validation, version synchronization, release-readiness validation, the production build, and bundle-size budgets.
- Main CI enforces documentation links, version synchronization, release readiness, bundle budgets, and uploads coverage evidence.
- E2E publication screenshots are retained only after successful browser verification and remain review-required candidates rather than automatically approved documentation assets.
- Tag releases require an exact version/tag match, high-severity dependency audit, Chromium installation, Playwright E2E, and exact-tag screenshot evidence before packaging.
- The release workflow no longer performs a redundant standalone build after `npm run verify`.

### Fixed

- Packaged native applications no longer execute the browser-only service-worker registration path.
- Native file exports no longer depend on browser anchor-download behavior that is inconsistent across system WebViews.
- Mobile Vite development no longer assumes `localhost` is reachable from the physical device.
- Cancelling a native encrypted-backup save no longer reports success or clears the passphrase fields.
- Cancelling an encrypted restore after successful decryption no longer clears the passphrase when current local data was intentionally left unchanged.
- Plain JSON/CSV export write failures now surface a localized user-visible safety message instead of being logged silently.
- Removed stale hardcoded `GradeCraft 1.0.0` strings from English and Hindi catalogs so future releases cannot display an obsolete version.
- Repaired Local Storage recovery so a corrupt primary record cannot overwrite a valid recovery snapshot during the first autosave.
- Corrupt unrecoverable Local Storage records are cleared before a clean default state is initialized.
- Course editing can no longer remove a category that still owns saved assignments.
- Category names and grading-scale thresholds/IDs are checked for ambiguity before save.
- Grading scales must include a 0% floor so every valid percentage has a defined band.
- CSV formula-neutralization now round-trips assignment and category names without changing legitimate leading characters.
- Encrypted-backup tamper testing now mutates ciphertext deterministically.
- CI no longer omits the repository documentation-link gate.
- Release tags that do not match `package.json` are rejected before an artifact can be published.

### Security

- Tauri native capabilities are explicit and local-window scoped instead of exposing unrestricted native APIs globally.
- Native store signing credentials are documented as trusted-release-environment secrets and excluded from repository requirements.
- CSV export neutralization also protects cells beginning with tab, carriage-return, or line-feed control prefixes in addition to `=`, `+`, `-`, and `@`, while preserving protected labels on GradeCraft round trip.
- Added a restrictive browser Content Security Policy and no-referrer policy.
- User-facing backup/CSV failures no longer expose raw parser exception text.
- Storage recovery logging records safe error classification instead of raw exception text.
- Encrypted backups use AES-GCM authentication with PBKDF2-SHA-256 key derivation, randomized salt, and randomized IV.
- Backup passphrases are not persisted and are cleared from successful export/restore form state.
- Destructive restore/delete paths use explicit confirmation or guarded state transitions.
- Release publication is blocked on a high-severity dependency audit and the existing repository security gates.

### Existing baseline included in 2.0.12

- Production-oriented React/TypeScript application with PWA and Tauri native delivery layers.
- Weighted and points-based grade calculation.
- Course, category, assignment, scale, GPA, and what-if workflows.
- Trend and category contribution visualizations.
- Local persistence, backup/restore, CSV transfer, and privacy controls.
- Responsive theming, onboarding, accessibility preferences, and offline PWA shell.
- Windows, macOS, Linux, Android, and iOS/iPadOS native source support.
- Unit, integration, component, property-style, and Playwright browser tests.
- CI, Native CI, CodeQL, Dependabot, release workflow, and project documentation.

## [1.0.0] - 2026-08-19

- Initial GradeCraft release-candidate baseline.
