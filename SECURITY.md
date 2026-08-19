# Security Policy

## Supported versions

Security fixes are applied to the latest release line.

## Reporting a vulnerability

Do **not** open a public issue for an undisclosed vulnerability. Send a concise report to `supportramsandesh@gmail.com` with reproduction details, affected version, impact, and suggested mitigation when available.

Do not include real student data, credentials, passphrases, or unrelated private information.

## Security posture

GradeCraft has no authentication backend and keeps grade data client-side. Imported files and browser data are still treated as untrusted:

- CSV values are validated before course mutation.
- Arbitrary CSV mappings are reviewed before imported rows are applied.
- Backup envelope formats and schema versions are validated before restore.
- Restore requires explicit user confirmation before replacing current local data.
- Exported spreadsheet cells are neutralized when they begin with common formula prefixes or control-character prefixes such as tab/newline/carriage return, with round-trip handling for protected names.
- Category edits cannot orphan saved assignments.
- Grading-scale deletion is blocked when a profile is in use or is the last remaining profile.
- Local Storage recovery repairs a corrupt primary record from a valid recovery snapshot without copying the corrupt record over the recovery copy.
- Local and imported files have explicit size limits in the UI.
- Structured logs redact identity/secret-like keys and avoid raw parser/storage exception text.
- The browser entry point applies a restrictive Content Security Policy and a no-referrer policy.
- The PWA service worker handles only same-origin requests inside its scope and refreshes navigations from the network when online.
- An application-level error boundary avoids exposing raw render failures in the recovery UI.

Dependencies are checked by Dependabot, npm audit in CI, and CodeQL.

## Encrypted backup design

Optional encrypted backup files use the browser Web Crypto API rather than custom cryptographic primitives:

- AES-256-GCM provides encryption and authentication.
- PBKDF2 with SHA-256 derives the encryption key from the user passphrase.
- Every export uses a new random 16-byte salt and 12-byte IV.
- The current format uses 210,000 PBKDF2 iterations and records the iteration count in the encrypted envelope.
- Restore rejects unsupported parameters, invalid authentication, tampering, and incorrect passphrases.
- Backup passphrases are not persisted by GradeCraft, are not included in exported files, and successful operations clear the passphrase fields from live form state.

Encrypted backup protection applies to the exported backup file. It does **not** encrypt GradeCraft's normal Local Storage while the application is in use. A hostile browser extension, compromised device, or script executing with the application's origin privileges could potentially access data that the browser itself can access. Device/browser security therefore remains part of the trust boundary.

## Verification limitations

Security controls should be reviewed together with automated tests, CodeQL, dependency auditing, and a verified production build. A green static-analysis result is not by itself a guarantee that the application is vulnerability-free.
