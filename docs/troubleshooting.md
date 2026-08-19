# Troubleshooting

## Changes do not appear

Reload the page. On a deployed PWA, browser developer tools can unregister an old service worker if a stale cache survives a deployment. For release verification, test the production build and confirm the service-worker scope matches the deployment path.

## Grade is blank

A course needs at least one graded assignment with a positive maximum score. In weighted mode, categories without graded assignments are excluded from the current-grade normalization.

## Cannot save weighted course

Category weights must total 100% within 0.01 tolerance. Empty category names and invalid weight ranges are also rejected.

## Weighted target score looks impossible

The target planner can return a required score above the future assignment's maximum. That is an intentional indication that the selected target cannot be reached with only that future assignment under the current weighted-category state.

For weighted courses, verify that the future assignment is assigned to the intended category and that category weights match the syllabus.

## CSV import failed

GradeCraft no longer requires third-party files to use its exact header names. After selecting a CSV, review the detected mapping screen and map these required semantic fields:

- Category
- Assignment name
- Score
- Maximum score

Category weight and due date are optional mappings. Common names such as `Group`, `Task`, `Marks`, `Total`, and `Due Date` are suggested automatically when detected.

The import still fails if scores are invalid, mapped columns are missing, weighted categories become inconsistent, quoted CSV syntax is malformed, or the file exceeds the UI size limit.

## Standard backup restore failed

The file must be a supported GradeCraft JSON backup envelope containing a valid application schema. A plain arbitrary JSON file cannot be restored as a GradeCraft backup.

## Encrypted backup cannot be restored

Check all of the following:

- The selected file is a GradeCraft encrypted backup, not a standard backup or CSV.
- The passphrase is exactly the same as the one used during export.
- The encrypted file was not truncated or modified.
- The file is within the encrypted-backup UI size limit.

GradeCraft intentionally has no recovery key. If the passphrase is lost, the encrypted backup cannot be decrypted by the project.

## Hindi selection did not persist

Change the language from Settings and confirm browser Local Storage is available for the site. Private-browsing policies, storage clearing, or aggressive browser cleanup can remove persisted preferences. The page's `<html lang>` value should switch between `en` and `hi` with the selected language.

## Lost browser data

If Local Storage was manually cleared, only an exported backup can restore it. GradeCraft keeps one internal recovery copy for malformed/partial primary writes, but that recovery record is also removed by the explicit delete-all action.

Downloaded backups, files stored with a third-party provider, synced browser profiles, and operating-system backups are outside GradeCraft's control.

## `npm run verify` fails on documentation links

Run:

```bash
npm run docs:links
```

The checker validates local Markdown targets only. Fix moved/renamed relative files rather than disabling the check.

## Playwright browser is missing

Install Chromium for Playwright:

```bash
npx playwright install chromium
```

In Linux CI/container environments that need system packages:

```bash
npx playwright install --with-deps chromium
```

Then rerun `npm run test:e2e`.
