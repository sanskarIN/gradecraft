# Roadmap

## 1.0 — Core product

- [x] Weighted and points-based courses
- [x] Custom assignments/categories/scales
- [x] What-if planning
- [x] GPA calculation
- [x] Charts
- [x] CSV + JSON portability
- [x] Local privacy controls
- [x] PWA/offline shell
- [x] Accessibility baseline

## 1.1 — Product refinement

- [x] Editable existing assignments
- [x] Undo action for destructive assignment removal
- [x] English and Hindi localization packs with a persisted language setting
- [x] Optional semester metadata, dashboard grouping, filtering, and search
- [x] Weighted-category target-score solver

## Advanced privacy and portability

- [x] Provider-agnostic encrypted backup files for storage with a user-chosen provider
- [x] Import mapping UI for arbitrary third-party CSV headers
- [x] Recovery-copy safeguards for corrupt Local Storage
- [x] Guarded restore, scale deletion, and category-reference workflows

## Quality and release engineering

- [x] Unit, component, integration, regression, and browser journey coverage
- [x] Deterministic property-style grade and CSV edge coverage
- [x] Type, lint, format, secret, and documentation-link gates
- [x] Static release-readiness gate
- [x] Production bundle-size budgets
- [x] CodeQL and dependency-audit workflows
- [x] CI coverage and Playwright diagnostic artifacts
- [x] Release tag/package-version validation
- [x] Tag releases gated by verification, dependency audit, and Chromium E2E
- [x] Release-readiness evidence matrix and final release procedure

## Remaining publication evidence

- [ ] Capture real screenshots from a positively verified production build.
- [ ] Publish and verify a hosted demo URL if a public demo is desired.
- [ ] Record positive clean-checkout/GitHub Actions evidence for the exact release commit before tagging a release.

These items require an actual runner/browser/deployment and are intentionally not replaced with generated screenshots, mock deployment links, or an assumption that missing status contexts mean success.

Privacy-first offline use remains the product baseline. Cloud storage is optional transport chosen by the user; GradeCraft does not require an account or receive backup passphrases.
