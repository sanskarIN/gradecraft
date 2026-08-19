# Development

## Commands

- `npm run dev` — start the Vite development server.
- `npm run typecheck` — run strict TypeScript verification across application, unit/component tests, and Playwright journeys.
- `npm run lint` — run type-aware ESLint across the repository.
- `npm run format:check` — verify the repository whitespace/line-ending baseline.
- `npm run docs:links` — validate local Markdown links without making network requests.
- `npm run security:secrets` — scan tracked text for common private-key/API-token patterns.
- `npm test` — run Vitest with coverage thresholds.
- `npm run build` — create the production PWA bundle.
- `npm run test:e2e` — run Playwright Chromium journeys against the production preview build.
- `npm run verify` — run typecheck + lint + format + docs links + secret scan + tests + production build.

## Recommended local loop

For normal feature work:

```bash
npm run typecheck
npm run lint
npm test
```

Before pushing or tagging:

```bash
npm run verify
npm run test:e2e
npm audit --audit-level=high
```

## Engineering rules

Keep calculation rules pure and covered by unit tests. Validate imported/untrusted values at boundaries. Keep persistence and backup formats versioned. Prefer small accessible components over duplicated page-local UI.

When fixing a defect, add a regression test before or with the fix. When adding a user-facing feature, update the appropriate English/Hindi message catalog rather than scattering new hardcoded copy through route logic.

## Data compatibility rules

Schema-v1 optional additions must remain backward-compatible with older valid v1 records. A breaking persistence change requires an explicit migration path and test fixtures for both the old and new format.

Encrypted-backup format changes are independent from application-schema changes. Do not silently reinterpret an existing encrypted envelope version.

## Privacy rules

Do not add analytics, remote grade-data transmission, provider credentials, or account requirements without an explicit architecture/privacy decision and documentation update. Never log backup passphrases, raw imported academic data, or real student records.
