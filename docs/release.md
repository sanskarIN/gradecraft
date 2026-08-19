# Release Process

1. Update version in `package.json`.
2. Update `CHANGELOG.md`, `ROADMAP.md`, and `what_changed.md`.
3. Run `npm install`.
4. Run `npm run verify`.
5. Install Playwright Chromium where needed.
6. Run `npm run test:e2e`.
7. Inspect `npm audit --audit-level=high`.
8. Build from a clean checkout.
9. Confirm no secrets or private student data are tracked.
10. Tag `vX.Y.Z` and push the tag.
11. The release workflow builds the PWA and attaches a zip to the GitHub release.
12. Smoke-test the hosted/static deployment and PWA install/offline behavior.

Release notes must not claim checks that were not actually run.
