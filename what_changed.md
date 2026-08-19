# GradeCraft Work Handoff

## Current milestone

**Version:** 1.0.0 release-candidate baseline
**Phase:** Phase 6 final-audit work in progress
**Date:** 2026-08-19

## Completed work

- Inspected the existing repository before implementation; it contained only the initial MIT license.
- Implemented the TypeScript + React PWA architecture.
- Added weighted and points-based grade calculation.
- Added custom courses, categories, weights, assignment creation/editing/deletion with undo, credit hours, and grade-scale profiles.
- Added validation for impossible scores, invalid scale values, duplicate labels/IDs, and weighted totals.
- Added temporary what-if score overrides and points-mode target-score planning.
- Added credit-weighted GPA using course-specific scale profiles.
- Added native score-trend and category-contribution charts.
- Added privacy-first Local Storage persistence with a one-record recovery copy.
- Added explicit delete-all local-data control.
- Added JSON backup/restore and CSV assignment import/export.
- Added CSV formula-injection neutralization on export plus numeric/range validation on import.
- Added onboarding, responsive shell, light/dark/system theme, reduced motion, compact mode, offline banner, accessible forms, focus styles, semantic tables, and native dialogs.
- Added PWA manifest, app-icon source, and service-worker cache shell.
- Added About/Support/Funding surfaces with project contacts, GitHub, Buy Me a Coffee, MIT license, and **Made by the Sanskar**.
- Added domain/data tests, component tests, and a Playwright end-to-end onboarding journey.
- Added CI, E2E, CodeQL, Dependabot, release workflow, issue templates, pull-request template, and funding configuration.
- Added project, security, privacy, architecture, setup, development, testing, release, troubleshooting, accessibility, performance, and ADR documentation.

## Verification

Local environment:
- `node --version` → `v22.16.0`
- `npm --version` → `10.9.2`
- `git --version` → `2.47.3`
- npm registry access timed out in the execution sandbox, so dependencies could not be installed locally before push.
- `node scripts/check-format.mjs` is used for deterministic repository whitespace/line-ending validation.

GitHub Actions is the network-enabled verification path after implementation commits are pushed. CI failures must be fixed in follow-up commits and recorded here.

## Known limitations / open issues

- The GitHub connector's commit/file write API does not expose author/committer-email fields. The requested `sanskarin@outlook.in` is preserved in repository documentation, but connector-created commit metadata may use the connected GitHub identity.
- Advanced target-score planning for weighted categories is not yet implemented; weighted what-if supports direct score scenarios.
- English is shipped first; the i18n catalog exists but not every UI string has moved into it.
- Real release screenshots must be captured after verified build/deployment.
- Branch protection and GitHub Discussions are repository settings; workflows/templates are prepared but settings must be enabled separately.

## Next exact tasks

1. Inspect GitHub CI/CodeQL/E2E after the workflow push.
2. Fix every type, lint, format, test, build, audit, or security failure.
3. Run/inspect E2E.
4. Add weighted target-score solver.
5. Continue i18n string extraction.
6. Capture real screenshots after successful build.
7. Perform clean-checkout release-candidate verification.

## Migration notes

Schema version is `1`; no migrations are required for the initial release. Future schema changes must add explicit migration functions.

## Release notes draft

GradeCraft 1.0 introduces privacy-first offline grade tracking, weighted and points-based calculations, custom grading scales, GPA and what-if planning, charts, CSV/JSON portability, responsive themes, accessibility controls, PWA offline support, and automated quality/security workflows.

## Recent meaningful commits

- `37a3dcd` — build: configure TypeScript React PWA toolchain
- `425a827` — feat: define grade domain models and defaults
- `8b263aa` — feat: implement grade calculations and validation
- `e4cdfcb` — feat: add GPA and what-if planning engines
- `0b10a54` — feat: add validated local persistence and migrations
- `eca7b84` — feat: add secure CSV and backup portability
- `19251ed` — feat: add offline PWA platform foundation
- `bc65d7d` — feat: wire persistent app state and navigation shell
- `5f9680f` — feat: add onboarding and editable grade forms
- `b284232` — feat: add accessible grade visualizations
- `66e0bda` — feat: build course dashboard and assignment workflows
- `65166f6` — feat: add what-if planning and GPA views
- `953ece5` — feat: add privacy data settings and about surfaces
- `9f0fe81` — feat: integrate polished responsive application experience
- `a9cf3eb` — test: cover grade domain data and app boundaries
- `74ce1c7` — test: add browser onboarding journey
- `68e3747` — docs: add project community and product documentation
- `4c8150e` — docs: record architecture testing and operations guidance
- `68e8300` — chore: add GitHub community templates and funding
- `5c81a0a` — ci: add quality security e2e and release workflows
