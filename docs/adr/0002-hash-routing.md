# ADR 0002: Hash routing for static-host portability

- Status: Accepted
- Date: 2026-08-19

## Context

GradeCraft should deploy to simple static hosting without requiring every host to configure SPA fallback rewrites.

## Decision

Use a small hash-based router rather than a server-dependent history router.

## Consequences

URLs contain `#`, but direct links work reliably on static hosts and the dependency surface stays small.
