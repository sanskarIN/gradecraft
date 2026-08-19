# Performance

GradeCraft is intentionally client-only and dependency-light. Core grade calculations do not wait on network requests, and optional encrypted backup work runs only when the user explicitly requests an export or restore.

## Automated release budgets

`npm run perf:budget` inspects the production `dist/` directory after `npm run build` and fails when:

- any JavaScript asset exceeds 500 KiB uncompressed;
- any CSS asset exceeds 150 KiB uncompressed; or
- the complete production directory exceeds 750 KiB uncompressed.

These are regression guardrails rather than a claim that every supported device will load or execute within a fixed time. The command is part of `npm run verify` and the main CI workflow.

Run it locally with:

```bash
npm run build
npm run perf:budget
```

## Investigation budgets

- Investigate any single release increase above 20% in compressed application JS/CSS even when the hard budget still passes.
- Initial routes must not depend on remote APIs after static assets load.
- Grade recalculation and what-if updates should remain effectively instant for ordinary course sizes.
- Dashboard semester/search filtering should remain responsive for normal student datasets.
- Encryption/decryption may take noticeably longer than ordinary UI calculations because PBKDF2 is intentionally computationally expensive; it must never run on routine renders.

## Current practices

- Pure calculation functions avoid network/storage reads.
- Charts use native SVG instead of a charting dependency.
- Service worker caches static application assets.
- No polling or background analytics.
- Dashboard search/grouping uses memoized in-memory filtering.
- What-if calculations operate on temporary course copies and do not persist on each score edit.
- CSV files are read only after explicit selection and mapping remains in memory until confirmation.
- Web Crypto is invoked only for explicit encrypted-backup operations.
- Translation catalogs are local modules with no runtime language-file fetch.
- Deterministic property tests exercise hundreds of grade-calculation inputs without runtime network access.

## Dataset scaling

Current weighted aggregation repeatedly filters assignments by category in a few domain/UI paths. This is straightforward and suitable for normal student datasets. If real usage grows into thousands of assignments per course or hundreds of courses, profile first and then consider a single-pass category index rather than pre-optimizing the code now.

CSV parsing is in-memory and intentionally guarded by UI file-size limits. Encrypted backups have a slightly larger UI allowance than plain imports because JSON/base64 encryption envelopes add overhead.

## Release measurement

For a production candidate:

1. Run `npm run verify` and record the bundle-budget result.
2. Compare compressed `dist/` asset sizes with the previous release.
3. Exercise dashboard, course detail, what-if, GPA, CSV mapping, and encrypted backup flows on a mid-range mobile device/browser.
4. Check that service-worker caching does not retain obsolete assets after an update.
5. Profile before changing algorithms or adding dependencies.

Performance optimizations must not weaken input validation, encryption parameters, accessibility, or data-integrity checks.
