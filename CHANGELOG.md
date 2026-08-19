# Changelog

All notable changes to GradeCraft are documented here.

## [Unreleased]

### Added

- Weighted-category target-score planning with scenario-aware calculations.
- Browser regression coverage for creating a weighted course and planning a future score.
- Configurable deployment base path for root or repository-subpath hosting.
- Deterministic property-style coverage for points and weighted grade invariants.
- User-visible warning when browser storage cannot persist local changes.
- First-visit offline-shell browser coverage and install-time PWA asset precaching.
- Client-side Content Security Policy and no-referrer metadata with automated regression coverage.

### Changed

- Centralized application UI messages in the English catalog to prepare future localization packs, with a small externalized system-message catalog for persistence failures.
- Improved service-worker navigation updates while retaining offline fallback behavior and awaiting client claiming during activation.
- Service-worker cache cleanup and reads are now isolated to GradeCraft-owned caches so unrelated same-origin application caches are not removed or read.
- CI, E2E, and CodeQL workflows now cancel superseded runs on the same ref.
- Shared bounded input limits across domain validation, forms, CSV import, and restored data.
- Updated Vite to the patched 6.4.3 release line and the compatible React plugin 4.7.0.

### Fixed

- Restored data now rejects duplicate identifiers, invalid domain invariants, missing grading scales, unsafe course color values, oversized course identity fields, and ambiguous duplicate category names.
- Course editing no longer permits removing categories that still own assignments.
- Assignment undo is invalidated if its original category is removed before the undo action is used, preventing orphaned assignment references.
- Grading scales reject duplicate thresholds, oversized labels/names, and profiles without a 0% fallback band.
- CSV formula hardening now round-trips protected text without stripping legitimate leading apostrophes; CSV import also validates dates and bounded text lengths.
- CSV import now rejects duplicate column names instead of silently selecting an ambiguous duplicate header.
- Target-score planning now includes temporary what-if score overrides and recovers from stale course route IDs.
- Assignment validation now rejects impossible calendar dates and the assignment form passes due dates through the shared validator.
- Browser storage recovery repairs a corrupted primary copy without replacing a valid recovery copy, and inaccessible storage degrades safely.
- Explicit local-data deletion no longer immediately writes the default state back into GradeCraft storage during the same reset operation.
- CSV course selection now stays valid after restoring a backup with a different course set.
- Modal content resets after closing, controlled close callbacks are not duplicated, and dialogs have explicit accessible names.
- First-run onboarding now isolates background controls from keyboard/assistive-technology focus.

## [1.0.0] - 2026-08-19

### Added

- Production-oriented React/TypeScript PWA foundation.
- Weighted and points-based grade calculation.
- Course, category, assignment, scale, GPA, and what-if workflows.
- Trend and category contribution visualizations.
- Local persistence, backup/restore, CSV transfer, and privacy controls.
- Responsive theming, onboarding, accessibility preferences, and offline shell.
- Unit, integration, component, and Playwright browser tests.
- CI, CodeQL, Dependabot, release workflow, and project documentation.
