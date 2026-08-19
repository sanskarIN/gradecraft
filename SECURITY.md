# Security Policy

## Supported versions

Security fixes are applied to the latest release line.

## Reporting a vulnerability

Do **not** open a public issue for an undisclosed vulnerability. Send a concise report to `supportramsandesh@gmail.com` with reproduction details, affected version, impact, and suggested mitigation when available.

Do not include real student data, credentials, or unrelated private information.

## Security posture

GradeCraft has no authentication backend and keeps grade data client-side. Imported files and browser data are still treated as untrusted: CSV values are validated, duplicate/ambiguous headers are rejected, imported text and dates are bounded/validated, backup formats and domain invariants are checked, unsafe restored course color values are rejected, exported spreadsheet cells are neutralized when they begin with common formula prefixes, and structured logs redact secret/identity-like keys.

The application document includes a restrictive same-origin Content Security Policy baseline and a `no-referrer` policy. The development-compatible CSP permits inline scripts/styles because Vite's development runtime and React styling need them; production hosts that control HTTP response headers should deploy a stricter header-based CSP where practical and test the exact production bundle before tightening directives.

Service-worker requests are limited to same-origin URLs inside the registration scope. Install-time caching only discovers same-origin, in-scope assets from the built application shell, and activation removes obsolete GradeCraft caches before claiming clients.

Browser-storage failures are contained and surfaced to the user rather than silently claiming persistence. A valid recovery record is protected from being replaced by an invalid primary record.

Dependencies are checked by Dependabot, npm audit in CI, and CodeQL. Secrets are checked by the repository secret-scanning script and must never be committed.
