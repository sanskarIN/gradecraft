# ADR 0006 — Stage CSV column mapping before mutation

## Status

Accepted — 2026-08-19

## Context

Third-party grade exports use inconsistent column names. Requiring GradeCraft's exact CSV headers is safe but inconvenient; automatically guessing and immediately importing arbitrary columns risks corrupting local course data when a guess is wrong.

## Decision

Separate CSV ingestion into three steps:

1. Parse the selected file and detect header names.
2. Suggest semantic mappings using conservative aliases and let the user review/change them.
3. Import only after all required mappings exist and normal row/category validation succeeds.

Required semantic fields are category, assignment name, score, and maximum score. Category weight and due date are optional.

The selected CSV text and mapping state remain transient UI state until confirmation. No course mutation happens during header detection or mapping edits.

## Consequences

### Positive

- Supports common third-party spreadsheets without weakening validation.
- Keeps automatic detection advisory rather than authoritative.
- Prevents accidental partial mutation while the user is still mapping columns.
- Mapping behavior can be unit-tested independently from the UI.

### Trade-offs

- Imports require an extra confirmation step.
- Ambiguous spreadsheets may still require manual mapping.
- The current mapping model handles semantic column selection, not arbitrary computed transforms or multi-row header layouts.

## Rejected alternatives

- Import immediately from guessed aliases: rejected because a wrong guess could mutate grades without review.
- Accept any numeric columns heuristically: rejected because score/max/category semantics cannot be inferred reliably from values alone.
- Require only GradeCraft-native headers forever: rejected because it unnecessarily limits interoperability.
