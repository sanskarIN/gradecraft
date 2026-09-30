# Release Readiness

This document separates repository-complete engineering work from evidence that must come from an actual clean build, browser run, native build, device run, or published deployment. GradeCraft must not treat missing evidence as a passing result.

## Repository-level gates

| Gate | Repository implementation |
| --- | --- |
| Type safety | `npm run typecheck` |
| Lint | `npm run lint` |
| Repository formatting | `npm run format:check` |
| Documentation links | `npm run docs:links` |
| Secret-pattern scan | `npm run security:secrets` |
| Version synchronization | `npm run version:check` |
| Release structure | `npm run release:gate` |
| Native webview security baseline | `npm run release:gate` checks CSP, prototype freezing, and asset CSP rewriting |
| Unit/component/property tests | `npm test` |
| Production web/frontend build | `npm run build` |
| Bundle budgets | `npm run perf:budget` |
| Browser journeys | `npm run test:e2e` |
| Browser screenshot evidence | `e2e/publication-screenshots.spec.ts` plus successful E2E artifact, provenance, and SHA-256 manifest |
| Native Rust/Tauri compile check | `npm run native:check` |
| Windows native core | `.github/workflows/native.yml` on `windows-latest` |
| macOS native core | `.github/workflows/native.yml` on `macos-latest` |
| Linux native core | `.github/workflows/native.yml` on `ubuntu-latest` |
| Android JNI/native compile | `.github/workflows/native.yml` builds an `aarch64` debug APK |
| iOS project generation | `.github/workflows/native.yml` iOS job |
| Dependency audit | `npm audit --audit-level=high` |
| Static security analysis | GitHub CodeQL workflow |
| Tag/package consistency | `npm run release:tag -- vX.Y.Z` |
| PWA release integrity | Published `gradecraft-pwa.zip` plus `gradecraft-pwa.zip.sha256` |

The main CI workflow runs the shared non-browser quality gates plus the dependency audit and uploads the coverage report. The E2E workflow installs Chromium, runs Playwright, and preserves the HTML report as an artifact. The Native workflow verifies the shared Tauri shell on the three desktop runner families and validates mobile project generation. CI, E2E, and Native use per-ref concurrency so a newer commit cancels obsolete verification for the same ref; CI and Native can also be dispatched manually when collecting release evidence.
The main CI workflow runs the shared non-browser quality gates plus the dependency audit and uploads the coverage report. The E2E workflow installs Chromium, runs Playwright, and preserves the HTML report as an artifact. The Native workflow verifies the shared Tauri shell on the three desktop runner families, compiles an Android `aarch64` debug APK, and validates iOS project generation.
The main CI workflow runs the shared non-browser quality gates plus the dependency audit and uploads the coverage report. The E2E workflow installs Chromium, runs Playwright, preserves the HTML report, and on success uploads commit-addressed screenshot candidates plus evidence metadata and hashes. The Native workflow verifies the shared Tauri shell on the three desktop runner families and validates mobile project generation.

CI, E2E, Native, and CodeQL support manual dispatch for exact-ref verification. They cancel superseded runs on the same ref so obsolete work does not obscure the newest result. Every repository checkout used by project code disables persisted Git credentials.

## Version 2.0.12 candidate commands

From a clean checkout:

```bash
npm install
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
npm run native:check
npm run release:tag -- v2.0.12
```

A release candidate is blocked by any failure.

`npm run native:check` generates the native icons before Cargo compilation, so it is safe on a clean checkout.

`npm run version:check` is included inside `npm run verify`. It requires `package.json`, `src-tauri/Cargo.toml`, Tauri's package-version source, the dated changelog release heading, `what_changed.md`, and the About screen's package-derived version wiring to agree. It also prevents semantic-version literals from returning to the localization catalogs.

`npm run release:gate` also protects the packaged native trust boundary. It requires the Tauri CSP to stay enabled with the approved local/IPC directives, rejects wildcard CSP sources, requires `freezePrototype: true`, rejects explicit disabling of Tauri's asset CSP modification, and requires ADR 0009 to remain present.

## Platform artifact evidence

Source support is not the same as a verified release artifact. A platform should be marked released only after the relevant package has been built and smoke-tested from the exact release commit.

