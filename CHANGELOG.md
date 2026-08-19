# Changelog

All notable changes to GradeCraft are documented here.

## [Unreleased]

### Added

- Weighted-category target-score planning with scenario-aware calculations.
- Browser regression coverage for creating a weighted course and planning a future score.
- Configurable deployment base path for root or repository-subpath hosting.

### Changed

- Centralized application UI messages in the English catalog to prepare future localization packs.
- Improved service-worker navigation updates while retaining offline fallback behavior.
- CI, E2E, and CodeQL workflows now cancel superseded runs on the same ref.

### Fixed

- Restored data now rejects duplicate identifiers and invalid domain invariants.
- Course editing no longer permits removing categories that still own assignments.
- Grading scales reject duplicate thresholds and require a 0% fallback band.
- CSV formula hardening now round-trips protected text without stripping legitimate leading apostrophes.
- Target-score planning now includes temporary what-if score overrides.

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
