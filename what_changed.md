# GradeCraft Work Handoff

## Current milestone

**Package version:** 2.0.12
**Branch:** `feature/full-cross-platform-support`
**Base commit:** `28616a38a079f1917115983f00cdcefe5aa97df5`
**Pull request:** #21 — `feat: complete cross-platform runtime and native verification`
**Milestone:** Full cross-platform runtime, responsive/mobile adaptation, native permission separation, and real native compile verification
**Date:** 2026-08-24

**Release state:** Cross-platform source support is implemented for PWA, Windows, macOS, Linux, Android, and iOS/iPadOS. The native WebView is security-hardened and release-gated; dialogs, charts, and validation feedback support English/Hindi accessibility; browser/native export filenames are sanitized for cross-platform portability; and the release candidate remains intentionally unmerged until the exact final head receives positive automated and platform evidence.

**Date:** 2026-08-20

## Active verification branch

- Branch: `quality/security-hardening-2.0.12`
- Pull request: `#20` — `quality: harden security, accessibility, exports, and release gates`
- Base branch: `main`
- The branch is not behind `main` at the current handoff checkpoint.
- The pull request remains unmerged until the exact final head has positive CI quality, independent dependency-audit, E2E, Native, and CodeQL evidence.
- Missing, queued, cancelled, or superseded checks are never treated as a pass.
- A successful source review is not substituted for signed/package/device evidence.

## Completed product scope

GradeCraft is a privacy-first React + TypeScript grade-management application delivered through one shared product implementation as both a Progressive Web App and Tauri 2 native application. The shared application includes:

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

### Native WebView security

- Replaced permissive native `csp: null` configuration with an explicit restrictive Tauri Content Security Policy.
- Limited packaged content to application-local sources and Tauri IPC endpoints required by native APIs.
- Blocked wildcard sources, objects, frames, framing, off-origin forms, and mutable base URLs.
- Enabled Tauri `freezePrototype` for packaged custom-protocol pages.
- Kept Tauri asset CSP modification enabled and made disabling it a release-gate failure.
- Preserved the window-scoped capability boundary: the local `main` window receives only core defaults and the dialog/file-write permissions required for user-selected exports.
- Added ADR 0009 documenting the native WebView threat boundary and invariants.
- Updated `SECURITY.md`, architecture, release-readiness, roadmap, and changelog documentation.

### Release-regression protection

`scripts/check-release-gate.mjs` treats native security as release-critical. It requires the native CSP, validates required directives, rejects wildcard policy sources, requires `freezePrototype: true`, protects Tauri CSP rewriting, and requires ADR 0009 alongside the existing native source/capability/platform assets.

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

### Localized validation architecture

Domain validation remains deterministic and framework/locale independent while the UI can now translate validation feedback safely:

- `src/domain/validation.ts` exposes stable `ValidationIssueCode` identifiers in addition to the existing English fallback `message`.
- Dynamic validation data is carried separately through `values`, including the current weighted-category total.
- `src/i18n/validation.ts` maps issue codes to Hindi messages while English continues to use the domain fallback text.
- Assignment validation feedback follows the persisted locale.
- Course/category validation feedback follows the persisted locale.
- Grading-scale validation feedback follows the persisted locale.
- Dynamic weighted-category total messages are localized without parsing English strings.
- Regression tests verify English fallback behavior, Hindi assignment/scale messages, and dynamic total interpolation.

### Cross-platform export filename safety

Browser and native exports now share one filename-sanitization boundary in `src/utils/download.ts`:

- Unicode filenames are NFC-normalized.
- Control characters are removed/replaced.
- `/`, `\\`, `:`, `*`, `?`, quotes, angle brackets, and pipe characters are neutralized before reaching browser/native save APIs.
- Leading/trailing dot-space segments are stripped.
- Windows reserved device names such as `CON` and `LPT1` are prefixed safely.
- Useful extensions are preserved while total filename length is bounded.
- Invalid-only proposed names fall back to `gradecraft-export`.
- The same sanitized name is used by browser anchor downloads and Tauri native save dialogs.
- Regression tests cover traversal-like proposals, forbidden characters, reserved Windows names, long names, extension preservation, and fallback behavior.

