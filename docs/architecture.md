# Architecture

GradeCraft is a modular client-side monolith. No backend is required for core use.

## Layers

1. **Domain (`src/domain`)** — deterministic models and grade/GPA/what-if rules. No React or browser-storage dependencies.
2. **Data (`src/data`)** — Local Storage persistence, backup envelopes, CSV parsing/serialization, and redacted structured logging.
3. **State (`src/state`)** — reducer/context wiring domain data to the application.
4. **UI (`src/components`, `src/pages`)** — reusable components and page workflows.
5. **Platform (`public/sw.js`)** — offline cache shell and PWA manifest.

Dependency flow points inward: pages depend on components/state/domain; domain does not depend on UI.

## Persistence

Schema version `1` is stored under a namespaced Local Storage key. Each save preserves the previous serialized record as a recovery copy before replacing the primary record. Invalid/corrupt data falls back to recovery and then a clean default dataset.

## Routing

A small hash router avoids requiring server rewrite configuration for static PWA hosts.

## Security boundaries

CSV, JSON backup files, and Local Storage contents are untrusted. Parsers validate types/ranges before data is incorporated. No dynamic HTML injection is used. React escapes rendered strings by default.

## Internationalization

The initial string catalog lives in `src/i18n/en.ts`. Remaining page strings are intentionally English-first and can migrate into the catalog as localization expands.
