# Release Process

1. Update version in `package.json`.
2. Update `CHANGELOG.md`, `ROADMAP.md`, and `what_changed.md`.
3. Run `npm install` (switch this documentation and workflows to `npm ci` once the repository has a verified committed `package-lock.json`).
4. Run `npm run verify`; this includes typecheck, lint, deterministic formatting, repository-relative documentation links, release-version consistency, secret-pattern scanning, unit/integration/component tests with coverage, and the production build.
5. Run `npm run bench` on the same reference machine/runtime used for the previous release when checking calculation-performance regressions.
6. Install Playwright Chromium where needed.
7. Run `npm run test:e2e` and retain failure diagnostics if any browser test fails.
8. Inspect `npm audit --audit-level=high`.
9. Build from a clean checkout.
10. Confirm no secrets or private student data are tracked and review the static CSP/referrer policy.
11. Choose the deployment base path. Keep `VITE_BASE_PATH=/` for root hosting, or use a trailing-slash subpath such as `/gradecraft/` for repository-subpath hosting.
12. Preview the exact production build and verify manifest, both any/maskable icons, service worker, update behavior, and offline fallback.
13. In a clean browser context, load the production build once, wait for the service worker to claim the page, disable the network, and reload. The application shell and built JS/CSS must still load from the install-time cache.
14. Restore the network, confirm an updated deployment replaces the cached navigation shell, and verify stale GradeCraft-owned caches are removed after activation without touching unrelated same-origin caches.
15. Complete manual keyboard, focus-restoration, 200%-zoom, reduced-motion, light/dark contrast, and screen-reader smoke checks.
16. Capture real screenshots only from the verified release candidate and place them under `docs/screenshots/` before referencing them as release evidence.
17. Tag `vX.Y.Z` and push the tag only after the release-candidate checks are green. The tag must exactly match the `package.json` version as `vX.Y.Z`.
18. The release workflow runs the full verification and high-severity dependency audit, packages the root-hosted PWA as `gradecraft-pwa.zip`, generates `gradecraft-pwa.zip.sha256`, and publishes both files with GitHub's authenticated `gh` CLI.
19. Verify the published archive against the published SHA-256 file before distributing or mirroring it, for example with `sha256sum -c gradecraft-pwa.zip.sha256` on a compatible system.
20. Smoke-test the hosted/static deployment and PWA install/offline behavior.

For a subpath artifact, build separately with the deployment value set before `npm run build` and publish that `dist/` output to the matching subpath.

Release notes must not claim checks that were not actually run. A queued, pending, cancelled, skipped, unavailable, or uninspected workflow is not passing evidence.