### Strict TypeScript and test correctness

GitHub Actions exposed strict compiler issues that were fixed rather than bypassed:

- React `ErrorBoundary` class members now use explicit `override` modifiers.
- The throw-only error-boundary test component is typed as `never`, making it a valid JSX component under strict React typings.
- Settings tests scope dialog queries with Testing Library `within(...)` instead of invoking query helpers on a raw `HTMLElement`.

An intermediate CI head positively confirmed `npm run typecheck` after these fixes.

### Lint correctness

The next CI stage exposed lint defects that were fixed without weakening ESLint:

- `scripts/check-format.mjs` suppresses only `ENOENT` for missing scan roots and rethrows unexpected filesystem failures.
- `scripts/check-secrets.mjs` uses the same explicit missing-path policy.
- DataPage test mocks return `Promise.resolve(...)` instead of declaring unnecessary `async` functions with no `await` expression.

An intermediate CI head positively confirmed `npm run lint` after these fixes.

### Formatting gate

A later CI head identified trailing Markdown whitespace in the handoff. The file was rewritten with normalized line endings/whitespace and the format issue was removed rather than weakening the repository format checker.

### Dependency and development-server security

- Vite was upgraded from `6.0.7` to `6.4.3`.
- This keeps GradeCraft on the existing Vite 6 line while incorporating reviewed fixes for Vite development-server file-read/path-deny bypass vulnerabilities.
- The patch is especially relevant because physical-device Tauri development can expose Vite beyond localhost through `TAURI_DEV_HOST`.
- Dependency auditing remains a hard CI/release gate.
- The dependency audit now runs in its own CI job instead of sitting at the end of the quality job, so type/lint/format/test failures cannot hide high/critical audit evidence.
- Install-summary vulnerability counts are not treated as sufficient diagnosis; version changes require the actual audit chain or authoritative advisory evidence.
- No dependency version is blindly upgraded solely to silence an install summary.

### GitHub Actions runtime maintenance

- CI coverage artifact uploads use `actions/upload-artifact@v6`.
- E2E Playwright report uploads use `actions/upload-artifact@v6`.
- Release Playwright report uploads use `actions/upload-artifact@v6`.
- CI, E2E, and Native workflows cancel superseded runs per ref.
- Main CI and Native CI support manual dispatch for explicit release-evidence collection.
- CI now has separate `quality` and `dependency-audit` jobs.

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

- Browser/PWA exports use the browser download path.
- Packaged Tauri exports use operating-system save dialogs and filesystem writes.
- JSON backup, encrypted backup, and CSV formats remain identical across targets.
- Android/iOS URI-style native destinations are handled by the filesystem adapter.
- Service-worker registration runs only for production HTTP/HTTPS origins and is skipped in packaged native protocols.
- Vite development respects `TAURI_DEV_HOST` and uses device-safe HMR configuration.
- Grade calculation, persistence schemas, localization, accessibility settings, and portability formats remain platform-independent.

### Native commands
**Package version:** 2.0.12  
**Release state:** final repository hardening is on `main`; a dedicated PR is being used to obtain positive network-enabled CI/E2E/audit evidence before tagging  
**Date:** 2026-08-19
**Milestone:** Release-evidence, data-safety, accessibility, and publication hardening after cross-platform source completion  
**Release state:** PWA, Windows, macOS, Linux, Android, and iOS/iPadOS source support is implemented. Repository release gates, screenshot provenance/checksums, PWA archive checksums, persistence warnings, workflow rerun controls, and least-privilege publication are now hardened. The exact final commit still requires positive CI/E2E/Native/CodeQL evidence plus real platform build/smoke evidence before publication is called green.  
**Date:** 2026-08-23

