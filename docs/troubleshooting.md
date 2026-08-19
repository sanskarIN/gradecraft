# Troubleshooting

## Changes do not appear

Reload the page. On a deployed PWA, inspect Application → Service Workers/Cache Storage. GradeCraft navigation is network-first with an offline cached shell; stale GradeCraft-prefixed caches should be removed when a newer worker activates.

## Grade is blank

A course needs at least one graded assignment with a positive maximum score. In weighted mode, categories without graded assignments are excluded from the current-grade normalization.

## Cannot save weighted course

Category weights must total 100% within 0.01 tolerance. Category names must also remain unique after trimming, case folding, and Unicode compatibility normalization.

## Cannot save or delete a grading profile

Profile names must be unique after normalized comparison. A profile cannot be deleted while any course references it, and GradeCraft always keeps at least one grading profile.

## Import failed

GradeCraft accepts CSV with `category`, `assignment`, `score`, and `maxScore` headers. `categoryWeight` and `dueDate` are optional. Duplicate headers, malformed dates/scores, oversized text, more than 10,000 assignment rows, and explicit weights that conflict with an existing category are rejected. Backups must be GradeCraft JSON backup envelopes whose persisted identifiers, references, timestamps, scales, and other domain invariants validate. Files larger than 5 MB are rejected in the UI.

## Browser says changes cannot be saved

The browser denied or failed a Local Storage write. Export any data you still need from the current in-memory session, then check private-browsing/storage settings, browser policy, quota, extensions, and available device storage. Do not assume a reload will preserve changes while the persistence warning is visible.

## Lost browser data

If Local Storage was manually cleared, only an exported backup can restore it. GradeCraft keeps one internal recovery copy for malformed/partial primary writes, but that recovery record is also removed by the explicit delete-all action.
