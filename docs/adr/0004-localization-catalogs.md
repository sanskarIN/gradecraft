# ADR 0004 — Typed local localization catalogs

## Status

Accepted — 2026-08-19

## Context

GradeCraft began with English-first copy but needs additional languages without adding a backend, account system, runtime translation service, or network dependency. The active locale must persist locally and accessibility tooling must receive the correct document language.

## Decision

Use local TypeScript message catalogs.

- `src/i18n/en.ts` is the source English catalog.
- `src/i18n/hi.ts` provides the Hindi catalog and must satisfy the same typed message shape.
- `Settings.language` is an optional schema-v1 field so older valid v1 data remains compatible.
- Missing language preference falls back to English.
- The active catalog is selected locally at runtime.
- The document `lang` attribute follows the selected locale.
- No translation catalog is downloaded from a remote service.

Specialized workflows may use smaller locale-aware modules when that keeps the primary catalog maintainable, but new user-visible copy should not silently become English-only.

## Consequences

### Positive

- Offline behavior remains complete.
- No grade/context data is sent to a translation provider.
- Catalog parity can be type-tested and unit-tested.
- Locale changes can apply immediately without navigation or reload.
- Screen readers receive a matching document language.

### Trade-offs

- Every shipped locale is part of the application bundle.
- Human translation quality requires review; type safety verifies shape, not linguistic correctness.
- Validation/domain error localization may require structured error codes rather than free-form English messages as localization expands.

## Rejected alternatives

- Runtime machine-translation API: rejected because it adds network/privacy/reliability dependencies.
- Server-rendered locale routing: rejected because GradeCraft has no required backend and uses static hash routing.
- Browser-only automatic translation: rejected as an application architecture because it is outside GradeCraft's control and cannot guarantee consistent UI semantics.