## Current support state

GradeCraft now has one shared React/TypeScript product surface for:

- responsive browser use;
- installable PWA use;
- ChromeOS through the browser/PWA target;
- Windows native desktop through Tauri;
- macOS native desktop through Tauri;
- Linux native desktop through Tauri;
- Android native application builds through Tauri;
- iOS/iPadOS native application builds through Tauri.
The repository includes unit/domain/data/component/property tests, Playwright browser journeys, CI, E2E, CodeQL, Dependabot, release automation, documentation-link checks, secret checks, release-readiness checks, version synchronization, production bundle budgets, release-tag validation, coverage artifacts, and Playwright diagnostics.
### Workflow reliability and exact-ref verification

The grade engine, state model, persistence schema, localization, accessibility behavior, backup/encrypted-backup formats, CSV portability, and UI remain shared rather than being forked per operating system.

## Cross-platform continuation completed on 2026-08-24
- Prepared package/changelog/handoff metadata atomically for **2.0.12**.
- Fixed the About screen to derive its application version from `package.json` rather than a hardcoded translation value.
- Removed semantic-version literals from English/Hindi catalogs.
- Added `scripts/check-version-sync.mjs`, `npm run version:check`, CI integration, and release-gate protection for the version infrastructure.
- Updated README, development, testing, architecture, release-readiness, release process, roadmap, changelog, and security documentation for the 2.0.12 workflow.
- Added ADR 0007 documenting `package.json` as the single application-version source and explicitly separating package version from persistence-schema version.
- Hardened CSV spreadsheet-export neutralization for `=`, `+`, `-`, `@`, tab, carriage-return, and line-feed prefixes while preserving protected label round trips.
- Added focused CSV regression coverage plus deterministic property cases for the expanded prefix set.
- Updated the release gate so ADR 0007 is required release infrastructure.

## CI blocker discovered and fixed

A PR-triggered GitHub Actions run on Dependabot PR #4 provided network-enabled evidence that the previous ESLint configuration was a real release blocker:

- dependency installation succeeded,
- TypeScript checking succeeded,
- ESLint failed before the remaining CI gates,
- typed project-service parsing was incorrectly applied to JS/MJS files outside the TypeScript projects (`eslint.config.js`, `public/sw.js`, and repository scripts), and
- `react-refresh/only-export-components` produced an intentional AppContext warning that was fatal because lint runs with `--max-warnings=0`.

The current `main` fix scopes type-aware rules to `*.ts`/`*.tsx`, gives Node/service-worker JavaScript explicit globals, keeps normal recommended JavaScript linting, and disables only the known React-refresh false positive for `src/state/AppContext.tsx`. The corrected config passed a direct Node syntax check.

## Dependency/security evidence discovered

The same network-enabled PR installation reported **8 npm audit findings: 2 low, 1 moderate, 3 high, and 2 critical** on the older dependency set represented by that PR merge base. That run stopped at lint before its explicit `npm audit --audit-level=high` step, so it is not sufficient evidence to identify which final 2.0.12 dependency changes resolve every high/critical advisory.

Several Dependabot PRs remain open, including React/React DOM same-major updates and major Vite, TypeScript, ESLint, and Vitest/tooling updates. These are not being blindly merged into 2.0.12. Their PR-triggered CI/E2E evidence must be evaluated against the corrected current main baseline first.

## Repository maintenance cleanup

- Closed stale audit PR #1 as superseded by the completed direct-main audit work.
- Closed stale draft audit PR #2 as superseded by current `main` and 2.0.12 release preparation.
- Latest audited open-issue search: **none**.
- Final code search found no `TODO`, no `FIXME`, no `not implemented` marker, and no stale `GradeCraft 1.0.0` reference.
- Remaining open PRs are dependency-maintenance PRs, not unfinished product-feature PRs.

## Deterministic evidence from this continuation

