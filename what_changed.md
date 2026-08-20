# GradeCraft Work Handoff

## Current milestone

**Package version:** 2.0.12

**Release state:** Cross-platform source support is implemented for PWA, Windows, macOS, Linux, Android, and iOS/iPadOS. The packaged native webview is security-hardened and release-gated, dialog/chart accessibility is localized for English and Hindi, and the current verification branch is being driven through every strict CI gate. Platform artifacts still require real build/device evidence before they are called release-ready.

**Date:** 2026-08-20

## Active verification branch

- Branch: `quality/security-hardening-2.0.12`
- Pull request: `#20` — `security: harden native webview and release verification`
- Base branch: `main`
- The pull request remains unmerged until the exact final head has positive CI, E2E, Native, and CodeQL evidence.
- Missing, queued, cancelled, or superseded checks are never treated as a pass.

## Completed product scope

GradeCraft is a privacy-first React + TypeScript grade-management application delivered through one shared product implementation as a Progressive Web App and Tauri 2 native application. The shared application includes:

- weighted-category and points-based grading;
- custom courses, categories, assignments, grading scales, and credit hours;
- GPA calculation;
- what-if score planning and weighted target-score solving;
- semester/term organization, filtering, and search;
- trend and category-contribution visualizations;
- English and Hindi localization;
- local persistence with recovery-copy safeguards;
- JSON backup and restore;
- authenticated encrypted backup files;
- CSV import/export with third-party column mapping;
- spreadsheet-formula neutralization and GradeCraft round trips;
- PWA installation/offline behavior;
- accessibility and reduced-motion preferences;
- responsive layouts for browser, desktop, tablet, and mobile targets.

Native source support covers Windows, macOS, Linux, Android, and iOS/iPadOS.

## Current hardening continuation

### Native webview security

- Replaced permissive native `csp: null` configuration with an explicit restrictive Tauri Content Security Policy.
- Limited packaged content to application-local sources and Tauri IPC endpoints required by native APIs.
- Blocked wildcard sources, objects, frames, framing, off-origin forms, and mutable base URLs.
- Enabled Tauri `freezePrototype` for packaged custom-protocol pages.
- Kept Tauri asset CSP modification enabled and made disabling it a release-gate failure.
- Preserved the window-scoped capability boundary: the local `main` window receives only core defaults and the dialog/file-write permissions required for user-selected exports.
- Added ADR 0009 documenting the native webview threat boundary and invariants.
- Updated `SECURITY.md`, architecture, release-readiness, roadmap, and changelog documentation.

### Release-regression protection

`scripts/check-release-gate.mjs` now treats native security as release-critical. It requires the native CSP, validates required directives, rejects wildcard policy sources, requires `freezePrototype: true`, protects Tauri CSP rewriting, and requires ADR 0009 alongside the existing native source/capability/platform assets.

### Accessibility and localization

- Reusable modal dialogs are named from their visible heading with `aria-labelledby`.
- Modal close controls receive the active locale's accessible label instead of hardcoded English-only text.
- Controlled dialogs use one close callback path, preventing duplicate close callbacks after programmatic close.
- Dashboard, course, assignment, and scale dialogs pass localized close labels.
- Added focused modal tests for naming, close buttons, and native cancel behavior.
- Added `src/i18n/charts.ts` for typed English/Hindi visualization accessibility copy.
- Localized score-trend accessible names and insufficient-data messages.
- Localized contribution-chart accessible names, category fallback text, no-grade text, and contribution summaries.
- Contribution charts expose textual values as an accessibility group while decorative bar geometry is hidden from assistive technology.
- Added Hindi chart regression coverage.
- Expanded `docs/accessibility.md` with dialog and localized-chart release checks.

### Strict TypeScript and test correctness

GitHub Actions exposed strict compiler issues that had previously been hidden by earlier branch state. They were fixed rather than bypassed:

- React `ErrorBoundary` class members now use explicit `override` modifiers.
- The throw-only error-boundary test component is typed as `never`, making it a valid JSX component under strict React typings.
- Settings tests now scope dialog queries with Testing Library `within(...)` instead of invoking query helpers on a raw `HTMLElement`.

The subsequent CI head confirmed that `npm run typecheck` passes.

### Lint correctness

The next CI stage exposed five lint defects. They were fixed without weakening ESLint:

- `scripts/check-format.mjs` no longer uses an empty `catch`; it suppresses only `ENOENT` and rethrows unexpected filesystem failures.
- `scripts/check-secrets.mjs` uses the same explicit missing-path policy.
- DataPage test mocks return `Promise.resolve(...)` rather than declaring unnecessary `async` functions with no `await` expression.

