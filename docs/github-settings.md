# Recommended GitHub Repository Settings

These settings are repository configuration and are not automatically enabled by source commits.

## Main branch protection

Protect `main` and require pull requests before merging. Require the latest PR-head checks to complete successfully before merge. The repository workflows that should be treated as release-quality gates include:

- CI — strict TypeScript, ESLint, deterministic formatting, documentation links, version consistency, secret-pattern scanning, Vitest coverage, production build, and high-severity npm audit
- E2E — Playwright Chromium journeys, including weighted planning and first-install offline reload behavior
- CodeQL — JavaScript/TypeScript security analysis

Do not accept a superseded, cancelled, queued, pending, skipped, or earlier-head run as evidence for the final pull-request head. Keep branch history when the atomic commits are useful for review; do not require squash merging for this audit branch.

Recommended protection options:

- Require conversation resolution before merging.
- Require the branch to be up to date before merging when appropriate for the repository workflow policy.
- Prevent force pushes to `main`.
- Prevent branch deletion for `main`.
- Apply protections to administrators when practical.

## Repository security

Enable Dependabot alerts and security updates. Keep CodeQL/default code scanning enabled. Enable secret scanning/push protection where the repository/account supports it. Repository source checks supplement platform scanning; they do not replace it.

## Discussions

Enable GitHub Discussions if you want a public place for roadmap ideas, usage questions, and non-security support. Undisclosed security issues should follow `SECURITY.md` instead of Discussions or public issues.

## Release settings

Only create a release tag after the final merged `main` commit is green. The release workflow requires a tag matching `v${package.json version}`, reruns verification/audit, publishes `gradecraft-pwa.zip`, and publishes `gradecraft-pwa.zip.sha256`. Verify the checksum before redistribution.