- The package-version JSON import pattern used by About compiled under GradeCraft's Bundler/JSON TypeScript settings.
- Version synchronization passed a valid 2.0.12 fixture and rejected a fixture that reintroduced `GradeCraft 1.0.0` into a locale catalog.
- Release-tag validation accepted `v2.0.12` and rejected mismatched `v2.0.13`.
- The hardened CSV implementation passed an isolated compiled round-trip harness for formula prefixes, tab/LF/CR prefixes, apostrophes, and Hindi Unicode.
- Prior deterministic harness evidence remains: **200 generated grade cases**, **100 feasible points-target cases**, **3 weighted-target cases**, and the earlier CSV edge-label suite.

These checks do not replace positive dependency-backed verification for the exact final candidate.
### Workflow credential hardening

### Shared runtime/platform detection

Added `src/platform/runtime.ts` as the single shared platform-environment adapter.

It detects:

- browser vs installed PWA vs Tauri native runtime;
- Windows, macOS, Linux, Android, iOS/iPadOS, generic web, and unknown native fallback;
- phone, tablet, and desktop form factor;
- touch/coarse-pointer availability;
- standalone installation state.

The detector handles the iPadOS Safari case where the browser can expose `MacIntel` while reporting multiple touch points.

At application startup it publishes:

- `data-platform`;
- `data-runtime`;
- `data-form-factor`;
- `data-touch`;
- `data-standalone`.

`src/main.tsx` initializes this environment before React renders.

### Mobile-safe responsive UI

Added `src/platform/platform.css`, loaded after the shared stylesheet.

The platform layer now includes:

- `env(safe-area-inset-*)` support for cutouts, rounded display corners, status regions, and gesture areas;
- `100dvh` sizing for mobile browser and installed-app viewport changes;
- additive safe-area spacing around the topbar, content, footer, onboarding, and dialogs;
- touch-target minimum sizing for coarse-pointer devices;
- 16px phone form controls to avoid unwanted mobile zoom behavior;
- sticky installed-phone navigation behavior;
- horizontal mobile navigation scrolling;
- short landscape-phone layout adjustments;
- safe-area-aware content width;
- overscroll suppression only for installed PWA/native runtimes, preserving normal browser pull-to-refresh behavior.

`index.html` now includes `viewport-fit=cover`, standard mobile standalone metadata, and Apple mobile-web-app metadata so installed PWA/native-like mobile presentation can use the safe-area rules correctly.

### Native capability separation

The native permission model is now target-specific:

- `src-tauri/capabilities/default.json`
  - platform-neutral shared capability;
  - local `main` window only;
  - `core:default` only.
- `src-tauri/capabilities/desktop-export.json`
  - generated desktop schema;
  - Linux, macOS, and Windows only;
  - dialog and file-write permissions required by user-requested exports.
- `src-tauri/capabilities/mobile-export.json`
  - generated mobile schema;
  - iOS and Android only;
  - dialog and file-write permissions required by user-requested exports.

This removes the desktop-schema assumption from mobile permissions while retaining the shared native export implementation.

### Real native build CI

`.github/workflows/native.yml` now verifies actual compilation instead of only native-project generation.

Desktop matrix:

- Ubuntu;
- Windows;
- macOS.
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
- independent `npm audit --audit-level=high` CI job;
- `npm run native:check`;
- cross-platform Native CI;
- CodeQL;
- release tag/package-version validation.

`npm run verify` composes the shared static/test/build/budget gates. Browser E2E remains separate because it starts the production preview server and exercises end-to-end journeys. Dependency auditing is also independent in CI so security output is available even when another quality stage fails.

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

During this continuation, earlier PR heads exposed real TypeScript, lint, and formatting issues. Those failures were fixed in source rather than rerunning unchanged jobs or weakening quality rules.

Positive evidence already obtained on intermediate heads:

