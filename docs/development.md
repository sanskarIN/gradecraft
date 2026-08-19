# Development

## Commands

- `npm run dev` — Vite development server
- `npm run typecheck` — strict TypeScript verification across source, tests, and benchmarks
- `npm run lint` — ESLint with zero warnings allowed
- `npm run format:check` — deterministic repository whitespace/line-ending baseline
- `npm run docs:links` — offline repository-relative Markdown/image target validation
- `npm run release:version-check` — package/About/changelog version consistency
- `npm run security:secrets` — repository secret-pattern scan, including dotenv files
- `npm test` — Vitest with coverage thresholds
- `npm run build` — production build
- `npm run test:e2e` — Playwright Chromium journeys
- `npm run bench` — deterministic large-course grade-calculation benchmark harness
- `npm run verify` — typecheck + lint + format + docs links + version consistency + secret scan + tests + build

## Engineering rules

Keep calculation rules pure and covered by unit tests. Validate imported/untrusted values at boundaries. Keep persistence formats versioned and timestamp/reference invariants explicit. Convert unexpected exceptions to approved user-safe messages before rendering them. Prefer small accessible components over duplicated page-local UI.

Use Unicode-normalized comparison only for identity/conflict checks; preserve trimmed display text for users. Never silently reinterpret omitted CSV fields as explicit intent. Destructive state actions must preserve referential integrity.

When fixing a defect, add a regression test before or with the fix. When adding a benchmark, avoid brittle wall-clock assertions in the correctness suite.
