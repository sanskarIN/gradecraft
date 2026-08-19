# Development

## Commands

- `npm run dev` — Vite development server
- `npm run typecheck` — strict TypeScript verification
- `npm run lint` — ESLint
- `npm run format:check` — repository whitespace/line-ending baseline
- `npm test` — Vitest with coverage thresholds
- `npm run build` — production build
- `npm run test:e2e` — Playwright Chromium journey
- `npm run verify` — typecheck + lint + format + tests + build

## Engineering rules

Keep calculation rules pure and covered by unit tests. Validate imported/untrusted values at boundaries. Keep persistence formats versioned. Prefer small accessible components over duplicated page-local UI.

When fixing a defect, add a regression test before or with the fix.