1. Strict TypeScript passed after compiler/test-fixture fixes.
2. ESLint passed after script/test lint fixes.
3. An earlier head had Native and CodeQL green before later commits superseded it.

Evidence that still must be re-established for the exact final head after the final documentation commits:

1. CI `quality` job.
2. CI `dependency-audit` job.
3. Browser E2E workflow.
4. Native workflow, including desktop core and Android/iOS scaffold jobs.
5. CodeQL workflow.

No superseded result is treated as proof for a later head. No final merge/tag occurs until exact-head evidence is positive.

## Exact 2.0.12 candidate commands
`scripts/check-release-gate.mjs` now protects, in addition to its previous checks:

Each desktop runner regenerates native icons, performs `npm run native:check`, and compiles the debug desktop application with `npm run native:build -- --debug --no-bundle`.

Android CI:

1. configures Java and the installed Android NDK;
2. initializes the Android project;
3. compiles an x86_64 debug APK with `npm run android:build -- --debug --apk --target x86_64 --ci`;
4. uploads the APK as short-lived build evidence.

iOS CI:

1. runs on macOS;
2. initializes the iOS project;
3. compiles an unsigned Apple-Silicon simulator application with `npm run ios:build -- --debug --target aarch64-sim --no-sign`.

Store signing, notarization, provisioning, and production signing secrets remain deliberately outside pull-request CI.

### Cross-platform regression tests

Added `tests/platform.test.ts` covering:

- Android native phone detection;
- iPadOS PWA detection when Safari reports `MacIntel`;
- Windows native desktop detection;
- generic desktop browser fallback;
- root platform/runtime/form-factor/touch/standalone attributes.

### Release-gate hardening

`scripts/check-release-gate.mjs` now requires and validates:

- mobile installation/safe-area metadata;
- platform startup wiring;
- runtime and layout adaptation files;
- platform regression tests;
- all three native capability files;
- exact desktop/mobile capability platform sets and generated schemas;
- Android minimum SDK and explicit iOS minimum system version;
- actual desktop, Android APK, and iOS simulator compile commands in Native CI;
- Android smoke-build artifact retention;
- the existing CI, E2E, CodeQL, release, credential-isolation, screenshot-integrity, and PWA checksum gates.

### Strict quality-gate repairs found during PR validation

GitHub Actions exposed strictness defects that predated or were adjacent to the cross-platform work. They were fixed instead of weakening the checks.

TypeScript fixes:

- added explicit React class `override` modifiers in `ErrorBoundary`;
- preserved non-optional course narrowing in `CoursePage` callbacks;
- guarded indexed file inputs in data tests;
- typed the throwing ErrorBoundary test fixture as `never`;
- dispatched the native dialog `cancel` event explicitly;
- used Testing Library `within(dialog)` for scoped role queries.

Lint fixes:

- documented intentionally skipped scan roots instead of using empty catch blocks;
- simplified release-gate target marker quoting;
- removed control-character regular expressions from download filename sanitation while preserving the same safety policy;
- updated filename tests to assert character-code safety without prohibited regex controls;
- replaced fake-async mocks with explicit resolved promises.

Validation evidence before this handoff-only commit:

- strict TypeScript: passed;
- ESLint with zero warnings: passed;
- formatting: reached the gate and failed only because this Markdown handoff used trailing spaces for hard line breaks; those trailing spaces are removed in this commit.

Because every new commit intentionally causes the exact-head workflows to restart, CI/E2E/Native/CodeQL must be checked once more on the head containing this handoff update.

## Documentation updated

`README.md` and `docs/platforms.md` now document:

- browser/PWA/Windows/macOS/Linux/Android/iOS/iPadOS/ChromeOS support;
- runtime and form-factor detection;
- safe-area/dynamic-viewport/touch behavior;
- Android/iOS build entry points;
- platform-specific native security capabilities;
- real native CI compilation coverage;
- store-signing boundaries and troubleshooting.

## Commits created in this continuation

Core cross-platform work:

