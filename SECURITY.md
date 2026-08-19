# Security Policy

## Supported versions

Security fixes are applied to the latest release line.

## Reporting a vulnerability

Do **not** open a public issue for an undisclosed vulnerability. Send a concise report to `supportramsandesh@gmail.com` with reproduction details, affected version, impact, and suggested mitigation when available.

Do not include real student data, credentials, or unrelated private information.

## Security posture

GradeCraft has no authentication backend and keeps grade data client-side. Imported files and browser data are still treated as untrusted: CSV values are validated, duplicate/ambiguous headers are rejected, imported text/dates/row counts are bounded, explicit weights cannot silently conflict with existing categories, backup formats and domain invariants are checked, persistence timestamps must be canonical ISO values, unsafe restored course color values are rejected, exported spreadsheet cells are neutralized when they begin with common formula prefixes, and unexpected transfer exceptions are converted to approved user-safe messages.

The application document includes a restrictive same-origin Content Security Policy baseline and a `no-referrer` policy. Inline scripts are not allowed by the client-side CSP. Inline styles remain allowed because current React UI components use bounded inline style properties for safe visual values such as progress widths/course colors. Production hosts that control HTTP response headers should also configure equivalent or stricter header-based security policy and test the exact production bundle before tightening directives further.

Service-worker requests are limited to same-origin URLs inside the registration scope. Install-time caching only discovers same-origin, in-scope assets from the built application shell, cache reads use the GradeCraft-owned cache directly, and activation removes only obsolete GradeCraft-prefixed caches before claiming clients.

Browser-storage failures are contained and surfaced to the user rather than silently claiming persistence. A valid recovery record is protected from being replaced by an invalid primary record, and explicit local-data deletion leaves the GradeCraft storage keys cleared during the reset operation.

Structured logs redact sensitive domain/identity keys as well as email and bearer-token patterns found inside generic string values. The repository secret scanner includes dotenv files such as `.env.example` plus common GitHub, Google, OpenAI-style, AWS, Slack, and private-key credential patterns.

Dependencies are checked by Dependabot, npm audit in CI, and CodeQL. Secrets are checked by the repository secret-scanning script and must never be committed.
