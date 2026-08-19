# Security Policy

## Supported versions

Security fixes are applied to the latest release line.

## Reporting a vulnerability

Do **not** open a public issue for an undisclosed vulnerability. Send a concise report to `supportramsandesh@gmail.com` with reproduction details, affected version, impact, and suggested mitigation when available.

Do not include real student data, credentials, or unrelated private information.

## Security posture

GradeCraft has no authentication backend and keeps grade data client-side. Imported files and browser data are still treated as untrusted: CSV values are validated, backup formats are checked, exported spreadsheet cells are neutralized when they begin with common formula prefixes, and logs redact secret/identity-like keys.

Dependencies are checked by Dependabot, npm audit in CI, and CodeQL.
