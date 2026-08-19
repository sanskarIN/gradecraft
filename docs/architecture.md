# Architecture

GradeCraft is a modular client-side monolith. No backend is required for core use, and the application remains useful without an account, cloud provider, or remote API.

## Layers

1. **Domain (`src/domain`)** — deterministic models and grade/GPA/what-if rules. No React or browser-storage dependencies.
2. **Data (`src/data`)** — Local Storage persistence, backup envelopes, encrypted backup handling, CSV parsing/serialization/mapping, migration boundaries, and redacted structured logging.
3. **Internationalization (`src/i18n`)** — typed English/Hindi catalogs plus specialized portable-data message catalogs.
4. **State (`src/state`)** — reducer/context wiring domain data, settings, persistence, theme, accessibility, and document language to the application.
5. **UI (`src/components`, `src/pages`)** — reusable components and route-level workflows.
6. **Platform (`public/sw.js`, `index.html`)** — offline cache shell, PWA manifest integration, and browser security policy.

Dependency flow points inward: pages depend on components/state/domain/data as needed; pure domain logic does not depend on React or the browser UI.

## Persistence and compatibility

Schema version `1` is stored under a namespaced Local Storage key. Each save preserves the previous serialized record as a recovery copy before replacing the primary record. Invalid/corrupt data falls back to recovery and then a clean default dataset.

Backward-compatible optional fields such as `Course.semester` and `Settings.language` do not require a schema-version bump. The schema validator accepts older v1 data where those fields are absent and rejects malformed values when they are present.

## Grade calculation

Grade math remains in `src/domain/gradeMath.ts`. What-if scenarios clone/override temporary scores rather than mutating persisted courses. The weighted target solver models the future assignment inside its selected category and normalizes against active category weight so previously empty target categories can become active correctly.

## Routing

A small hash router avoids requiring server rewrite configuration for static PWA hosts.

## CSV import boundary

CSV text is parsed as untrusted input. Canonical GradeCraft headers work directly, while third-party headers can be mapped to semantic fields. Common aliases are suggested, but the UI stages the file and mapping in memory and does not update a course until required mappings are present and the user confirms import.

The final imported values still pass score/category validation before state mutation. CSV export neutralizes cells beginning with common spreadsheet formula prefixes.

## Backup architecture

### Standard backups

Standard JSON backups wrap the complete v1 app state in a versioned GradeCraft envelope. Restore validates both the backup envelope and the contained application schema.

### Encrypted backups

Encrypted backup support is provider-agnostic. GradeCraft encrypts the standard backup JSON in the browser with AES-256-GCM. The key is derived from the user passphrase with PBKDF2-SHA-256, a random 16-byte salt, and an iteration count recorded in the encrypted envelope. Each export uses a random 12-byte IV.

Only salt, IV, KDF/algorithm metadata, iteration count, and ciphertext are exported. The passphrase is not persisted. Users may move the resulting encrypted file through any storage provider they choose; provider authentication is deliberately outside GradeCraft.

## Security boundaries

CSV, JSON backup files, encrypted backup envelopes, and Local Storage contents are untrusted. Parsers validate types/ranges before data is incorporated. No dynamic HTML injection is used; React escapes rendered strings by default.

`index.html` applies a restrictive Content Security Policy and no-referrer policy. These controls reduce exposure but do not change the fundamental browser trust boundary: code executing with the application's origin privileges can access in-use local data that the browser can access.

The application-level error boundary provides a safe recovery UI, while structured logging records redacted/safe metadata instead of raw user data or parser/storage exception text.

## Internationalization

`src/i18n/en.ts` is the source English catalog. `src/i18n/hi.ts` must satisfy the same typed catalog shape, and `src/i18n/messages.ts` selects the active catalog from the persisted locale preference. The document `lang` attribute follows that setting.

Specialized data-portability copy lives in small locale-aware modules where keeping the main catalog compact improves maintainability. New user-facing strings should be externalized rather than embedded directly in route logic whenever practical.

## Verification architecture

`npm run verify` composes static typing, linting, repository formatting, documentation-link checking, secret scanning, unit/component coverage, and the production build. Playwright remains a separate browser gate because it starts the production preview server and exercises end-to-end journeys.
