# Accessibility

GradeCraft targets WCAG-oriented accessibility practices.

Implemented baseline:

- Semantic headings, forms, tables, navigation, and landmarks
- Visible keyboard focus indicators
- Skip-to-content link
- Primary navigation exposes the active destination with `aria-current="page"` and a non-color-only visual state
- Minimum 44px primary control height
- Native `dialog` semantics with explicit accessible names
- Modal form content is unmounted after closing so cancelled drafts do not leak into a later editing session
- Modal close restores focus to the connected control that opened the dialog
- First-run onboarding moves focus into the dialog and marks background controls inert until onboarding closes
- Text labels in addition to chart/color encoding
- Reduced-motion preference
- Responsive zoom-friendly layout
- Screen-reader labels for icon/action-only controls
- Status regions for offline and import/restore feedback
- Data-transfer regions expose `aria-busy` while file work is active and overlapping transfers are disabled
- An assertive alert when browser storage cannot persist local changes

Periodic audits with browser accessibility tooling and real assistive technology should be repeated as the UI evolves. Before a release, manually verify keyboard-only use, 200% zoom, reduced motion, both themes, screen-reader announcements, current-page navigation, transfer busy states, focus return after dialogs, and onboarding background isolation.