- `27277cdf` — feat(platform): add shared runtime platform detection
- `8ba06f59` — feat(platform): add mobile safe-area and touch adaptations
- `3b613089` — test(platform): cover native and browser target detection
- `7e6d00e7` — feat(platform): initialize runtime environment at startup
- `fd105df9` — feat(pwa): enable safe-area aware standalone installs
- `2114b3e7` — security(native): make baseline capability platform neutral
- `45c2fa41` — security(desktop): scope export permissions to desktop targets
- `2adf290b` — security(mobile): scope export permissions to mobile targets
- `195cefce` — ci(native): compile every supported native target
- `35bd88ab` — test(release): enforce full cross-platform build gates
- `f23495d3` — docs(platforms): document verified cross-platform architecture
- `a7341f13` — docs(platforms): cover mobile UX and native build verification
- `ec10295b` — fix(release): validate platform runtime wiring accurately
- `e65dd9e9` — docs(handoff): record complete cross-platform hardening
- `b6034278` — fix(platform): preserve browser refresh and safe-area spacing
- `2cc69103` — docs(handoff): record final mobile UX refinement

Strict validation repairs:

- `e6bf7105` — fix(types): mark error boundary overrides explicitly
- `5949691c` — fix(types): preserve course narrowing in action callbacks
- `80154d95` — test(types): guard encrypted restore file input
- `ed7777ce` — test(types): type throwing boundary fixture as never
- `2e2d83f8` — test(types): dispatch native dialog cancel event explicitly
- `051bf5a4` — test(types): use scoped dialog queries correctly
- `d00356a3` — fix(lint): document ignored formatting scan paths
- `81e9b0b8` — fix(lint): document ignored secret scan paths
- `ce0863c3` — fix(lint): simplify platform target marker checks
- `e8c3d1cf` — fix(export): sanitize control characters without control regex
- `3f8ffbdb` — test(export): assert control safety without control regex
- `2746b00d` — test(lint): use explicit resolved promises in data mocks

## Pull-request verification

PR #21 is open from `feature/full-cross-platform-support` into `main`.

The connected GitHub repository is the authoritative execution environment for this continuation because the local shell cannot resolve `github.com`; no local passing result is fabricated.

GitHub Actions now surfaces CI, E2E, Native, and CodeQL runs for the branch. Superseded runs are cancelled by workflow concurrency when a newer commit is pushed; cancellation of an older head is not treated as failure or success evidence for the new head.

## Exact validation commands

Shared/browser verification:
From a clean network-enabled checkout:

```bash
npm install
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
```

Desktop compile verification:

```bash
npm run native:icons
npm run native:check
npm run native:build -- --debug --no-bundle
```

Android debug smoke build:
Then build the applicable target:
The dedicated `audit/2.0.12-final-ci` PR exists specifically to expose PR-triggered CI/E2E/CodeQL evidence for the corrected current baseline. Do not tag 2.0.12 until high/critical dependency findings are resolved and all required checks are positively green.

## Remaining release work

1. Obtain positive CI/E2E/CodeQL evidence on the corrected current baseline.
2. Identify and resolve every high/critical npm advisory using compatible dependency updates; do not merge major toolchain upgrades solely because Dependabot opened them.
3. Re-run the full quality, E2E, audit, version, release, and performance gates after dependency changes.
4. Generate a trustworthy npm lockfile from the successful network-backed dependency resolution; no lockfile is fabricated in the restricted execution environment.
5. Capture real screenshots from that positively verified production build.
6. Publish and smoke-test a hosted demo only if desired.
7. Confirm repository settings such as branch protection/Discussions separately if desired.
Then run the applicable target build:

```bash
npm run android:init -- --ci
npm run android:build -- --debug --apk --target x86_64 --ci
```

Android release package entry points:

```bash
npm run android:build -- --apk
npm run android:build -- --aab
```

iOS simulator smoke build on macOS:

