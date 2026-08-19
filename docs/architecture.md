# Architecture

GradeCraft is a modular client-side monolith. No backend is required for core use.

## Layers

1. **Domain (`src/domain`)** — deterministic models and grade/GPA/what-if rules plus shared input/date/identity validation. No React or browser-storage dependencies.
2. **Data (`src/data`)** — Local Storage persistence, backup envelopes, CSV parsing/serialization, schema restoration, migrations, and redacted structured logging.
3. **Errors (`src/errors`)** — centralized expected user-facing error types and safe fallback selection so raw unexpected exception text is not surfaced in UI notices.
4. **State (`src/state`)** — reducer/context wiring validated domain data to the application while preserving reference-sensitive operations such as grading-profile deletion.
5. **UI (`src/components`, `src/pages`)** — reusable accessible components and page workflows.
6. **Internationalization (`src/i18n`)** — English product, system, Settings-management, and data-transfer message catalogs prepared for later locale packs.
7. **Platform (`public/sw.js`, `public/manifest.webmanifest`)** — offline cache shell, scoped service worker, portable PWA metadata, and install icons.
8. **Verification (`tests`, `e2e`, `benchmarks`, `scripts`)** — domain/data/component/browser regressions, deterministic performance harnesses, secret checks, documentation links, and release-version consistency.

Dependency flow points inward: pages depend on components/state/domain; domain does not depend on UI. Untrusted restore/import data must cross validation before entering application state.

## Persistence

Schema version `1` is stored under a namespaced Local Storage key. Each normal save preserves the previous valid serialized record as a recovery copy before replacing the primary record. Invalid/corrupt data falls back to recovery and then a clean default dataset. Recovery also repairs a corrupt primary copy when storage remains writable. Explicit local deletion intentionally skips the immediate default-state persistence cycle so the storage keys remain cleared after the delete operation.

Persisted course/assignment timestamps must be canonical ISO strings produced by `Date#toISOString`. Course/category/assignment/scale identifiers and references are validated, grading profiles must remain uniquely named after Unicode compatibility normalization, and course colors are restricted to safe hex values.

## Routing

A small hash router avoids requiring server rewrite configuration for static PWA hosts. Route-level pages recover safely when a previously referenced course no longer exists.

## Security boundaries

CSV, JSON backup files, and Local Storage contents are untrusted. Parsers validate types, sizes, row counts, identifiers, references, dates, weights, ranges, and bounded text before data is incorporated. Exported spreadsheet text is formula-hardened. Structured logs redact sensitive keys and credential/email-like string values. No dynamic HTML injection is used; React escapes rendered strings by default. Static browser metadata also constrains scripts/workers/resources with a client-side CSP and disables referrer disclosure.

## Internationalization and identity comparison

User-visible English text is externalized under `src/i18n`. Identity comparisons for category names, grade labels, and grading-profile names use Unicode NFKC compatibility normalization plus trimming and stable case folding; the original trimmed display text is retained for presentation.