The subsequent CI head confirmed that `npm run lint` passes.

### Formatting gate

The next strict gate identified trailing Markdown whitespace in this handoff file. This revision removes the trailing spaces and keeps the handoff compatible with the repository-wide format baseline.

### Dependency and development-server security

- Vite was upgraded from `6.0.7` to `6.4.3`.
- This keeps GradeCraft on the existing Vite 6 line while incorporating reviewed fixes for Vite development-server file-read/path-deny bypass vulnerabilities.
- The patch is especially relevant because physical-device Tauri development can expose Vite beyond localhost through `TAURI_DEV_HOST`.
- Dependency auditing remains a hard CI/release gate. The dependency audit must be evaluated from the exact final dependency resolution; install-summary vulnerability counts are not treated as sufficient diagnosis.

### GitHub Actions runtime maintenance

- CI coverage artifact uploads now use `actions/upload-artifact@v6`.
- E2E Playwright report uploads now use `actions/upload-artifact@v6`.
- Release Playwright report uploads now use `actions/upload-artifact@v6`.
- This removes the deprecated Node 20 artifact-action runtime warning on current GitHub-hosted runners.
- CI, E2E, and Native workflows cancel superseded runs per ref.
- Main CI and Native CI support manual dispatch for explicit release-evidence collection.

## Cross-platform implementation retained

### Tauri shell

The repository contains:

- `src-tauri/build.rs`;
- `src-tauri/Cargo.toml` synchronized to package version 2.0.12;
- `src-tauri/src/main.rs` desktop entry point;
- `src-tauri/src/lib.rs` shared desktop/mobile runtime;
- `src-tauri/tauri.conf.json` consuming the shared Vite `dist/` frontend;
- native identifier `in.sanskar.gradecraft`;
- desktop bundling metadata;
- Android minimum SDK configuration;
- iOS minimum system version configuration;
- Tauri dialog and filesystem plugins;
- local-window capability configuration;
- generated-native-artifact ignore rules.

### Browser/native behavior

- Browser/PWA exports continue to use the browser download path.
- Packaged Tauri exports use operating-system save dialogs and filesystem writes.
- JSON backup, encrypted backup, and CSV formats remain identical across targets.
- Android/iOS URI-style native destinations are handled by the filesystem adapter.
- Service-worker registration runs only for production HTTP/HTTPS origins and is skipped in packaged native protocols.
- Vite development respects `TAURI_DEV_HOST` and uses device-safe HMR configuration.
- Grade calculation, persistence schemas, localization, accessibility settings, and portability formats remain platform-independent.

### Native commands

```text
npm run native:icons
npm run native:check
npm run native:dev
npm run native:build
npm run android:init
npm run android:dev
npm run android:build -- --apk
npm run android:build -- --aab
npm run ios:init
npm run ios:dev
npm run ios:build
```

Native commands generate platform icons from the canonical `public/icons/icon.svg` source.

## Repository quality gates

The repository currently includes these executable gates:

- `npm run typecheck`;
- `npm run lint`;
- `npm run format:check`;
- `npm run docs:links`;
- `npm run security:secrets`;
- `npm run version:check`;
- `npm run release:gate`;
- `npm test` with coverage thresholds;
- `npm run build`;
- `npm run perf:budget`;
- `npm run test:e2e`;
- `npm audit --audit-level=high`;
- `npm run native:check`;
- cross-platform Native CI;
- CodeQL;
- release tag/package-version validation.

`npm run verify` composes the shared static/test/build/budget gates. Browser E2E remains separate because it starts the production preview server and exercises user journeys.

## Version integrity

`package.json` is the release-version source of truth. The repository verifies that:

- package version is valid semantic versioning;
- `src-tauri/Cargo.toml` matches it;
- Tauri sources the native application version from `../package.json`;
- the changelog contains the dated release heading;
- this handoff declares the same package version;
- About remains wired to package metadata;
- localization catalogs do not reintroduce hardcoded GradeCraft semantic-version strings.

Application schema version remains `1`; GradeCraft 2.0.12 does not require a persistence migration.

## Verification status

The current PR is being verified sequentially through GitHub Actions. During this continuation, earlier exact heads exposed real TypeScript, lint, and formatting issues. Those failures were fixed in source instead of rerunning unchanged jobs or weakening quality rules.

The latest known verified progression before this handoff revision is:

