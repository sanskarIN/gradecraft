# GradeCraft Screenshots

This directory is reserved for real screenshots captured from a verified production build. Do not add generated, mocked, or manually fabricated screenshots that imply unverified behavior.

## Automated candidate capture

`e2e/publication-screenshots.spec.ts` captures deterministic screenshots from the same production web UI exercised by Playwright. The normal E2E workflow uploads them only after the Chromium E2E job succeeds, using an artifact named `publication-screenshots-<commit-sha>`.

The tag-release workflow also uploads `release-screenshots-<tag>-<commit-sha>` after the release E2E gate succeeds against the already-built `dist/` output. Each artifact includes `EVIDENCE.txt` with the exact commit and workflow-run identifiers; tagged evidence also records the tag.

These artifacts are **candidates**, not automatically published screenshots. Before copying images into this directory:

1. Confirm the workflow completed successfully for the exact commit or tag being released.
2. Review `EVIDENCE.txt` and the GitHub Actions run.
3. Visually inspect every screenshot for rendering errors, clipped content, stale text, private data, or misleading state.
4. Copy only reviewed images from that positively verified run into `docs/screenshots/`.
5. Keep platform-specific store screenshots tied to a real verified build of that native target; browser screenshots are not proof that a Windows, macOS, Linux, Android, or iOS package was built.

## Expected capture set

The automated browser evidence produces:

1. Onboarding
2. Course dashboard
3. Course detail with representative grade data
4. What-if planner
5. GPA view
6. Settings in light theme
7. Settings in dark theme
8. Import/export view

Native store/publication captures can be added separately after their target-specific package and smoke-test evidence is green.
