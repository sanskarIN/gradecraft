# Release Process

GradeCraft releases must be produced from a clean checkout and must not claim checks that were not actually run.

## 1. Prepare metadata

1. Update the version in `package.json` only when the release is actually being cut.
2. Update `CHANGELOG.md`, `ROADMAP.md`, and `what_changed.md`.
3. Confirm README, privacy, security, setup, testing, performance, and architecture documentation still match the implementation.
4. Confirm no real student data, credentials, private exports, or backup passphrases are tracked.
5. Run `npm run version:check` to prove package metadata, changelog, handoff, About version wiring, and localization catalogs are synchronized.
6. Run `npm run release:gate` to check required project/release files and workflow wiring before the heavier dependency-based checks.

For the prepared candidate, the expected package version is **2.0.12**.

## 2. Clean-checkout quality gate

From a clean clone using a supported Node.js release:

```bash
npm install
npm run verify
```

`npm run verify` includes TypeScript, ESLint, repository format checks, Markdown-link checks, secret scanning, version synchronization, the static release-readiness gate, unit/component/property tests with coverage, the production build, and production bundle-size budgets.

Install the Playwright browser when needed and run:

```bash
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
npm run release:tag -- v2.0.12
```

Any failure blocks the release until it is understood and resolved.

## 3. Manual product smoke test

Use the production build, not a development-only page.

- Complete first-run onboarding.
- Open About and confirm the displayed application version is `2.0.12`.
- Create both a weighted and points-based course.
- Add/edit/delete an assignment and verify undo for assignment deletion.
- Verify weighted and points target-score planning.
- Verify GPA and charts with real sample values.
- Add semester metadata and verify grouping/filter/search.
- Switch English → Hindi, reload, and verify the setting persists while About still shows the same package-derived version.
- Export and restore a standard JSON backup.
- Export CSV and import a third-party CSV using arbitrary column mapping.
- Export an encrypted backup with a passphrase, verify the file does not visibly contain course JSON, restore with the correct passphrase, and verify a wrong passphrase is rejected.
- Verify light/dark/system theme behavior, reduced motion, compact mode, keyboard navigation, focus indicators, and 200% zoom.
- Install the PWA where supported, reload offline, and confirm cached application-shell behavior.

## 4. Security, privacy, and performance review

- Confirm the Content Security Policy is present in the production HTML.
- Confirm no analytics or unexpected remote data endpoints were added.
- Confirm import failures and recovery UI do not expose raw exception content.
- Confirm backup passphrases are never written to Local Storage, logs, URLs, repository files, or release artifacts.
- Review dependency audit, CodeQL, and Dependabot state.
- Confirm `npm run perf:budget` passed and investigate any material compressed-size regression even when the hard budget remains green.
- Confirm `npm run version:check` passed on the exact commit intended for `v2.0.12`.

## 5. Publication assets

Capture **real screenshots from the verified production build** and place them in `docs/screenshots/`. Do not substitute generated or mock screenshots as proof of functionality.

If a hosted demo is published, smoke-test that exact deployment URL, including service-worker scope, direct reloads, PWA installation, and offline behavior. Add the verified URL to README only after it works.

## 6. Tag and release

1. Confirm the release commit is the exact clean-checkout commit that passed verification.
2. Run `npm run version:check` again on that exact commit.
3. Validate the intended tag with `npm run release:tag -- v2.0.12`.
4. Create and push tag `v2.0.12` only after the prior checks have positive evidence.
5. The release workflow validates the tag/package version pair, runs `npm run verify`, runs the high-severity dependency audit, installs Chromium, and executes Playwright against the already-built verified `dist/` output.
6. Only after every gate passes does the workflow package `dist/` into `gradecraft-pwa.zip` and attach it to the GitHub release.
7. Verify the attached archive came from the expected commit.
8. Smoke-test the hosted/static deployment again after publication.

## Future version bumps

For releases after 2.0.12, change `package.json`, create the matching dated changelog heading, update `what_changed.md`, and let the About screen inherit the package version automatically. Do not reintroduce version literals into translation catalogs.

## Evidence rule

A missing status result is not a successful status result. If GitHub API/connector surfaces do not expose a workflow run for a direct push, record that limitation and verify through the repository Actions UI or another authoritative CI surface before calling the release green.
