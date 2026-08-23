# Release Process

GradeCraft releases must be produced from a clean checkout and must not claim checks that were not actually run. Web/PWA and native platform readiness are separate pieces of evidence: passing one does not imply that every other platform package was built or signed.

## 1. Prepare metadata

1. Update the version in `package.json` only when the release is actually being cut.
2. Update the matching version in `src-tauri/Cargo.toml`.
3. Keep `src-tauri/tauri.conf.json` sourcing its application version from `../package.json`.
4. Update `CHANGELOG.md`, `ROADMAP.md`, and `what_changed.md`.
5. Confirm README, privacy, security, setup, platform, testing, performance, and architecture documentation still match the implementation.
6. Confirm no real student data, credentials, private exports, backup passphrases, Android keystores, Apple certificates, or provisioning secrets are tracked.
7. Run `npm run version:check` to prove web/native metadata, changelog, handoff, About version wiring, and localization catalogs are synchronized.
8. Run `npm run release:gate` to check required project/release files and workflow wiring before the heavier dependency-based checks.

For the prepared candidate, the expected package version is **2.0.12**.

## 2. Clean-checkout shared quality gate

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

## 3. Native core gate

On a host with Tauri prerequisites installed:

```bash
npm run native:icons
npm run native:check
```

Confirm `.github/workflows/native.yml` is green for the exact release commit. It checks the native core on Ubuntu, Windows, and macOS and validates Android/iOS target generation on appropriate runners.

A missing native workflow result is not evidence of native readiness.

## 4. Manual shared product smoke test

Use the production build or a packaged native build, not a development-only page.

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

For the PWA, additionally install it where supported, reload offline, and confirm cached application-shell behavior.

For native builds, additionally confirm exports open the operating system's save dialog and that exported JSON/CSV files can be opened again by GradeCraft.

## 5. Platform package verification

Read [`platforms.md`](platforms.md) before producing platform artifacts.

### Web/PWA

```bash
npm run build
```

Verify `dist/`, service-worker behavior, manifest metadata, and offline shell behavior through an HTTP/HTTPS deployment or `npm run preview`.

### Windows

On Windows:

```bash
npm run native:build
```

Smoke-test the produced Windows bundle/installer on a supported Windows system. Confirm WebView2 behavior, local persistence, file export, keyboard navigation, and uninstall expectations.

### macOS

On macOS:

```bash
npm run native:build
```

Smoke-test the `.app`/bundle. Apply Apple signing/notarization only from the trusted release environment when distribution requires it.

### Linux

On the intended Linux build environment:

```bash
npm run native:build
```

Test at least the bundle format intended for distribution and document any distribution-specific WebKitGTK/runtime requirements.

### Android

Initialize after a clean checkout when needed:

```bash
npm run android:init
```

Build APK and AAB candidates:

```bash
npm run android:build -- --apk
npm run android:build -- --aab
```

Test on at least one emulator and one representative physical device before store publication when practical. Production signing must use a protected Android keystore outside Git.

### iOS/iPadOS

On macOS:

```bash
npm run ios:init
npm run ios:build
```

Test on an iOS simulator and, for device/App Store distribution, an appropriately provisioned physical device. Final IPA export depends on Apple signing and the selected export method. Certificates and provisioning credentials must stay outside Git.

## 6. Cross-platform data compatibility

Use sample data to prove that portable files remain compatible across targets:

1. Create a backup in the web/PWA build and restore it in at least one native build.
2. Create a native backup and restore it in the browser build.
3. Export CSV on one target and import it on another.
4. Export an encrypted backup on one target and restore it with the correct passphrase on another.
5. Confirm no platform writes a different application schema or backup envelope without a documented migration/version decision.

## 7. Security, privacy, and performance review

