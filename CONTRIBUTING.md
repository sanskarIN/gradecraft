# Contributing to GradeCraft

Thanks for helping improve GradeCraft.

## Before opening a change

1. Search existing issues and pull requests.
2. For large behavior changes, open a feature discussion or issue first.
3. Keep changes scoped and avoid unrelated formatting churn.
4. Never weaken validation, privacy, accessibility, or offline guarantees just to make a test pass.

## Local workflow

```bash
npm install
npm run dev
npm run verify
npm run test:e2e
```

Run `npm run bench` when a change may affect grade-calculation throughput, and compare it with a baseline captured on the same runtime/machine. `npm run verify` includes documentation-link, release-version, secret-pattern, coverage, and production-build checks.

Add regression tests for bug fixes and tests for new domain rules. Keep user-facing strings understandable, accessible, externalized where appropriate, and safe for display. Treat CSV, backup, and Local Storage data as untrusted.

## Commit style

Conventional Commits are preferred: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `perf:`, `build:`, `ci:`, and `chore:`.

Project maintainer commit email: `sanskarin@outlook.in`.

## Pull requests

Describe behavior changes, testing actually performed, accessibility impact, real screenshots for verified UI changes, and privacy/security implications. Never include secrets or real student records. Do not describe queued, pending, cancelled, skipped, or unavailable checks as passing.
