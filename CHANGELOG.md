# Changelog

All notable changes to GradeCraft are documented here.

## [Unreleased]

### Added

- Weighted-category target-score planning with scenario-aware calculations.
- Browser regression coverage for creating a weighted course and planning a future score.
- Configurable deployment base path for root or repository-subpath hosting.
- Deterministic property-style coverage for points and weighted grade invariants plus deterministic CSV fuzz-style round trips.
- User-visible warning when browser storage cannot persist local changes.
- First-visit offline-shell browser coverage and install-time PWA asset precaching.
- Client-side Content Security Policy and no-referrer metadata with automated regression coverage.
- Safe grading-scale profile deletion with last-profile and in-use protections.
- Dedicated maskable PWA icon metadata and manifest regression coverage.
- Grade-calculation benchmark harness for deterministic 10,000-assignment point and weighted fixtures.
- Repository-relative Markdown link checking and release-version consistency checking in verification/CI.
- Explicit storage-migration tests, user-facing error abstraction tests, manifest tests, and additional component regression coverage.
- Playwright failure-report artifact retention in the E2E workflow.

### Changed

- Centralized application UI messages in the English catalog to prepare future localization packs, with externalized persistence, settings-management, and data-transfer messages.
- Improved service-worker navigation updates while retaining offline fallback behavior and awaiting client claiming during activation.
- Service-worker cache cleanup and reads are now isolated to GradeCraft-owned caches so unrelated same-origin application caches are not removed or read.
- CI, E2E, and CodeQL workflows cancel superseded runs on the same ref.
- Shared bounded input limits across domain validation, forms, CSV import, and restored data.
- Settings now includes direct privacy/data-transfer and About entry points in addition to appearance/accessibility/update controls.
- Primary navigation exposes and visually identifies the current page with `aria-current`.
- Data-transfer operations expose busy state and prevent overlapping restore/import work.
- Category and grading-profile identity comparisons use Unicode compatibility normalization while saved display labels are trimmed.
- Structured logging redacts sensitive domain keys plus email and bearer-token patterns found inside otherwise generic string values.
- The static Content Security Policy no longer permits inline scripts.
- Updated Vite to the patched 6.4.3 release line and the compatible React plugin 4.7.0.

### Fixed

- Restored data rejects duplicate identifiers, invalid domain invariants, missing grading scales, unsafe course color values, oversized course identity fields, ambiguous duplicate category names, duplicate grading-profile names, and malformed persistence timestamps.
- Course editing no longer permits removing categories that still own assignments.
- Assignment undo is invalidated if its original category is removed before the undo action is used, preventing orphaned assignment references.
- Grading scales reject duplicate thresholds, oversized labels/names, profiles without a 0% fallback band, and duplicate profile names after Unicode normalization.
- CSV formula hardening round-trips protected text without stripping legitimate leading apostrophes; CSV import also validates dates and bounded text lengths.
- CSV import rejects duplicate column names, assignment counts above the bounded import limit, and explicit category weights that conflict with an existing course category.
- Omitted CSV category weights remain omitted instead of being silently converted to `0%` intent.
- Target-score planning includes temporary what-if score overrides, recovers from stale course route IDs, and rounds displayed “at least” score guidance upward so the minimum is never understated.
- Assignment validation rejects impossible calendar dates and the assignment form passes due dates through the shared validator.
- Browser storage recovery repairs a corrupted primary copy without replacing a valid recovery copy, and inaccessible storage degrades safely.
- Explicit local-data deletion no longer immediately writes the default state back into GradeCraft storage during the same reset operation.
- CSV course selection stays valid after restoring a backup with a different course set.
- Modal content resets after closing, controlled close callbacks are not duplicated, dialogs have explicit accessible names, and focus returns to the control that opened a dialog.
- First-run onboarding isolates background controls from keyboard/assistive-technology focus.

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
