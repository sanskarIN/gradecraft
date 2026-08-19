# Testing Strategy

GradeCraft uses layered automated checks.

## Unit/domain tests

`tests/gradeMath.test.ts`, `tests/gradeProperties.test.ts`, `tests/gpa.test.ts`, `tests/validation.test.ts`, and `tests/whatIf.test.ts` cover calculation, deterministic property-style invariants, target planning, conservative required-score display rounding, bounded inputs, canonical persistence timestamps, calendar-date validation, Unicode-normalized category/profile identities, scale validation, and edge behavior.

## Data integration tests

CSV, backups, schema restoration, explicit storage migrations, structured-log redaction, and Local Storage behavior are tested in jsdom. CSV regression cases cover spreadsheet-formula hardening, secure text round trips, deterministic punctuation/Unicode fuzz cases, bounded names, valid calendar dates, duplicate-header rejection, bounded assignment-row counts, optional category-weight intent, and existing-category weight conflicts. Storage tests cover corrupt primary data, recovery-copy repair, invalid-primary backup protection, blocked storage access, and explicit-delete semantics.

`tests/securityMetadata.test.ts` verifies the static browser CSP/referrer baseline, including the absence of inline-script permission. `tests/serviceWorkerSource.test.ts` guards same-origin/scope restrictions plus ownership isolation for cache cleanup and cache reads. `tests/manifest.test.ts` guards portable PWA start/scope metadata plus separate any/maskable icon sources. `tests/UserFacingError.test.ts` verifies unexpected exceptions use approved user-safe fallbacks. `tests/releaseWorkflow.test.ts` protects tagged-release version matching, SHA-256 checksum generation, and native GitHub CLI publishing without the removed third-party release publisher.

## Component tests

`tests/App.test.tsx` verifies first-run onboarding isolation/focus, navigation landmarks/current-page semantics, and persistence-failure warnings. `tests/AppContext.test.tsx` verifies explicit local-data deletion stays cleared during the reset operation plus grading-profile deletion invariants. `tests/CourseForm.test.tsx` protects assignment/category referential integrity and trimmed category persistence. `tests/CoursePage.test.tsx` protects assignment undo from recreating a reference to a category removed after deletion. `tests/Modal.test.tsx` covers draft reset, controlled close behavior, accessible dialog naming, and focus restoration. `tests/SettingsPage.test.tsx` covers Settings shortcuts plus grading-profile name/deletion integrity. `tests/WhatIfPage.test.tsx` covers stale course-route recovery. `tests/DataPage.test.tsx` covers CSV course selection after data replacement, asynchronous busy state, and category-weight conflict handling.

## End-to-end

`e2e/core.spec.ts` verifies first-run onboarding, a primary weighted-course journey (create a course, add a grade, open the what-if planner, and calculate the future score needed for a target), and a first-visit production PWA offline reload after service-worker installation. CI retains Playwright HTML/test-result artifacts for failed E2E runs for seven days.

## Repository checks

`npm run docs:links` validates repository-relative Markdown/image targets without requiring internet access. `npm run release:version-check` verifies that the package version, About version string, and changelog release section agree. Both checks are part of `npm run verify`, and CI executes them explicitly.

## Performance

`npm run bench` runs deterministic Vitest benchmarks against 10,000-assignment point-based and weighted course fixtures. Compare benchmark output on the same runtime/machine when investigating regressions; normal correctness tests intentionally avoid brittle wall-clock thresholds.

## Coverage

Vitest enforces minimum coverage for domain, data, and centralized error modules. Coverage is a signal, not a substitute for meaningful assertions.

## Manual accessibility checklist

Before release: keyboard through onboarding, course creation, assignment entry, Settings, import/export, and dialogs; confirm onboarding makes background controls inert; confirm dialogs restore focus to their opener; inspect current-page navigation semantics, focus visibility, dialog names, and transfer busy states; zoom to 200%; enable reduced motion; check light/dark contrast; test a screen reader on core journeys.

## PWA release checks

Use a production build. Confirm the manifest and service worker load from the configured base path, verify install-time precaching includes the built application assets and both icon purposes, refresh to receive a new navigation shell, then disable the network and verify the app opens. Confirm service-worker cache cleanup only touches keys beginning with the GradeCraft cache prefix. The automated browser suite also exercises an offline reload immediately after the first installed service worker claims the page.
