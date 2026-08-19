# Setup

## Requirements

- Node.js 20.19 or later
- npm
- Git
- A modern browser

## Install

```bash
git clone https://github.com/sanskarIN/gradecraft.git
cd gradecraft
npm install
npm run dev
```

No API keys or production credentials are required.

## Environment

`.env.example` documents deployment-only placeholders. Never commit `.env` files or real secrets.

## PWA verification

Service-worker registration is enabled only in production builds.

```bash
npm run build
npm run preview
```

Then inspect Application → Manifest/Service Workers in browser developer tools.
