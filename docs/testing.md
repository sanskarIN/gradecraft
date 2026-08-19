# Testing Strategy

GradeCraft uses layered automated checks.

## Unit/domain tests

`tests/gradeMath.test.ts`, `tests/gpa.test.ts`, `tests/validation.test.ts`, and `tests/whatIf.test.ts` cover calculation and edge behavior.

## Data integration tests

CSV, backups, and Local Storage behavior are tested in jsdom.

## Component tests

`tests/App.test.tsx` verifies first-run onboarding and navigation landmarks with Testing Library.

## End-to-end

`e2e/core.spec.ts` verifies a fresh user can complete onboarding and reach the course dashboard in Chromium.

## Coverage

Vitest enforces minimum coverage for domain/data modules. Coverage is a signal, not a substitute for meaningful assertions.

## Manual accessibility checklist

Before release: keyboard through onboarding, course creation, assignment entry, Settings, import/export, and dialogs; inspect focus visibility; zoom to 200%; enable reduced motion; check light/dark contrast; test a screen reader on core journeys.
