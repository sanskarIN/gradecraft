# ADR 0009: Harden the native webview boundary

- **Status:** Accepted
- **Date:** 2026-08-20
- **Applies to:** GradeCraft 2.0.12 and later native builds

## Context

GradeCraft uses a shared React frontend inside Tauri 2 for Windows, macOS, Linux, Android, and iOS/iPadOS. The frontend is intentionally local-first and does not need remote application scripts, remote frames, or a GradeCraft backend.

A packaged webview is still a privileged application surface because the local frontend can invoke Tauri APIs granted by capability files. A frontend injection bug therefore has a different impact from the same bug in a normal website: it can potentially reach native commands that the active capability permits.

Tauri can inject a Content Security Policy into packaged HTML and can freeze `Object.prototype` for pages served through its custom protocol. These controls are most useful when enabled explicitly and kept release-critical.

## Decision

GradeCraft native builds use all of the following controls:

1. **A restrictive CSP is mandatory.**
   - Application content defaults to `'self'`.
   - Network-style connections are limited to Tauri IPC (`ipc:` and `http://ipc.localhost`).
   - Images may use local, `data:`, and `blob:` sources required by normal local UI behavior.
   - Styles remain local; inline style support is allowed for compatibility with UI rendering while scripts remain constrained by Tauri's generated CSP hashes/nonces.
   - Objects and frames are disabled.
   - Base URL changes and off-origin form submission are blocked.
   - Framing the application is blocked.

2. **`Object.prototype` is frozen in packaged custom-protocol pages.**
   This reduces the opportunity for prototype-pollution-style manipulation of shared JavaScript behavior.

3. **Tauri's asset CSP rewriting stays enabled.**
   `dangerousDisableAssetCspModification` must not be enabled.

4. **Native capabilities remain window-scoped and purpose-limited.**
   The `main` window receives only the core default set plus the dialog/file permissions needed for user-selected exports. New native permissions require a documented product need and review.

5. **The release gate enforces this baseline.**
   `npm run release:gate` fails if the CSP disappears, required directives are removed, a wildcard source is introduced, prototype freezing is disabled, or Tauri asset CSP modification is explicitly disabled.

## Consequences

### Positive

- A compromised UI has fewer destinations from which it can load executable or embedded content.
- Native IPC remains available without granting general remote connectivity.
- Security-sensitive configuration cannot be removed accidentally without failing CI/release verification.
- The web and native trust boundaries are documented separately instead of assuming browser controls automatically apply to packaged webviews.

### Trade-offs

- Future features that legitimately need remote images, fonts, network APIs, embedded content, or additional Tauri commands must update both the CSP/capability configuration and the security review documentation.
- The style policy currently permits inline styles for compatibility. If the UI no longer requires that compatibility, this allowance should be reevaluated and narrowed.

## Verification

Run:

```bash
npm run release:gate
npm run native:check
```

For release evidence, also build and smoke-test the applicable native target and verify that native save dialogs and user-selected export writes still function under the enforced CSP.
