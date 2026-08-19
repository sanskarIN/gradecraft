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

## Benchmark harness

`benchmarks/gradeMath.bench.ts` exercises point-based and weighted grade calculation with deterministic 10,000-assignment course fixtures. Run it with:

```bash
npm run bench
```

Treat benchmark output as environment-specific evidence, not a universal timing guarantee. Compare results on the same machine/runtime when investigating a regression, and profile before changing algorithms. Do not put fragile wall-clock thresholds in the normal correctness test suite.

Current weighted aggregation is straightforward and suitable for normal student datasets. If datasets grow into thousands of assignments, use the benchmark and a profiler before replacing it with indexed one-pass grouping.
