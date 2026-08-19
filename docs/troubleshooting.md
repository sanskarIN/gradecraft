# Troubleshooting

## Changes do not appear

Reload the page. On a deployed PWA, browser developer tools can unregister an old service worker if a stale cache survives a deployment.

## Grade is blank

A course needs at least one graded assignment with a positive maximum score. In weighted mode, categories without graded assignments are excluded from the current-grade normalization.

## Cannot save weighted course

Category weights must total 100% within 0.01 tolerance.

## Import failed

GradeCraft accepts CSV with `category`, `assignment`, `score`, and `maxScore` headers. Backups must be GradeCraft JSON backup envelopes. Files larger than 5 MB are rejected in the UI.

## Lost browser data

If Local Storage was manually cleared, only an exported backup can restore it. GradeCraft keeps one internal recovery copy for malformed/partial primary writes, but that recovery record is also removed by the explicit delete-all action.
