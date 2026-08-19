# Changelog

All notable changes to GradeCraft are documented here.

## [Unreleased]

### Added

- Weighted-category target-score solving in the what-if planner.
- Optional semester/term metadata with dashboard grouping, filtering, and search.
- Persisted English/Hindi interface selection with typed translation catalogs.
- Provider-agnostic encrypted backup files using authenticated browser cryptography.
- Arbitrary CSV column mapping with common-header suggestions and a review-before-import workflow.
- Guarded grading-scale profile deletion with in-use and last-profile protection.
- Application-level recovery boundary for unexpected render failures.
- Local Markdown documentation-link verification.
- Deterministic release-readiness validation for required files, package scripts, README identity/support markers, CI gates, and tag-release wiring.
- Executable production bundle budgets for JavaScript, CSS, and total `dist/` size.
- Release-tag/package-version consistency validation.
- Deterministic property-style coverage for generated grade cases, target-score solver consistency, and CSV Unicode/formula-sensitive label round trips.
- CI artifacts for coverage and Playwright diagnostics.
- Dedicated release-readiness evidence documentation.
- Expanded Playwright journeys for course grading, GPA, localization persistence, and mapped CSV import.
- Regression coverage for localization, encrypted backups, semester compatibility, weighted planning, PWA deployment rules, storage recovery, grading-scale safeguards, category references, and restore cancellation.

### Changed

- Expanded interface string externalization across onboarding, dashboard, course editing, assignments, GPA, data portability, settings, what-if planning, and About/support views.
- CSV imports now stage detected headers before mutating course data.
- Backup restore now validates/decrypts first and requires explicit confirmation before replacing current local data.
- Successful encrypted backup operations clear passphrase fields from live component state.
- PWA assets, manifest scope, and service-worker registration now support subpath/static hosting.
- PWA navigation uses network-first refresh with cached-shell fallback instead of indefinitely cache-first HTML.
- Playwright journeys are included in the strict application TypeScript project.
- Playwright can run against an already-built release artifact so the exact verified `dist/` output is exercised before packaging.
- `npm run verify` now includes documentation-link validation, release-readiness validation, the production build, and bundle-size budgets.
- Main CI now enforces documentation links, release readiness, bundle budgets, and uploads coverage evidence.
- Tag releases now require an exact version/tag match, high-severity dependency audit, Chromium installation, and Playwright E2E before packaging.
- The release workflow no longer performs a redundant standalone build after `npm run verify`.

### Fixed

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

- Added a restrictive browser Content Security Policy and no-referrer policy.
- User-facing backup/CSV failures no longer expose raw parser exception text.
- Storage recovery logging records safe error classification instead of raw exception text.
- Encrypted backups use AES-GCM authentication with PBKDF2-SHA-256 key derivation, randomized salt, and randomized IV.
- Backup passphrases are not persisted and are cleared from successful export/restore form state.
- Destructive restore/delete paths use explicit confirmation or guarded state transitions.
- Release publication is blocked on a high-severity dependency audit and the existing repository security gates.

### Existing baseline

- Production-oriented React/TypeScript PWA foundation.
- Weighted and points-based grade calculation.
- Course, category, assignment, scale, GPA, and what-if workflows.
- Trend and category contribution visualizations.
- Local persistence, backup/restore, CSV transfer, and privacy controls.
- Responsive theming, onboarding, accessibility preferences, and offline shell.
- Unit, integration, component, property-style, and Playwright browser tests.
- CI, CodeQL, Dependabot, release workflow, and project documentation.

## [1.0.0] - 2026-08-19

- Initial GradeCraft release-candidate baseline.
