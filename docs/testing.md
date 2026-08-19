# Testing Strategy

GradeCraft uses layered automated checks.

## Unit/domain tests

`tests/gradeMath.test.ts`, `tests/gradeProperties.test.ts`, `tests/gpa.test.ts`, `tests/validation.test.ts`, and `tests/whatIf.test.ts` cover calculation, deterministic property-style invariants, target planning, bounded inputs, calendar-date validation, scale validation, and edge behavior.

## Data integration tests

CSV, backups, schema restoration, migrations, structured-log redaction, and Local Storage behavior are tested in jsdom. CSV regression cases cover spreadsheet-formula hardening, secure text round trips, bounded names, and valid calendar dates. Storage tests cover corrupt primary data, recovery-copy repair, invalid-primary backup protection, and blocked storage access.

## Component tests

`tests/App.test.tsx` verifies first-run onboarding isolation/focus, navigation landmarks, and persistence-failure warnings. `tests/CourseForm.test.tsx` protects assignment/category referential integrity. `tests/Modal.test.tsx` covers draft reset, controlled close behavior, and accessible dialog naming. `tests/WhatIfPage.test.tsx` covers stale course-route recovery. `tests/DataPage.test.tsx` covers CSV course selection after data replacement.

## End-to-end

`e2e/core.spec.ts` verifies first-run onboarding, a primary weighted-course journey (create a course, add a grade, open the what-if planner, and calculate the future score needed for a target), and a first-visit production PWA offline reload after service-worker installation.

## Coverage

Vitest enforces minimum coverage for domain/data modules. Coverage is a signal, not a substitute for meaningful assertions.

## Manual accessibility checklist

Before release: keyboard through onboarding, course creation, assignment entry, Settings, import/export, and dialogs; confirm onboarding makes background controls inert; inspect focus visibility and dialog names; zoom to 200%; enable reduced motion; check light/dark contrast; test a screen reader on core journeys.

## PWA release checks

Use a production build. Confirm the manifest and service worker load from the configured base path, verify install-time precaching includes the built application assets, refresh to receive a new navigation shell, then disable the network and verify the app opens. The automated browser suite also exercises an offline reload immediately after the first installed service worker claims the page.
