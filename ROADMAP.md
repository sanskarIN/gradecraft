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

## Accessibility and localization quality

- [x] Reusable dialogs explicitly named by their visible headings
- [x] Dialog close controls use the active English/Hindi locale
- [x] Controlled dialogs avoid duplicate close-handler callbacks
- [x] Score-trend chart accessible copy follows the active locale
- [x] Category-contribution chart labels, empty states, and summaries follow the active locale
- [x] Decorative contribution-bar geometry is hidden without hiding equivalent text summaries
- [x] Dialog and Hindi chart semantics have focused regression coverage

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
- [x] Superseded CI/E2E/native runs cancel automatically per ref
- [x] Manual CI/native dispatch available for release evidence collection

## Native application security

- [x] Restrictive packaged Tauri Content Security Policy
- [x] Packaged custom-protocol `Object.prototype` freezing
- [x] Window-scoped export-only native capability boundary
- [x] Release gate rejects missing/wildcard native CSP and disabled prototype hardening
- [x] Release gate protects Tauri asset CSP rewriting
- [x] Native webview threat boundary documented in ADR 0009 and `SECURITY.md`

## 2.0.12 — Version integrity and release preparation

- [x] Package metadata prepared as 2.0.12
- [x] Dated 2.0.12 changelog release entry
- [x] About screen derives application version from `package.json`
- [x] Hardcoded semantic versions removed from English/Hindi catalogs
- [x] Package/changelog/handoff/About synchronization gate
- [x] Version synchronization included in `npm run verify` and CI
- [x] Release-readiness gate protects the version gate itself
- [x] 2.0.12 release operator and evidence documentation

## Remaining publication evidence

- [ ] Capture real screenshots from a positively verified production build.
- [ ] Publish and verify a hosted demo URL if a public demo is desired.
- [ ] Record positive clean-checkout/GitHub Actions evidence for the exact 2.0.12 release commit before tagging `v2.0.12`.
- [ ] Smoke-test packaged native startup and export dialogs under the enforced CSP on each platform intended for publication.
- [ ] Repeat screen-reader/dialog/chart smoke testing in both English and Hindi on at least one real browser before publication.

These items require an actual runner/browser/deployment or target platform and are intentionally not replaced with generated screenshots, mock deployment links, or an assumption that missing status contexts mean success.

Privacy-first offline use remains the product baseline. Cloud storage is optional transport chosen by the user; GradeCraft does not require an account or receive backup passphrases.
