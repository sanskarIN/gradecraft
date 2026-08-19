# Setup

## Requirements

- Node.js 20.19 or later. A current supported Node.js 22 release is recommended for development and CI parity.
- npm
- Git
- A modern evergreen browser

No API keys, database, account, cloud-provider credentials, or production secrets are required for core GradeCraft development.

## Install

```bash
git clone https://github.com/sanskarIN/gradecraft.git
cd gradecraft
npm install
npm run dev
```

Vite prints the local development URL. Open that URL in the browser; development mode does not register the production service worker.

## First verification

Run the repository quality gate after installation:

```bash
npm run verify
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

`.env.example` documents deployment-only placeholders. Never commit `.env` files, access tokens, provider credentials, real student data, exported backups, or backup passphrases.

GradeCraft currently has no required runtime secret. If a future deployment introduces configuration, keep non-secret public build configuration separate from credentials.

## PWA verification

Service-worker registration is enabled only in production builds.

```bash
npm run build
npm run preview
```

Then inspect the browser's Application/Storage tools for the manifest, service worker, cache storage, Local Storage, and offline behavior.

## Optional data-portability verification

Use sample data only:

1. Create a course and assignment.
2. Export/restore a JSON backup.
3. Export/import CSV, including the header-mapping screen.
4. Create an encrypted backup with a test passphrase.
5. Confirm the correct passphrase restores it and an incorrect passphrase is rejected.

Do not use real student data in development fixtures or screenshots.
