# Release Process

1. Update version in `package.json`.
2. Update `CHANGELOG.md`, `ROADMAP.md`, and `what_changed.md`.
3. Run `npm install` (switch this documentation and workflows to `npm ci` once the repository has a verified committed `package-lock.json`).
4. Run `npm run verify`.
5. Install Playwright Chromium where needed.
6. Run `npm run test:e2e`.
7. Inspect `npm audit --audit-level=high`.
8. Build from a clean checkout.
9. Confirm no secrets or private student data are tracked.
10. Choose the deployment base path. Keep `VITE_BASE_PATH=/` for root hosting, or use a trailing-slash subpath such as `/gradecraft/` for repository-subpath hosting.
11. Preview the exact production build and verify manifest, service worker, update behavior, and offline fallback.
12. In a clean browser context, load the production build once, wait for the service worker to claim the page, disable the network, and reload. The application shell and built JS/CSS must still load from the install-time cache.
13. Restore the network, confirm an updated deployment replaces the cached navigation shell, and verify stale caches are removed after activation.
14. Tag `vX.Y.Z` and push the tag only after the release-candidate checks are green.
15. The release workflow builds the root-hosted PWA and attaches a zip to the GitHub release.
16. Smoke-test the hosted/static deployment and PWA install/offline behavior.

For a subpath artifact, build separately with the deployment value set before `npm run build` and publish that `dist/` output to the matching subpath.

Release notes must not claim checks that were not actually run. A queued, pending, cancelled, or unavailable workflow is not passing evidence.
