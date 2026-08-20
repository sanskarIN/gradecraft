# Setup

## Requirements

### Common requirements

- Node.js 20.19 or later. A current supported Node.js 22 release is recommended for development and CI parity.
- npm
- Git
- A modern evergreen browser for the web/PWA target

### Native requirements

Native desktop/mobile targets additionally require Rust stable plus the operating-system toolchain used by Tauri:

- Windows: Microsoft C++ Build Tools and WebView2.
- macOS: Xcode Command Line Tools for desktop; full Xcode for iOS.
- Linux: WebKitGTK 4.1 and the native development packages listed in [`platforms.md`](platforms.md).
- Android: Android Studio/SDK, Platform-Tools, Build-Tools, NDK, command-line tools, and a Java runtime, with `JAVA_HOME`, `ANDROID_HOME`, and `NDK_HOME` configured.
- iOS/iPadOS: macOS with full Xcode and Apple signing configuration when deploying to devices or distributing builds.

No API keys, database, account, cloud-provider credentials, or production secrets are required for core GradeCraft development.

## Install

```bash
git clone https://github.com/sanskarIN/gradecraft.git
cd gradecraft
npm install
```

## Start the web application

```bash
npm run dev
```

Vite prints the local development URL. Development mode does not register the production service worker.

## Start the native desktop application

After installing the platform-specific Tauri prerequisites:

```bash
npm run native:dev
```

The command generates platform icons from `public/icons/icon.svg`, starts Vite, builds the Rust shell, and launches the desktop application.

## Initialize mobile targets

Android:

```bash
npm run android:init
npm run android:dev
```

iOS/iPadOS on macOS:

```bash
npm run ios:init
npm run ios:dev
```

See [`platforms.md`](platforms.md) for complete prerequisites, physical-device development, APK/AAB commands, iOS build commands, native artifact locations, signing boundaries, and platform-specific troubleshooting.

## First verification

Run the repository quality gate after installation:

```bash
npm run verify
```

For the native Rust/Tauri layer:

```bash
npm run native:check
```

For browser journeys, install Playwright Chromium once for the current environment:

```bash
npx playwright install chromium
npm run test:e2e
```

Linux CI/container environments may instead need:

```bash
npx playwright install --with-deps chromium
```

## Environment files

`.env.example` documents deployment-only placeholders. Never commit `.env` files, access tokens, signing credentials, provider credentials, real student data, exported backups, or backup passphrases.

GradeCraft currently has no required runtime secret. Native store signing credentials belong in the trusted release environment, not source control.

## PWA verification

Service-worker registration is enabled only for production builds served through HTTP/HTTPS. Packaged Tauri builds intentionally skip service-worker registration because their frontend assets are bundled with the native application.

```bash
npm run build
npm run preview
```

Then inspect the browser's Application/Storage tools for the manifest, service worker, cache storage, Local Storage, and offline behavior.

## Native export verification

Use sample data only and run the application with `npm run native:dev`:

1. Create a course and assignment.
2. Export a JSON backup and confirm a native save dialog appears.
3. Export CSV and confirm the selected file is created.
4. Create an encrypted backup with a test passphrase and save it through the native dialog.
5. Restore/import the files and verify the formats remain interoperable with the web build.

## Optional data-portability verification

Use sample data only:

1. Create a course and assignment.
2. Export/restore a JSON backup.
3. Export/import CSV, including the header-mapping screen.
4. Create an encrypted backup with a test passphrase.
5. Confirm the correct passphrase restores it and an incorrect passphrase is rejected.

Do not use real student data in development fixtures or screenshots.
