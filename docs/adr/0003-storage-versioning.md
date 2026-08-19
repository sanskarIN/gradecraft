# ADR 0003: Versioned Local Storage with recovery copy

- Status: Accepted
- Date: 2026-08-19

## Context

Offline-first persistence must tolerate malformed or partially replaced browser data without silently mixing schemas.

## Decision

Namespace storage by schema version, validate parsed records, and preserve the previous primary serialization as a recovery record before each write.

## Consequences

Small datasets are simple to inspect/export and recover. Local Storage capacity remains a practical upper bound; future larger datasets may justify IndexedDB behind the same repository boundary.
