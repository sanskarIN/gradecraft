# GitHub Repository Settings Guidance

These settings cannot be fully represented as source files, but they should be enabled for the public repository.

## Default branch protection

For `main`:

- Require a pull request before merging for collaborative changes.
- Require CI and CodeQL status checks before merge.
- Require branches to be up to date before merge when practical.
- Block force pushes and branch deletion.
- Require conversation resolution.
- Prefer squash or rebase for focused history; preserve meaningful release merge commits only when useful.

## Discussions

Enable GitHub Discussions for usage questions, ideas, and community help. Security disclosures must use the private process in `SECURITY.md`, not Discussions.

Suggested categories: Announcements, Q&A, Ideas, Show and tell.

## Labels

Suggested labels: `bug`, `enhancement`, `documentation`, `accessibility`, `security`, `performance`, `testing`, `good first issue`, `help wanted`, `blocked`, `release`.

## Milestones

Use version-oriented milestones such as `1.0`, `1.1`, and `2.0` rather than artificial date milestones. Keep roadmap items synchronized with `ROADMAP.md`.

## Security features

Enable GitHub dependency graph, Dependabot alerts, secret scanning/push protection where available, and private vulnerability reporting.
