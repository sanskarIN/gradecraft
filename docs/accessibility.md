# Accessibility

GradeCraft targets WCAG-oriented accessibility practices across desktop, tablet, mobile browser, and native WebView use.

## Implemented baseline

- Semantic headings, forms, fieldsets, tables, navigation, sections, and landmarks.
- Visible keyboard focus indicators and a skip-to-content link.
- Minimum 44px primary interactive-control height.
- Native `dialog` semantics for focused create/edit workflows.
- Every reusable modal is explicitly named by its visible heading through `aria-labelledby`.
- Modal close controls receive the active locale's accessible label instead of a hardcoded English-only name.
- Controlled modal closing routes button/Escape cancellation through one close callback path to avoid duplicate close handling.
- Text labels and numerical values in addition to chart/color encoding.
- Score-trend and category-contribution charts localize their screen-reader names, empty states, category fallback text, and contribution summaries in English/Hindi.
- Reduced-motion preference and a compact-layout preference.
- Responsive, zoom-friendly layout with horizontal table scrolling where needed.
- Screen-reader labels for action-only or context-sensitive controls.
- Status regions for offline state, delete/undo feedback, import/restore results, and recovery states.
- Document `lang` synchronization for the selected English/Hindi interface.
- User-facing error recovery that avoids exposing raw exception details.

## Localization checks

Accessibility review must be repeated in both English and Hindi because translated copy changes control widths, line wrapping, reading language, navigation density, and accessible control names.

Verify at minimum:

- the language selector itself remains keyboard reachable;
- `html[lang]` changes to `en` or `hi` immediately and after reload;
- translated labels remain associated with their inputs;
- modal dialogs expose their translated heading as the dialog name and their close control uses the current locale;
- chart accessible names, empty-state messages, and text summaries use the current locale;
- no translated button text is clipped at narrow widths or 200% zoom;
- mixed technical terms such as GPA, CSV, JSON, and GradeCraft remain understandable in context.

## Dialog checks

Create/edit dialogs use the platform `dialog` element. For every release, verify keyboard focus enters the opened dialog, the dialog can be dismissed with its close control and Escape/cancel behavior, focus returns to a sensible location, and screen readers announce the visible dialog heading as its name. Regression coverage protects heading-based naming and the controlled close callback, but browser/native assistive-technology smoke testing remains required.

## Data portability checks

CSV mapping and encrypted-backup flows contain dense forms and must be keyboard-tested end to end. Required/optional mapping state must not depend only on color. Passphrase mismatch feedback must be announced/readable without exposing the actual passphrase.

## Charts

Charts are supplementary visualizations. Course/GPA values and assignment data remain available as text/tables; users should not need to distinguish chart colors to determine their grade. Chart copy is resolved from the active English/Hindi locale, and decorative bar geometry is hidden from assistive technologies where the same value is already represented by text.

## Manual audit cadence

Before each release, repeat keyboard navigation, 200% zoom, light/dark contrast, reduced-motion, screen-reader smoke tests, onboarding, course editing, assignment editing, dialog opening/closing, chart announcements, weighted what-if planning, GPA, Settings/language switching, CSV mapping, encrypted backup controls, and destructive-action confirmations.

Automated accessibility tooling can detect many regressions but does not replace real assistive-technology testing.
