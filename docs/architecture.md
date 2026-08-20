# Architecture

GradeCraft is a modular client-side monolith with thin platform shells. No backend is required for core use, and the application remains useful without an account, cloud provider, or remote API.

The React/TypeScript application is the product implementation for every target. The browser/PWA runs it directly, while Tauri 2 embeds the same frontend in native shells for Windows, macOS, Linux, Android, and iOS/iPadOS.

## Layers

1. **Domain (`src/domain`)** — deterministic models and grade/GPA/what-if rules. No React or browser-storage dependencies.
2. **Data (`src/data`)** — Local Storage persistence, backup envelopes, encrypted backup handling, CSV parsing/serialization/mapping, migration boundaries, and redacted structured logging.
3. **Internationalization (`src/i18n`)** — typed English/Hindi catalogs plus specialized portable-data message catalogs.
4. **State (`src/state`)** — reducer/context wiring domain data, settings, persistence, theme, accessibility, and document language to the application.
5. **UI (`src/components`, `src/pages`)** — reusable components and route-level workflows.
6. **Shared platform adapters (`src/utils`, startup code)** — small runtime-aware boundaries for behavior that differs between browsers and native WebViews, such as file exports and service-worker registration.
7. **Web platform (`public/sw.js`, `public/manifest.webmanifest`, `index.html`)** — offline cache shell, PWA manifest integration, and browser security policy.
8. **Native platform (`src-tauri`)** — Tauri/Rust entry points, application/bundle metadata, mobile project generation, native plugin registration, capability permissions, and packaged-WebView security configuration.

Dependency flow points inward: pages depend on components/state/domain/data as needed; pure domain logic does not depend on React or a specific platform shell. Native code does not reimplement grading or persistence rules.

## Cross-platform shell

`src-tauri/src/lib.rs` is the shared Tauri entry point used by desktop and mobile targets. `src-tauri/src/main.rs` is the desktop executable entry point. `src-tauri/tauri.conf.json` points at the same Vite development server and `dist/` production frontend used by the PWA.

Tauri is intentionally a thin shell. Native plugins are added only when browser behavior is insufficient. Current native integration is limited to system save dialogs and filesystem writes for user-requested exports.

`src-tauri/capabilities/default.json` associates those plugin permissions only with the local `main` window. Remote web content is not granted native capabilities.

Packaged Tauri windows enforce an explicit CSP that defaults application content to local sources, allows only the IPC connection endpoints required by Tauri, and blocks objects, frames, framing, wildcard sources, off-origin form targets, and mutable base URLs. Packaged custom-protocol pages also use Tauri's `freezePrototype` hardening. These settings are checked by the release gate rather than treated as optional documentation-only guidance.

See [`adr/0008-tauri-cross-platform-shell.md`](adr/0008-tauri-cross-platform-shell.md), [`adr/0009-native-webview-hardening.md`](adr/0009-native-webview-hardening.md), and [`platforms.md`](platforms.md).

## Runtime-aware browser/native behavior

### Service workers

The PWA service worker is registered only in production on HTTP/HTTPS origins. A packaged Tauri application loads bundled frontend resources and therefore intentionally skips browser service-worker registration.

### File exports

`src/utils/download.ts` is the shared export adapter:

- browser/PWA targets create a `Blob` and use the normal browser download flow;
- Tauri targets open the native save dialog and write to the selected platform path/URI through the filesystem plugin.

This keeps JSON backup, encrypted backup, and CSV formats identical across platforms while allowing Android/iOS to use their native document-provider URI models.

## Persistence and compatibility

Schema version `1` is stored under a namespaced Local Storage key. Each save preserves the previous serialized record as a recovery copy before replacing the primary record. Invalid/corrupt data falls back to recovery and then a clean default dataset.

The same storage API is used in browsers and Tauri system WebViews. Each installed native app receives its own application WebView storage. Users should export a backup before uninstalling an application or clearing its application data when the data must be retained.

Backward-compatible optional fields such as `Course.semester` and `Settings.language` do not require a schema-version bump. The schema validator accepts older v1 data where those fields are absent and rejects malformed values when they are present.

The package/application release version is independent from the persisted schema version. GradeCraft 2.0.12 therefore remains compatible with valid schema-v1 data and does not imply a persistence migration.

## Grade calculation

Grade math remains in `src/domain/gradeMath.ts`. What-if scenarios clone/override temporary scores rather than mutating persisted courses. The weighted target solver models the future assignment inside its selected category and normalizes against active category weight so previously empty target categories can become active correctly.

