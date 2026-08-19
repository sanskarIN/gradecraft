# ADR 0001: Client-only PWA architecture

- Status: Accepted
- Date: 2026-08-19

## Context

GradeCraft's core use case is grade calculation with privacy-first local storage and offline course profiles. A mandatory backend would add account, network, security, and operational complexity without improving the baseline workflow.

## Decision

Use a React/TypeScript client-only PWA. Persist core user data locally, provide explicit portable backups, and keep cloud sync out of the mandatory architecture.

## Consequences

Core use works offline after assets are cached and no account is required. Users are responsible for exported backup storage. Cross-device sync is not automatic.