1. TypeScript gate: passed after compiler fixes.
2. ESLint gate: passed after lint fixes.
3. Format gate: identified trailing whitespace in `what_changed.md`; corrected by this commit.
4. Later gates such as documentation links, secret scan, version synchronization, release gate, tests, build, bundle budget, dependency audit, E2E, Native CI, and CodeQL must be checked again for the exact head after this commit.

No later gate is claimed green until GitHub reports it green for that exact head.

## Exact 2.0.12 candidate commands

Run from a clean network-enabled checkout:

```bash
npm install
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
npm run native:icons
npm run native:check
npm run release:tag -- v2.0.12
```

Then build the applicable target:

```bash
# Windows/macOS/Linux
npm run native:build

# Android
npm run android:init
npm run android:build -- --apk
npm run android:build -- --aab

# iOS/iPadOS on macOS
npm run ios:init
npm run ios:build
```

## Publication evidence still required

Repository source support is not equivalent to a verified distributable. Before publication, retain positive evidence for:

1. exact-final-head CI, E2E, Native CI, CodeQL, dependency audit, release gate, version gate, and bundle budget;
2. Windows native build and smoke test, including startup and exports under the enforced CSP;
3. macOS native build and smoke test;
4. intended Linux packages and smoke test;
5. Android APK/AAB build plus emulator/device smoke test;
6. iOS/iPadOS signed/appropriate build plus simulator/device smoke test;
7. web/native backup, encrypted-backup, and CSV interoperability;
8. screen-reader/dialog/chart checks in English and Hindi;
9. real screenshots captured only from positively verified builds;
10. optional hosted demo verification before documenting its URL;
11. signing/notarization/provisioning credentials kept outside Git.

A trustworthy npm lockfile should only be committed when generated from a successful registry-backed resolution. No lockfile is fabricated from an offline environment.

## Current continuation commits

### Native security and release hardening

- `e201df1` — security(native): enforce restrictive webview CSP
- `5427f9b` — security(native): freeze Object prototype in packaged app
- `cd84a97` — test(release): enforce native webview security baseline
- `bcb39c9` — ci: cancel superseded quality runs
- `f95dc19` — ci(e2e): cancel superseded browser runs
- `4648cb4` — ci(native): cancel superseded platform runs
- `b63f915` — docs(adr): record native webview hardening decision
- `e2e7550` — test(release): require native security ADR
- `fa9ab75` — docs(security): document native webview protections
- `1ad6642` — docs(release): add native security verification evidence
- `3209fac` — docs(roadmap): mark native security hardening complete
- `732d020` — docs(architecture): integrate native webview security boundary

### Accessibility and localization

- `83c9b4c` — fix(accessibility): give dialogs localized accessible names
- `1f0e789` — fix(i18n): localize dashboard dialog close control
- `551dcc3` — fix(i18n): localize course dialog close controls
- `2bb62e2` — fix(i18n): localize settings dialog close control
- `5ecdf26` — test(accessibility): cover dialog naming and close behavior
- `10cec8a` — docs(accessibility): define localized dialog requirements
- `038650e` — feat(i18n): add localized chart accessibility copy
- `6854ef2` — fix(i18n): localize score trend chart semantics
- `526b2bc` — fix(i18n): localize contribution chart semantics
- `17cf115` — fix(i18n): pass locale into course charts
- `db4c718` — test(i18n): cover Hindi chart accessibility copy
- `e031e35` — fix(accessibility): preserve contribution chart text semantics
- `97af08a` — test(accessibility): preserve contribution chart text semantics

### Compiler, dependency, and CI maintenance

- `ee0cb23` — fix(types): mark error boundary overrides explicitly
- `690aadf` — fix(types): type throw-only error boundary fixture
- `5d8298e` — fix(tests): scope settings dialog queries correctly
- `9621029` — security(deps): patch Vite dev-server vulnerabilities
- `f935213` — ci: upgrade coverage artifact action runtime
- `50deecc` — ci(e2e): upgrade Playwright artifact runtime
- `62abec6` — ci(release): upgrade release artifact runtime
- `6daf82d` — fix(lint): handle missing format roots explicitly
- `513a6ea` — fix(lint): handle missing secret-scan roots explicitly
- `b776288` — fix(lint): remove unnecessary async test mocks

## Open issues

- No known blocker or critical grade-calculation defect has been identified in this continuation.
- The strict pipeline is still the authoritative source for undiscovered compile/lint/test/build/audit regressions.
- Native signed-package and real-device evidence remains external to repository source review.
- Real screenshots, optional demo hosting, and store-distribution artifacts remain publication evidence tasks.