## Routing

A small hash router avoids requiring server rewrite configuration for static PWA hosts and also works with packaged native application URLs.

## CSV import/export boundary

CSV text is parsed as untrusted input. Canonical GradeCraft headers work directly, while third-party headers can be mapped to semantic fields. Common aliases are suggested, but the UI stages the file and mapping in memory and does not update a course until required mappings are present and the user confirms import.

The final imported values still pass score/category validation before state mutation. CSV export neutralizes cells beginning with spreadsheet formula prefixes (`=`, `+`, `-`, `@`) and control prefixes (tab, carriage return, line feed). GradeCraft's import path recognizes its own neutralization marker so protected assignment/category labels round-trip without silently changing user text.

## Backup architecture

### Standard backups

Standard JSON backups wrap the complete v1 app state in a versioned GradeCraft envelope. Restore validates both the backup envelope and the contained application schema.

### Encrypted backups

Encrypted backup support is provider-agnostic. GradeCraft encrypts the standard backup JSON in the client with AES-256-GCM. The key is derived from the user passphrase with PBKDF2-SHA-256, a random 16-byte salt, and an iteration count recorded in the encrypted envelope. Each export uses a random 12-byte IV.

Only salt, IV, KDF/algorithm metadata, iteration count, and ciphertext are exported. The passphrase is not persisted. Users may move the resulting encrypted file through any storage provider they choose; provider authentication is deliberately outside GradeCraft.

## Security boundaries

CSV, JSON backup files, encrypted backup envelopes, and Local Storage contents are untrusted. Parsers validate types/ranges before data is incorporated. No dynamic HTML injection is used; React escapes rendered strings by default.

`index.html` applies a restrictive Content Security Policy and no-referrer policy for browser/PWA delivery. Packaged native windows use the separate Tauri CSP/prototype-hardening policy described above because browser-page policy should not be assumed to cover the privileged native WebView boundary automatically. These controls reduce exposure but do not change the fundamental WebView/origin trust boundary: code executing with the application's privileges can access in-use local data that the runtime can access.

Native plugin access is additionally constrained by Tauri capabilities. New native permissions require an explicit review because they expand what the local frontend can request from the operating system. `scripts/check-release-gate.mjs` protects the approved CSP and capability baseline from silent regression.

The application-level error boundary provides a safe recovery UI, while structured logging records redacted/safe metadata instead of raw user data or parser/storage exception text.

## Internationalization

`src/i18n/en.ts` is the source English catalog. `src/i18n/hi.ts` must satisfy the same typed catalog shape, and `src/i18n/messages.ts` selects the active catalog from the persisted locale preference. The document `lang` attribute follows that setting.

Specialized data-portability copy lives in small locale-aware modules where keeping the main catalog compact improves maintainability. New user-facing strings should be externalized rather than embedded directly in route logic whenever practical.

Application semantic versions are deliberately excluded from localization catalogs. Version text is metadata, not translatable content.

## Version source of truth

`package.json` is the canonical application/release version source. `AboutPage` imports the package version and renders it with the localized application name. `src-tauri/tauri.conf.json` also points to `../package.json` for the native application version.

Cargo requires its own package version in `src-tauri/Cargo.toml`; the repository version check enforces that it exactly matches `package.json`.

`scripts/check-version-sync.mjs` verifies that:

- the package version is valid semantic versioning,
- `CHANGELOG.md` contains a dated heading for that version,
- `what_changed.md` declares the same package version,
- the About screen remains wired to package metadata,
- Cargo carries the same package version,
- Tauri continues to source its application version from `package.json`, and
- English/Hindi catalogs do not reintroduce hardcoded GradeCraft semantic-version strings.

See [`adr/0007-package-version-source.md`](adr/0007-package-version-source.md) for the versioning decision.

## Verification architecture

`npm run verify` composes static typing, linting, repository formatting, documentation-link checking, secret scanning, version synchronization, the release-readiness gate, unit/component/property coverage, the production build, and production bundle budgets. Playwright remains a separate browser gate because it starts the production preview server and exercises end-to-end journeys.

`npm run native:check` validates the Rust/Tauri layer. `.github/workflows/native.yml` runs that native core check across Ubuntu, Windows, and macOS and also validates Android/iOS project generation on appropriate runners.

The release process requires both the shared web quality evidence and relevant native platform evidence before a platform package is called release-ready.