- Confirm the Content Security Policy is present in the production HTML.
- Confirm no analytics or unexpected remote data endpoints were added.
- Confirm Tauri capabilities grant only the native commands required by the local `main` window.
- Confirm import failures and recovery UI do not expose raw exception content.
- Confirm backup passphrases are never written to Local Storage, logs, URLs, repository files, or release artifacts.
- Confirm mobile/desktop signing secrets are not present in source, Actions logs, or unsigned test artifacts.
- Review dependency audit, CodeQL, Dependabot, and native workflow state.
- Confirm `npm run perf:budget` passed and investigate any material compressed-size regression even when the hard budget remains green.
- Confirm `npm run version:check` passed on the exact commit intended for `v2.0.12`.
- Confirm repository checkouts used by project code keep `persist-credentials: false` and that release verification remains read-only.

## 8. Publication assets

Playwright captures real browser screenshot candidates from the production UI during `npm run test:e2e`:

- onboarding;
- course dashboard;
- representative course detail;
- what-if planner;
- GPA;
- settings in light and dark themes;
- import/export.

On a successful normal E2E workflow, GitHub Actions uploads `publication-screenshots-<commit-sha>`. On a successful tag release, the release workflow runs Playwright against the already-built `dist/` output and uploads `release-screenshots-<tag>-<commit-sha>`.

Both screenshot artifacts contain:

- `EVIDENCE.txt` with repository, exact commit, ref, triggering event, workflow, run ID, and run attempt;
- the captured PNG files;
- `SHA256SUMS.txt`, generated from those PNG files before upload.

The tagged evidence additionally records the exact release tag. After downloading an artifact, verify its PNG integrity from the artifact directory with `sha256sum -c SHA256SUMS.txt` on systems that provide GNU coreutils, or an equivalent SHA-256 checker on the release host.

Do not automatically treat these files as approved publication screenshots. Confirm the exact successful Actions run, verify the evidence/checksum manifest, visually review every capture, and then copy only accepted images into `docs/screenshots/`. See [`screenshots/README.md`](screenshots/README.md).

Native/store screenshots must still come from a positively verified build of the relevant native target. Browser evidence cannot be used to claim that a Windows, macOS, Linux, Android, or iOS package was built or smoke-tested.

If a hosted demo is published, smoke-test that exact deployment URL, including service-worker scope, direct reloads, PWA installation, and offline behavior. Add the verified URL to README only after it works.

Store screenshots and metadata should reflect the actual target build being published.

## 9. Tag and release

1. Confirm the release commit is the exact clean-checkout commit that passed shared and applicable native verification.
2. Run `npm run version:check` again on that exact commit.
3. Validate the intended tag with `npm run release:tag -- v2.0.12`.
4. Create and push tag `v2.0.12` only after the prior checks have positive evidence.
5. The `verify` job runs with read-only repository permission, validates the tag/package version pair, runs `npm run verify`, runs the high-severity dependency audit, installs Chromium, and executes Playwright against the already-built verified `dist/` output.
6. The `verify` job records screenshot evidence/checksums, packages `dist/` into `gradecraft-pwa.zip`, generates `gradecraft-pwa.zip.sha256`, and stages only those verified PWA release files as a short-lived Actions artifact.
7. The separate `publish` job depends on successful verification, downloads the staged PWA release files, receives the write-capable `contents` permission, and publishes the GitHub release. Repository project code is not checked out or executed in that write-capable job.
8. Confirm the published GitHub release contains both `gradecraft-pwa.zip` and `gradecraft-pwa.zip.sha256`; verify the archive against that checksum after downloading it.
9. Native installers/packages must be attached or distributed only after their own platform build, smoke test, and signing evidence is complete. Do not label an unbuilt platform as released merely because the source supports it.
10. Verify every published artifact came from the expected commit.

## Future version bumps

For releases after 2.0.12, change `package.json` and `src-tauri/Cargo.toml` together, create the matching dated changelog heading, update `what_changed.md`, and let the About screen/Tauri config inherit the package version automatically. Do not reintroduce version literals into translation catalogs.

## Evidence rule

A missing status result is not a successful status result. If GitHub API/connector surfaces do not expose a workflow run for a direct push, verify through the repository Actions UI or another authoritative CI surface before calling the release green.