```bash
npm run ios:init -- --ci
npm run ios:build -- --debug --target aarch64-sim --no-sign
```
## Publication evidence still required

Repository source support is not equivalent to a verified distributable. Before publication, retain positive evidence for:

1. exact-final-head CI quality, independent dependency audit, E2E, Native CI, CodeQL, release gate, version gate, and bundle budget;
2. Windows native build and smoke test, including startup and exports under the enforced CSP;
3. macOS native build and smoke test;
4. intended Linux packages and smoke test;
5. Android APK/AAB build plus emulator/device smoke test;
6. iOS/iPadOS signed/appropriate build plus simulator/device smoke test;
7. web/native backup, encrypted-backup, and CSV interoperability;
8. screen-reader/dialog/chart/validation checks in English and Hindi;
9. sanitized export-default and successful write checks on published native platforms;
10. real screenshots captured only from positively verified builds;
11. optional hosted demo verification before documenting its URL;
12. signing/notarization/provisioning credentials kept outside Git.

A trustworthy npm lockfile should only be committed when generated from a successful registry-backed resolution. No lockfile is fabricated from an offline environment.

## Current continuation commit groups

### Native security and release hardening

- `e201df1` — security(native): enforce restrictive webview CSP
- `5427f9b` — security(native): freeze Object prototype in packaged app
- `cd84a97` — test(release): enforce native webview security baseline
- `b63f915` — docs(adr): record native webview hardening decision
- `e2e7550` — test(release): require native security ADR
- `fa9ab75` — docs(security): document native webview protections
- `1ad6642` — docs(release): add native security verification evidence
- `732d020` — docs(architecture): integrate native webview security boundary

### Accessibility, localization, and validation

- `83c9b4c` — fix(accessibility): give dialogs localized accessible names
- `5ecdf26` — test(accessibility): cover dialog naming and close behavior
- `038650e` — feat(i18n): add localized chart accessibility copy
- `db4c718` — test(i18n): cover Hindi chart accessibility copy
- `897c417` — refactor(validation): add stable issue codes
- `d7006d6` — feat(i18n): add localized validation messages
- `4f0fa35` — fix(i18n): localize assignment validation feedback
- `d783404` — fix(i18n): localize course validation feedback
- `8ec74d4` — fix(i18n): localize scale validation feedback
- `68ac4ed` — test(i18n): cover localized validation feedback

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
- `6c0e5c2` — ci(security): run dependency audit independently

### Cross-platform export portability

- `140a717` — fix(exports): sanitize cross-platform download filenames
- `f891972` — test(exports): cover portable filename sanitization
- `6697134` — security(exports): strip leading dot filename segments

## Open issues

- No known blocker or critical grade-calculation defect has been identified in this continuation.
- The strict pipeline remains authoritative for undiscovered compile/lint/test/build/audit regressions.
- Exact dependency-audit output is still required before further dependency changes are justified.
- Native signed-package and real-device evidence remains external to repository source review.
- Real screenshots, optional demo hosting, and store-distribution artifacts remain publication evidence tasks.
1. Obtain positive CI, E2E, Native CI, CodeQL, dependency-audit, version-sync, release-gate, test, build, and bundle-budget evidence for the exact final 2.0.12 commit.
2. Download the successful exact-commit `publication-screenshots-<sha>` artifact, verify `EVIDENCE.txt`, verify every PNG against `SHA256SUMS.txt`, visually review every capture, and promote only accepted images to `docs/screenshots/`.
3. If/when `v2.0.12` is tagged, confirm the tag workflow passes, verify `release-screenshots-v2.0.12-<sha>`, and verify the published `gradecraft-pwa.zip` against `gradecraft-pwa.zip.sha256`.
4. Build and smoke-test Windows packages on Windows.
5. Build and smoke-test macOS packages on macOS.
6. Build and smoke-test intended Linux bundle formats on Linux.
7. Build APK/AAB and smoke-test Android on an emulator/device before store publication.
8. Build/sign iOS/iPadOS on macOS and smoke-test simulator/device behavior before distribution.
9. Verify standard backup, encrypted backup, and CSV interoperability between at least one browser build and one real native build.
10. Keep Android keystores, Apple certificates, provisioning credentials, and store secrets outside Git.
11. Generate/commit a trustworthy npm lockfile only from successful registry-backed dependency resolution if reproducible transitive locking is desired; do not fabricate one offline.
12. Publish and verify a hosted demo URL only if a public demo is desired.

