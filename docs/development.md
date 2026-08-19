# Development

## Commands

- `npm run dev` — start the Vite development server.
- `npm run typecheck` — run strict TypeScript verification across application, unit/component tests, and Playwright journeys.
- `npm run lint` — run type-aware ESLint across the repository.
- `npm run format:check` — verify the repository whitespace/line-ending baseline.
- `npm run docs:links` — validate local Markdown links without making network requests.
- `npm run security:secrets` — scan tracked text for common private-key/API-token patterns.
- `npm run release:gate` — verify required release files, scripts, identity/support markers, and CI/release workflow wiring.
- `npm run release:tag -- vX.Y.Z` — verify a release tag exactly matches `package.json`.
- `npm test` — run Vitest with coverage thresholds, including deterministic property-style cases.
- `npm run build` — create the production PWA bundle.
- `npm run perf:budget` — enforce JavaScript, CSS, and total production bundle budgets after a build.
- `npm run test:e2e` — run Playwright Chromium journeys against the production preview build.
- `npm run verify` — run typecheck + lint + format + docs links + secret scan + release gate + tests + production build + bundle budgets.

## Recommended local loop

For normal feature work:

```bash
npm run typecheck
npm run lint
npm test
```

Before pushing:

```bash
npm run verify
npm run test:e2e
npm audit --audit-level=high
```

Before tagging a release, also validate the exact intended tag:

```bash
npm run release:tag -- vX.Y.Z
```

## Engineering rules

Keep calculation rules pure and covered by unit tests. Validate imported/untrusted values at boundaries. Keep persistence and backup formats versioned. Prefer small accessible components over duplicated page-local UI.

When fixing a defect, add a regression test before or with the fix. When adding a user-facing feature, update the appropriate English/Hindi message catalog rather than scattering new hardcoded copy through route logic.

For edge-heavy math, parser, and serialization behavior, prefer deterministic generated/property-style cases with fixed seeds so failures reproduce locally and in CI.

## Data compatibility rules

Schema-v1 optional additions must remain backward-compatible with older valid v1 records. A breaking persistence change requires an explicit migration path and test fixtures for both the old and new format.

Encrypted-backup format changes are independent from application-schema changes. Do not silently reinterpret an existing encrypted envelope version.

## Privacy rules

Do not add analytics, remote grade-data transmission, provider credentials, or account requirements without an explicit architecture/privacy decision and documentation update. Never log backup passphrases, raw imported academic data, or real student records.
