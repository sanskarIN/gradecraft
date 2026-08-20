# Development

## Commands

### Shared web/application commands

- `npm run dev` — start the Vite browser development server.
- `npm run typecheck` — run strict TypeScript verification across application, unit/component tests, and Playwright journeys.
- `npm run lint` — run type-aware ESLint across the repository.
- `npm run format:check` — verify the repository whitespace/line-ending baseline.
- `npm run docs:links` — validate local Markdown links without making network requests.
- `npm run security:secrets` — scan tracked text for common private-key/API-token patterns.
- `npm run version:check` — verify that package metadata, Cargo metadata, Tauri config, changelog, handoff, About version wiring, and localization catalogs cannot drift apart.
- `npm run release:gate` — verify required web/native release files, scripts, identity/support markers, and CI/release workflow wiring.
- `npm run release:tag -- vX.Y.Z` — verify a release tag exactly matches `package.json`.
- `npm test` — run Vitest with coverage thresholds, including deterministic property-style cases.
- `npm run build` — create the production PWA/frontend bundle.
- `npm run perf:budget` — enforce JavaScript, CSS, and total production bundle budgets after a build.
- `npm run test:e2e` — run Playwright Chromium journeys against the production preview build.
- `npm run verify` — run typecheck + lint + format + docs links + secret scan + version sync + release gate + tests + production build + bundle budgets.

### Native desktop commands

- `npm run native:icons` — generate Tauri icon assets from `public/icons/icon.svg`.
- `npm run native:check` — run `cargo check` for the Tauri shell.
- `npm run native:dev` — generate icons and launch the native desktop application.
- `npm run native:build` — generate icons and build native desktop bundles for the current operating system.

### Android commands

- `npm run android:init` — initialize/update the generated Android project.
- `npm run android:dev` — run on a connected Android device/emulator.
- `npm run android:build -- --apk` — build Android APK output.
- `npm run android:build -- --aab` — build an Android App Bundle.

### iOS/iPadOS commands

These commands require macOS with Xcode.

- `npm run ios:init` — initialize/update the generated Apple project.
- `npm run ios:dev` — run on an iOS simulator/device.
- `npm run ios:dev -- --host` — expose Vite correctly for a physical device.
- `npm run ios:build` — create an iOS release build/IPA according to the configured Apple signing environment.

The complete platform prerequisites and packaging guide is [`platforms.md`](platforms.md).

## Recommended local loop

For normal shared feature work:

```bash
npm run typecheck
npm run lint
npm test
```

When changing `src-tauri/`, native plugins, Vite host behavior, export behavior, or native configuration:

```bash
npm run typecheck
npm run native:icons
npm run native:check
npm run native:dev
```

Before pushing:

```bash
npm run version:check
npm run verify
npm run test:e2e
npm audit --audit-level=high
npm run native:check
```

Before tagging the prepared 2.0.12 candidate:

```bash
npm run release:tag -- v2.0.12
```

For later releases, substitute the new package version in that command.

## Versioning rule

`package.json` is the user-visible application version source of truth. The About screen and Tauri configuration derive their version from package metadata. `src-tauri/Cargo.toml` must carry the same semantic version because Cargo requires package metadata in its own manifest.

A release version must also have a matching dated `CHANGELOG.md` heading and matching package version in `what_changed.md`; `npm run version:check` enforces these invariants across web and native metadata.

Do not add semantic-version literals to localization catalogs. This prevents translated UI from retaining an obsolete version after a package bump.

## Cross-platform engineering rules

Keep all grade calculations, validation, GPA rules, state transitions, localization, and portable-data formats in shared TypeScript unless a capability is inherently platform-specific.

Use browser-standard APIs when they work consistently in both browsers and system WebViews. Put the smallest possible adapter at the platform boundary when behavior differs. Current examples are:

- service-worker registration, which is web-only and restricted to HTTP/HTTPS;
- exported files, which use browser downloads on the PWA and native save dialogs in Tauri.

Do not fork the product into separate Android, iOS, Windows, macOS, or Linux implementations unless an architecture decision demonstrates that a shared implementation cannot satisfy the requirement.

Native plugin permissions must follow least privilege. Adding a Tauri plugin requires reviewing its supported platforms, capability permissions, privacy implications, and CI prerequisites.

## Engineering rules

Keep calculation rules pure and covered by unit tests. Validate imported/untrusted values at boundaries. Keep persistence and backup formats versioned. Prefer small accessible components over duplicated page-local UI.

When fixing a defect, add a regression test before or with the fix. When adding a user-facing feature, update the appropriate English/Hindi message catalog rather than scattering new hardcoded copy through route logic.

For edge-heavy math, parser, and serialization behavior, prefer deterministic generated/property-style cases with fixed seeds so failures reproduce locally and in CI.

## Data compatibility rules

Schema-v1 optional additions must remain backward-compatible with older valid v1 records. A breaking persistence change requires an explicit migration path and test fixtures for both the old and new format.

Encrypted-backup format changes are independent from application-schema changes. Do not silently reinterpret an existing encrypted envelope version.

Web and native builds must remain able to exchange standard backup, encrypted backup, and CSV files.

## Privacy rules

Do not add analytics, remote grade-data transmission, provider credentials, or account requirements without an explicit architecture/privacy decision and documentation update. Never log backup passphrases, raw imported academic data, real student records, signing keys, or provisioning credentials.