## Open issues / limitations

- No known blocker/critical grade-calculation defect was identified during this continuation.
- Exact final workflow results are not yet positively evidenced in this environment, so the release is not declared green.
- Real native package builds, device smoke tests, signing/notarization/provisioning, cross-target portability checks, approved screenshots, and hosted deployment evidence remain external tasks.

## Migration notes

Application schema version remains `1`. These 2.0.12 hardening changes do not require a persistence migration and do not change JSON/CSV/encrypted-backup formats.

Before uninstalling a native application or clearing application data, users who need to retain local grades should export a backup.

## 2.0.12 release notes draft

GradeCraft 2.0.12 packages the completed privacy-first grade-management experience with weighted target planning, semester organization/search, English/Hindi localization, authenticated portable backups, staged flexible CSV import, stronger data-integrity and spreadsheet-export safeguards, subpath-safe PWA updates, expanded automated tests, executable release/performance/version gates, diagnostic CI artifacts, package/tag enforcement, package-derived user-visible versioning, and corrected TypeScript-aware ESLint scoping. Final release remains blocked until the network-enabled dependency audit is clean at the configured high-severity threshold and all CI/E2E gates pass.
GradeCraft 2.0.12 delivers the privacy-first grade-management experience through one shared React/TypeScript product across web/PWA, Windows, macOS, Linux, Android, and iOS/iPadOS source targets. The candidate combines weighted and points grading, GPA and what-if planning, semester organization/search, English/Hindi localization, local recovery, authenticated portable backups, flexible staged CSV import, hardened spreadsheet export boundaries, safe cross-platform filenames, offline PWA behavior, Tauri native packaging and save dialogs, guarded destructive data operations, explicit persistence-failure warnings, accessible dialogs/current navigation, comprehensive automated regressions, deterministic publication screenshot evidence with provenance/checksums, executable web/native release gates, exact tag/version checks, PWA archive checksums, and least-privilege GitHub release publication.

iOS release entry point on a properly signed macOS environment:

```bash
npm run ios:build
```

## Release/publication boundaries still external

These require real platform/store environments and credentials and must not be falsely declared complete from source inspection alone:

1. Windows installer smoke testing on a real Windows host.
2. macOS signing/notarization and smoke testing on a real macOS host.
3. Linux bundle smoke testing on intended distributions/package formats.
4. Android device/emulator smoke testing and production APK/AAB signing.
5. iOS/iPadOS simulator/device smoke testing plus Apple signing/provisioning for distribution.
6. Browser-to-native and native-to-native backup/CSV interoperability smoke tests on real built applications.
7. Store listing, signing, privacy, and publication steps for stores actually used.

Android keystores, Apple certificates, provisioning credentials, notarization credentials, and store secrets must remain outside Git.

## Persistence/data migration

Application storage schema remains version `1`.

This continuation changes runtime detection, layout adaptation, native permission declarations, CI verification, tests, utility hardening, and documentation. It does not change the grade data model, JSON backup format, encrypted-backup format, or CSV portability format, so no user-data migration is required.

## Next exact work

1. Inspect CI/E2E/Native/CodeQL on the newest PR #21 head.
2. Fix every actionable failure rather than weakening a gate.
3. Merge PR #21 only after the exact-head evidence is acceptable and GitHub reports it mergeable.
4. Keep real-device/store signing and final distribution evidence as explicit release tasks.
