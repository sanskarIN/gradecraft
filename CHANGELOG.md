# Changelog

All notable changes to GradeCraft are documented here.

## [Unreleased]

### Added

- Weighted-category target-score solving in the what-if planner.
- Optional semester/term metadata with dashboard grouping, filtering, and search.
- Persisted English/Hindi interface selection with typed translation catalogs.
- Provider-agnostic encrypted backup files using authenticated browser cryptography.
- Arbitrary CSV column mapping with common-header suggestions and a review-before-import workflow.
- Application-level recovery boundary for unexpected render failures.
- Local Markdown documentation-link verification.
- Regression coverage for localization, encrypted backups, semester schema compatibility, weighted planning, and CSV mappings.

### Changed

- Expanded interface string externalization across onboarding, dashboard, course editing, assignments, GPA, data portability, settings, what-if planning, and About/support views.
- CSV imports now stage detected headers before mutating course data.
- `npm run verify` now includes documentation-link validation.

### Security

- Added a restrictive browser Content Security Policy and no-referrer policy.
- User-facing backup/CSV failures no longer expose raw parser exception text.
- Storage recovery logging now records safe error classification instead of raw exception text.
- Encrypted backups use AES-GCM authentication with PBKDF2-SHA-256 key derivation, randomized salt, and randomized IV.

### Existing baseline

- Production-oriented React/TypeScript PWA foundation.
- Weighted and points-based grade calculation.
- Course, category, assignment, scale, GPA, and what-if workflows.
- Trend and category contribution visualizations.
- Local persistence, backup/restore, CSV transfer, and privacy controls.
- Responsive theming, onboarding, accessibility preferences, and offline shell.
- Unit, integration, component, and Playwright browser tests.
- CI, CodeQL, Dependabot, release workflow, and project documentation.

## [1.0.0] - 2026-08-19

- Initial GradeCraft release-candidate baseline.
