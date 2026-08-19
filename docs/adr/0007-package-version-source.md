# ADR 0007: Package metadata is the application version source

- Status: Accepted
- Date: 2026-08-19

## Context

GradeCraft previously stored the user-visible application version inside the English and Hindi localization catalogs. That duplicated `package.json` metadata and allowed the About screen to display an obsolete version after a package release bump.

Release metadata also appears in `CHANGELOG.md` and `what_changed.md`, so an unnoticed partial version update could make the repository internally inconsistent even when the application code still built.

## Decision

Use `package.json` as the canonical application/release semantic-version source.

- `AboutPage` imports the package version and renders it beside the localized application name.
- Localization catalogs contain translatable product copy but no GradeCraft semantic-version literal.
- Every prepared release has a dated matching heading in `CHANGELOG.md`.
- `what_changed.md` declares the same package version for the current handoff.
- `scripts/check-version-sync.mjs` verifies these invariants.
- `npm run verify` and CI execute `version:check`.
- The broader release-readiness gate requires the version-sync script, package command, and CI wiring so the check cannot disappear silently.
- Release tags are validated independently against the package version before publication.

## Consequences

Future version bumps require changing package metadata and release documentation, but they do not require editing translated UI version strings. The About screen follows package metadata automatically.

A package-version change is independent from GradeCraft's persisted application schema. A release such as 2.0.12 may continue using schema version 1 when no breaking storage-format migration is needed.

If `package.json`, changelog, handoff, About wiring, or localization-version policy drift apart, verification fails before release.
