# Testing Strategy

GradeCraft uses layered automated checks. The goal is to verify calculation correctness, data-boundary behavior, browser workflows, and repository quality separately so one passing layer does not hide failures in another.

## Unit/domain tests

- `tests/gradeMath.test.ts` — weighted/points grade math and edge cases.
- `tests/gpa.test.ts` — credit-weighted GPA behavior.
- `tests/validation.test.ts` — course/category/assignment/scale validation.
- `tests/whatIf.test.ts` — temporary score overrides plus points and weighted target-score solving.
- `tests/schema.test.ts` — persisted schema compatibility, semester metadata, and optional locale settings.
- `tests/i18n.test.ts` — English/Hindi catalog parity, fallback behavior, and dynamic localized messages.
- `tests/property.test.ts` — seeded deterministic property-style checks for grade bounds, target-solver consistency, and CSV label round trips across punctuation, spreadsheet-sensitive prefixes, apostrophes, and Unicode.

The property suite uses a fixed pseudo-random seed so it explores many generated inputs while remaining reproducible on every runner.

## Data integration and security tests

- `tests/csv.test.ts` — CSV parsing, formula-prefix neutralization, validation, arbitrary header mapping, and alias suggestions.
- Backup tests cover JSON envelope/schema behavior.
- `tests/encryptedBackup.test.ts` — encrypted-backup round trips, wrong-passphrase rejection, tamper detection, and minimum passphrase enforcement.
- Local Storage tests cover primary/recovery behavior.

## Component tests

- `tests/App.test.tsx` verifies first-run onboarding and navigation landmarks with Testing Library.
- `tests/ErrorBoundary.test.tsx` verifies unexpected render failures produce a safe recovery state without raw error text.
- `tests/SettingsPage.test.tsx` verifies live language switching and document-language synchronization.

## End-to-end browser tests

Playwright runs against a production Vite build in Chromium.

- `e2e/core.spec.ts` — first-run onboarding reaches the dashboard.
- `e2e/course-workflow.spec.ts` — create a weighted course, add an assignment, verify weighted target planning, and inspect GPA.
- `e2e/localization.spec.ts` — switch to Hindi and verify the choice persists across reload.
- `e2e/data-portability.spec.ts` — upload third-party CSV headers, review suggested mappings, confirm import, and verify the assignment in the course.

## Repository quality gates

Run the combined local verification command:

```bash
npm run verify
```

It includes TypeScript checking, ESLint, repository format checks, local Markdown-link checks, secret scanning, the static release-readiness gate, unit/component/property tests with coverage, the production build, and bundle-size budgets.

The release-readiness gate can also be run independently without installing browser tooling:

```bash
npm run release:gate
```

It verifies required project/docs/community files, required package scripts, README identity/support markers, semantic version shape, CI quality steps, and release-workflow verification wiring.

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

## Coverage

Vitest enforces minimum coverage for domain/data modules. Coverage is a signal, not a substitute for meaningful assertions or browser-level verification. Deterministic property checks add breadth around edge-heavy math and serialization behavior without replacing focused regression tests.

## Manual accessibility checklist

Before release: keyboard through onboarding, course creation, assignment entry, weighted what-if planning, Settings/language switching, CSV mapping, encrypted backup controls, import/export, and dialogs; inspect focus visibility; zoom to 200%; enable reduced motion; check light/dark contrast; test a screen reader on core journeys.

## Current verification caveat

Repository changes should not be described as fully verified until the commands above have run successfully from a clean checkout and the associated GitHub Actions checks are visible. Direct-push combined status queries may not expose GitHub Actions check runs through every API surface, so absence of returned status contexts is not evidence of success.
