# Release Readiness

This document separates repository-complete engineering work from evidence that must come from an actual clean build, browser run, or published deployment. GradeCraft must not treat missing evidence as a passing result.

## Repository-level gates

| Gate | Repository implementation |
| --- | --- |
| Type safety | `npm run typecheck` |
| Lint | `npm run lint` |
| Repository formatting | `npm run format:check` |
| Documentation links | `npm run docs:links` |
| Secret-pattern scan | `npm run security:secrets` |
| Release structure | `npm run release:gate` |
| Unit/component/property tests | `npm test` |
| Production build | `npm run build` |
| Bundle budgets | `npm run perf:budget` |
| Browser journeys | `npm run test:e2e` |
| Dependency audit | `npm audit --audit-level=high` |
| Static security analysis | GitHub CodeQL workflow |

The main CI workflow runs all non-browser quality gates plus the dependency audit and uploads the coverage report. The E2E workflow installs Chromium, runs Playwright, and preserves the HTML report as an artifact.

## Release candidate command

From a clean checkout:

```bash
npm install
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
```

A release candidate is blocked by any failure.

## Manual evidence still required before publication

- Verify the complete smoke-test list in [`release.md`](release.md) against a production build.
- Review keyboard navigation, focus order, zoom, contrast, reduced motion, and a screen reader on primary journeys.
- Verify PWA installation, update behavior, subpath hosting, and offline shell behavior in a real browser.
- Review current CodeQL, Dependabot, CI, and E2E results in GitHub Actions.
- Capture real application screenshots only after the verified build is running.
- Verify any hosted demo URL before adding it to the README.

## Evidence integrity

A connector/API response that contains no check contexts is not proof that checks passed. A successful release requires positive evidence from the clean-checkout commands and/or the corresponding GitHub Actions runs.

The repository intentionally keeps screenshot placeholders instead of generated mock screenshots because publication evidence must represent the real application.