| Target | Minimum release evidence |
| --- | --- |
| Web/PWA | `npm run build`, browser E2E, reviewed screenshot evidence, deployed/preview PWA smoke test, release ZIP checksum verification |
| Windows | Native workflow green plus `npm run native:build` and Windows package smoke test |
| macOS | Native workflow green plus `npm run native:build` and macOS app smoke test |
| Linux | Native workflow green plus `npm run native:build` and intended Linux bundle smoke test |
| Android | Native debug-APK compile green plus release APK/AAB build and emulator/device smoke test |
| iOS/iPadOS | iOS scaffold green plus signed/appropriate iOS build and simulator/device smoke test |

Signing/notarization/provisioning evidence belongs to the trusted release environment. Signing credentials are never a repository-level gate because they must not be committed.

## Android provider evidence

The Android CI build must compile `src-tauri/src/android_export.rs` and the Android-only JNI dependency. The release gate also requires the adapter and key `ContentResolver` operations. This is source/build evidence only; at least one real Android document-provider save should still be smoke-tested before store publication.
## Screenshot evidence integrity

The E2E workflow captures onboarding, dashboard, representative course detail, what-if, GPA, light/dark settings, and import/export views from the real production UI. A successful run uploads `publication-screenshots-<commit-sha>` and records repository, exact commit, ref, triggering event, workflow, run ID, and attempt in `EVIDENCE.txt`.

Before upload, every PNG is hashed into `SHA256SUMS.txt`. The tag-release workflow captures the same views against the already-built `dist/` artifact and uploads `release-screenshots-<tag>-<commit-sha>` with the same provenance plus the exact tag.

After downloading evidence, verify `SHA256SUMS.txt` with a SHA-256 checker before promoting images. These are still candidate artifacts: they become repository publication screenshots only after a release operator confirms the exact successful run and visually reviews every image. Browser screenshots do not establish native package readiness. See [`screenshots/README.md`](screenshots/README.md).

## Tagged PWA publication boundary

The tag workflow deliberately separates verification from publication:

1. `verify` runs with read-only repository permission, executes the release gates, captures/hashes screenshot evidence, packages the verified `dist/`, creates `gradecraft-pwa.zip.sha256`, and stages those PWA files as a short-lived Actions artifact.
2. `publish` depends on `verify`, downloads only those staged files, receives `contents: write`, and publishes the GitHub release.
3. Repository code is not checked out or executed in the write-capable publication job.

This boundary reduces the credential scope available to dependency/build/test code while preserving automated GitHub release creation.

## Manual evidence still required before publication

- Verify the complete smoke-test list in [`release.md`](release.md) against the target build.
- Review keyboard navigation, focus order, zoom, contrast, reduced motion, and a screen reader on primary journeys.
- Verify PWA installation, update behavior, subpath hosting, and offline shell behavior in a real browser.
- Verify native system save dialogs and cross-platform backup/CSV interoperability on native targets being published.
- Verify packaged native windows start successfully with the enforced CSP and that no required local assets or Tauri IPC calls are blocked.
- On Android, verify a `content://` document-provider export produces a readable non-empty JSON/CSV file.
- Review current CodeQL, Dependabot, CI, E2E, and Native results in GitHub Actions.
- Review and promote browser screenshot candidates only from a positively verified exact-commit run after verifying the hash manifest.
- Verify the published PWA ZIP against `gradecraft-pwa.zip.sha256`.
- For Android/iOS releases, test an emulator/simulator and a physical device when practical before store publication.
- Capture native/store screenshots only after the verified target package is running.
- Verify any hosted demo URL before adding it to the README.

## 2.0.12 tagging rule

Do not push `v2.0.12` merely because package metadata has been prepared. First obtain positive evidence for clean-checkout verification, browser journeys, dependency audit, and current GitHub security/quality/native workflows. A platform package additionally needs its platform-specific build and smoke-test evidence.

## Evidence integrity

A connector/API response that contains no check contexts is not proof that checks passed. A successful release requires positive evidence from the clean-checkout commands and/or the corresponding GitHub Actions runs.

The repository intentionally keeps screenshot placeholders until a successful exact-commit capture artifact has been reviewed and promoted; generated or mock screenshots are never substituted for release evidence.
