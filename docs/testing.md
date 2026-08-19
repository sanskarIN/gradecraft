# Testing Strategy

GradeCraft uses layered automated checks.

## Unit/domain tests

`tests/gradeMath.test.ts`, `tests/gpa.test.ts`, `tests/validation.test.ts`, and `tests/whatIf.test.ts` cover calculation, target planning, scale validation, and edge behavior.

## Data integration tests

CSV, backups, schema restoration, migrations, and Local Storage behavior are tested in jsdom. CSV regression cases cover spreadsheet-formula hardening and secure text round trips.

## Component tests

`tests/App.test.tsx` verifies first-run onboarding and navigation landmarks with Testing Library. `tests/CourseForm.test.tsx` protects assignment/category referential integrity in the course editor.

## End-to-end

`e2e/core.spec.ts` verifies both first-run onboarding and a primary weighted-course journey: create a course, add a grade, open the what-if planner, and calculate the future score needed for a target.

## Coverage

Vitest enforces minimum coverage for domain/data modules. Coverage is a signal, not a substitute for meaningful assertions.

## Manual accessibility checklist

Before release: keyboard through onboarding, course creation, assignment entry, Settings, import/export, and dialogs; inspect focus visibility; zoom to 200%; enable reduced motion; check light/dark contrast; test a screen reader on core journeys.

## PWA release checks

Use a production build. Confirm the manifest and service worker load from the configured base path, refresh to receive a new navigation shell, then disable the network and verify the previously loaded app still opens.
