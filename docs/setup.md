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

`.env.example` documents deployment-only configuration. Never commit `.env` files or real secrets.

`VITE_BASE_PATH` controls the production asset base. Keep `/` for a root deployment. For a repository subpath, set a trailing-slash value such as `/gradecraft/` before building.

```bash
VITE_BASE_PATH=/gradecraft/ npm run build
```

On Windows PowerShell, set the variable for the session first:

```powershell
$env:VITE_BASE_PATH = "/gradecraft/"
npm run build
```

## PWA verification

Service-worker registration is enabled only in production builds and follows the configured Vite base path.

```bash
npm run build
npm run preview
```

Then inspect Application → Manifest/Service Workers in browser developer tools. Verify one online navigation, reload after an application update, then test a subsequent offline navigation.
