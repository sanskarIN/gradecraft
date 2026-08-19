# Accessibility

GradeCraft targets WCAG-oriented accessibility practices across desktop, tablet, and mobile browser use.

## Implemented baseline

- Semantic headings, forms, fieldsets, tables, navigation, sections, and landmarks.
- Visible keyboard focus indicators and a skip-to-content link.
- Minimum 44px primary interactive-control height.
- Native `dialog` semantics for focused create/edit workflows.
- Text labels and numerical values in addition to chart/color encoding.
- Reduced-motion preference and a compact-layout preference.
- Responsive, zoom-friendly layout with horizontal table scrolling where needed.
- Screen-reader labels for action-only or context-sensitive controls.
- Status regions for offline state, delete/undo feedback, import/restore results, and recovery states.
- Document `lang` synchronization for the selected English/Hindi interface.
- User-facing error recovery that avoids exposing raw exception details.

## Localization checks

Accessibility review must be repeated in both English and Hindi because translated copy changes control widths, line wrapping, reading language, and navigation density.

Verify at minimum:

- the language selector itself remains keyboard reachable;
- `html[lang]` changes to `en` or `hi` immediately and after reload;
- translated labels remain associated with their inputs;
- no translated button text is clipped at narrow widths or 200% zoom;
- mixed technical terms such as GPA, CSV, JSON, and GradeCraft remain understandable in context.

## Data portability checks

CSV mapping and encrypted-backup flows contain dense forms and must be keyboard-tested end to end. Required/optional mapping state must not depend only on color. Passphrase mismatch feedback must be announced/readable without exposing the actual passphrase.

## Charts

Charts are supplementary visualizations. Course/GPA values and assignment data remain available as text/tables; users should not need to distinguish chart colors to determine their grade.

## Manual audit cadence

Before each release, repeat keyboard navigation, 200% zoom, light/dark contrast, reduced-motion, screen-reader smoke tests, onboarding, course editing, assignment editing, weighted what-if planning, GPA, Settings/language switching, CSV mapping, encrypted backup controls, and destructive-action confirmations.

Automated accessibility tooling can detect many regressions but does not replace real assistive-technology testing.
