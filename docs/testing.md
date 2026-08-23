# Testing Strategy

GradeCraft uses layered automated checks. The goal is to verify calculation correctness, data-boundary behavior, browser workflows, release metadata integrity, and repository quality separately so one passing layer does not hide failures in another.

## Unit/domain tests

- `tests/gradeMath.test.ts` — weighted/points grade math and edge cases.
- `tests/gpa.test.ts` — credit-weighted GPA behavior.
- `tests/validation.test.ts` — course/category/assignment/scale validation.
- `tests/whatIf.test.ts` — temporary score overrides plus points and weighted target-score solving.
- `tests/schema.test.ts` — persisted schema compatibility, semester metadata, and optional locale settings.
- `tests/i18n.test.ts` — English/Hindi catalog parity, fallback behavior, and dynamic localized messages.
- `tests/property.test.ts` — seeded deterministic property-style checks for grade bounds, target-solver consistency, and CSV label round trips across punctuation, spreadsheet formula prefixes, control-character prefixes, apostrophes, and Unicode.

The property suite uses a fixed pseudo-random seed so it explores many generated inputs while remaining reproducible on every runner.

## Data integration and security tests

- `tests/csv.test.ts` — CSV parsing, formula/control-prefix neutralization, protected-label round trips, validation, arbitrary header mapping, and alias suggestions.
- Backup tests cover JSON envelope/schema behavior.
- `tests/encryptedBackup.test.ts` — encrypted-backup round trips, wrong-passphrase rejection, tamper detection, and minimum passphrase enforcement.
- `tests/DataPage.test.tsx` — destructive-restore cancellation, encrypted-export cancellation, encrypted-restore passphrase retention, and user-visible export-write failure handling.
- `tests/storage.test.ts` — primary/recovery behavior, corrupt-record repair/cleanup, denied primary reads, interrupted recovery reads, and failed local-data clearing.
- `tests/download.test.ts` — export filename normalization for illegal filesystem characters, Windows reserved device names, empty names, and excessive length.

## Component and routing tests

- `tests/App.test.tsx` verifies first-run onboarding, navigation landmarks/current-route state, and visible warning behavior when local persistence writes fail.
- `tests/Modal.test.tsx` verifies dialog/heading association, explicit close-button naming, and native cancel handling.
- `tests/WhatIfPage.test.tsx` verifies stale/deleted course deep links recover to an available course instead of leaving the planner blank.
- `tests/ErrorBoundary.test.tsx` verifies unexpected render failures produce a safe recovery state without raw error text.
- `tests/SettingsPage.test.tsx` verifies live language switching and document-language synchronization.

The About screen's version is sourced directly from `package.json`. Repository-level `version:check` protects that wiring and prevents semantic-version literals from drifting into locale catalogs.

## End-to-end browser tests

Playwright runs against a production Vite build in Chromium.

- `e2e/core.spec.ts` — first-run onboarding reaches the dashboard.
- `e2e/course-workflow.spec.ts` — create a weighted course, add an assignment, verify weighted target planning, and inspect GPA.
- `e2e/localization.spec.ts` — switch to Hindi and verify the choice persists across reload.
- `e2e/data-portability.spec.ts` — upload third-party CSV headers, review suggested mappings, confirm import, and verify the assignment in the course.
- `e2e/publication-screenshots.spec.ts` — exercise real onboarding/course/planning/GPA/settings/data views and capture deterministic full-page screenshot candidates from that production UI.

The normal E2E workflow records repository/ref/event plus exact commit/run metadata in `EVIDENCE.txt`, hashes all captured PNGs into `SHA256SUMS.txt`, and uploads `publication-screenshots-<commit-sha>` only after the Chromium E2E job succeeds. The tag-release workflow does the same against the already-verified `dist/` build and names the artifact with both tag and commit SHA. See [`screenshots/README.md`](screenshots/README.md) for the review/promotion rule.

Screenshot candidates are evidence artifacts, not an automatic claim that publication screenshots are approved. A release operator must confirm the exact successful run, verify the checksum manifest, inspect the images, and only then promote reviewed captures into `docs/screenshots/`.

The 2.0.12 manual release smoke test additionally verifies About displays `2.0.12` in both supported UI languages; see [`release.md`](release.md).

## Repository quality gates

Run the combined local verification command:

```bash
npm run verify
```

It includes TypeScript checking, ESLint, repository format checks, local Markdown-link checks, secret scanning, version synchronization, the static release-readiness gate, unit/component/property tests with coverage, the production build, and bundle-size budgets.

Version synchronization can be checked independently:

```bash
npm run version:check
```

It verifies package semantic versioning, the matching dated changelog heading, the handoff version, package-derived About wiring, and the absence of hardcoded GradeCraft semantic versions in English/Hindi catalogs.

The release-readiness gate can also be run independently:

```bash
npm run release:gate
```

It verifies required project/docs/community files, required package scripts, README identity/support markers, semantic version shape, CI quality steps, exact-ref/manual workflow controls, checkout credential isolation, release-workflow least-privilege publication wiring, screenshot provenance/checksum capture, and PWA archive checksum publication. It also requires the version-sync infrastructure itself so that gate cannot silently disappear.

Run browser tests separately:

```bash
npm run test:e2e
```

The local documentation-link checker and production bundle budget can also be run directly:

```bash
npm run docs:links
npm run build
npm run perf:budget
```

For the prepared release candidate, validate package/tag consistency with:

```bash
npm run release:tag -- v2.0.12
```

## Coverage

Vitest enforces minimum coverage for domain/data modules. Coverage is a signal, not a substitute for meaningful assertions or browser-level verification. Deterministic property checks add breadth around edge-heavy math and serialization behavior without replacing focused regression tests.

## Manual accessibility checklist

Before release: keyboard through onboarding, course creation, assignment entry, weighted what-if planning, Settings/language switching, CSV mapping, encrypted backup controls, import/export, and dialogs; inspect focus visibility; confirm dialogs announce their visible headings and localized close controls; confirm primary navigation announces the current page; zoom to 200%; enable reduced motion; check light/dark contrast; test a screen reader on core journeys.

## Current verification caveat

Repository changes should not be described as fully verified until the commands above have run successfully from a clean checkout and the associated GitHub Actions checks are visible. Direct-push combined status queries may not expose GitHub Actions check runs through every API surface, so absence of returned status contexts is not evidence of success.
