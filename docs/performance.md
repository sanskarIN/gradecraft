# Performance

GradeCraft is intentionally client-only and dependency-light.

## Budgets

- Investigate any single release increase above 20% in compressed application JS/CSS.
- Initial routes must not depend on remote APIs after static assets load.
- Grade recalculation should remain effectively instant for ordinary course sizes.

## Practices

- Pure calculation functions avoid network/storage reads.
- Charts use native SVG instead of a charting dependency.
- Service worker caches static application assets.
- No polling or background analytics.
- Dashboard search uses memoized in-memory filtering.

Current weighted aggregation is straightforward and suitable for normal student datasets. If datasets grow into thousands of assignments, profile before replacing it with indexed one-pass grouping.
