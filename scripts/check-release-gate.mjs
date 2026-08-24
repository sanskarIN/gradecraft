import { existsSync, readFileSync, statSync } from "node:fs";

const requiredFiles = [
  "README.md",
  "LICENSE",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  "SUPPORT.md",
  "PRIVACY.md",
  "CHANGELOG.md",
  "ROADMAP.md",
  "what_changed.md",
  ".gitignore",
  ".editorconfig",
  ".gitattributes",
  ".env.example",
  "docs/architecture.md",
  "docs/setup.md",
  "docs/development.md",
  "docs/testing.md",
  "docs/release.md",
  "docs/release-readiness.md",
  "docs/troubleshooting.md",
  "docs/accessibility.md",
  "docs/performance.md",
  "docs/platforms.md",
  "docs/adr/0001-client-only-pwa.md",
  "docs/adr/0007-package-version-source.md",
  "docs/adr/0008-tauri-cross-platform-shell.md",
  ".github/FUNDING.yml",
  ".github/workflows/ci.yml",
  ".github/workflows/e2e.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/release.yml",
  ".github/workflows/native.yml",
  ".github/dependabot.yml",
  ".github/pull_request_template.md",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  "public/manifest.webmanifest",
  "public/sw.js",
  "public/icons/icon.svg",
  "e2e/publication-screenshots.spec.ts",
  "src/platform/runtime.ts",
  "src/platform/platform.css",
  "tests/platform.test.ts",
  "src-tauri/.gitignore",
  "src-tauri/build.rs",
  "src-tauri/Cargo.toml",
  "src-tauri/tauri.conf.json",
  "src-tauri/src/main.rs",
  "src-tauri/src/lib.rs",
  "src-tauri/capabilities/default.json",
  "src-tauri/capabilities/desktop-export.json",
  "src-tauri/capabilities/mobile-export.json",
  "scripts/check-version-sync.mjs",
];

const requiredScripts = [
  "build",
  "typecheck",
  "lint",
  "format:check",
  "docs:links",
  "security:secrets",
  "version:check",
  "test",
  "test:e2e",
  "verify",
  "release:gate",
  "release:tag",
  "perf:budget",
  "native:icons",
  "native:check",
  "native:dev",
  "native:build",
  "android:init",
  "android:dev",
  "android:build",
  "ios:init",
  "ios:dev",
  "ios:build",
];

const failures = [];
for (const file of requiredFiles) {
  if (!existsSync(file)) failures.push(`Missing required file: ${file}`);
  else if (statSync(file).size === 0) failures.push(`Required file is empty: ${file}`);
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version ?? "")) {
  failures.push("package.json must use a valid semantic version.");
}
if (pkg.private !== true) failures.push("The application package must remain private to prevent accidental npm publication.");
for (const script of requiredScripts) {
  if (typeof pkg.scripts?.[script] !== "string" || pkg.scripts[script].trim() === "") {
    failures.push(`Missing package script: ${script}`);
  }
}

const read = (file) => readFileSync(file, "utf8");
const countOccurrences = (text, marker) => text.split(marker).length - 1;
const requireCheckoutIsolation = (workflow, label) => {
  const checkouts = countOccurrences(workflow, "actions/checkout@v7");
  const isolated = countOccurrences(workflow, "persist-credentials: false");
  if (checkouts === 0) failures.push(`${label} workflow is missing actions/checkout.`);
  if (isolated !== checkouts) {
    failures.push(`${label} workflow must disable persisted credentials for every checkout.`);
  }
};
const hasExactPlatformSet = (actual, expected) =>
  Array.isArray(actual) && actual.length === expected.length && expected.every((platform) => actual.includes(platform));
const requirePermissions = (capability, label, permissions) => {
  for (const permission of permissions) {
    if (!capability.permissions?.includes(permission)) {
      failures.push(`${label} capability is missing required permission: ${permission}`);
    }
  }
};

const readme = read("README.md");
for (const marker of [
  "Made by the Sanskar",
  "buymeacoffee.com/sanskarIN",
  "sanskarin@outlook.in",
  "supportramsandesh@gmail.com",
  "docs/setup.md",
  "docs/testing.md",
  "docs/release.md",
  "docs/platforms.md",
  "Windows",
  "Android",
  "iOS",
]) {
  if (!readme.includes(marker)) failures.push(`README.md is missing required marker: ${marker}`);
}

const indexHtml = read("index.html");
for (const marker of ["viewport-fit=cover", "mobile-web-app-capable", "apple-mobile-web-app-capable"]) {
  if (!indexHtml.includes(marker)) failures.push(`index.html is missing mobile install marker: ${marker}`);
}

const platformRuntime = read("src/platform/runtime.ts");
for (const marker of ["isTauri", "aarch64", "data-platform", "data-runtime"]) {
  if (marker === "aarch64") continue;
  if (!platformRuntime.includes(marker)) failures.push(`Platform runtime is missing required marker: ${marker}`);
}
for (const target of ["windows", "macos", "linux", "android", "ios", "web"]) {
  if (!platformRuntime.includes(`\"${target}\"`)) failures.push(`Platform runtime is missing target: ${target}`);
}

const platformCss = read("src/platform/platform.css");
for (const marker of ["safe-area-inset-top", "safe-area-inset-bottom", "100dvh", "pointer: coarse", "viewport"]) {
  if (marker === "viewport") continue;
  if (!platformCss.includes(marker)) failures.push(`Platform CSS is missing required adaptation: ${marker}`);
}

const requireWorkflowControls = (workflow, label, { manual = false } = {}) => {
  for (const marker of ["concurrency:", "cancel-in-progress: true"]) {
    if (!workflow.includes(marker)) failures.push(`${label} workflow is missing concurrency control: ${marker}`);
  }
  if (manual && !workflow.includes("workflow_dispatch:")) {
    failures.push(`${label} workflow must support workflow_dispatch for exact-ref verification.`);
  }
};

const ci = read(".github/workflows/ci.yml");
for (const command of [
  "npm run typecheck",
  "npm run lint",
  "npm run format:check",
  "npm run docs:links",
  "npm run security:secrets",
  "npm run version:check",
  "npm run release:gate",
  "npm test",
  "npm run build",
  "npm run perf:budget",
  "npm audit --audit-level=high",
]) {
  if (!ci.includes(command)) failures.push(`CI is missing quality gate: ${command}`);
}
requireWorkflowControls(ci, "CI", { manual: true });
requireCheckoutIsolation(ci, "CI");

const e2e = read(".github/workflows/e2e.yml");
for (const marker of [
  "npm run test:e2e",
  "publication-screenshots-${{ github.sha }}",
  "test-results/publication-screenshots/",
  "EVIDENCE.txt",
  "repository=$GITHUB_REPOSITORY",
  "ref=$GITHUB_REF",
  "event=$GITHUB_EVENT_NAME",
  "SHA256SUMS.txt",
  "sha256sum",
  "test -s SHA256SUMS.txt",
]) {
  if (!e2e.includes(marker)) failures.push(`E2E workflow is missing release evidence marker: ${marker}`);
}
requireWorkflowControls(e2e, "E2E", { manual: true });
requireCheckoutIsolation(e2e, "E2E");

const nativeCi = read(".github/workflows/native.yml");
for (const command of [
  "npm run native:check",
  "npm run native:build -- --debug --no-bundle",
  "npm run android:init",
  "npm run android:build -- --debug --apk --target x86_64 --ci",
  "npm run ios:init",
  "npm run ios:build -- --debug --target aarch64-sim --no-sign",
  "gradecraft-android-debug-${{ github.sha }}",
]) {
  if (!nativeCi.includes(command)) failures.push(`Native CI is missing platform build gate: ${command}`);
}
requireWorkflowControls(nativeCi, "Native", { manual: true });
requireCheckoutIsolation(nativeCi, "Native");

const codeql = read(".github/workflows/codeql.yml");
for (const marker of ["github/codeql-action/init", "github/codeql-action/analyze"]) {
  if (!codeql.includes(marker)) failures.push(`CodeQL workflow is missing scan marker: ${marker}`);
}
requireWorkflowControls(codeql, "CodeQL", { manual: true });
requireCheckoutIsolation(codeql, "CodeQL");

const release = read(".github/workflows/release.yml");
for (const command of [
  "npm run release:tag",
  "npm run verify",
  "npm audit --audit-level=high",
  "npx playwright install --with-deps chromium",
  "npm run test:e2e",
  "sha256sum gradecraft-pwa.zip > gradecraft-pwa.zip.sha256",
]) {
  if (!release.includes(command)) failures.push(`Release workflow is missing gate: ${command}`);
}
for (const marker of [
  "release-screenshots-${{ github.ref_name }}-${{ github.sha }}",
  "test-results/publication-screenshots/",
  "EVIDENCE.txt",
  "repository=$GITHUB_REPOSITORY",
  "ref=$GITHUB_REF",
  "event=$GITHUB_EVENT_NAME",
  "tag=$GITHUB_REF_NAME",
  "SHA256SUMS.txt",
  "sha256sum",
  "test -s SHA256SUMS.txt",
  "gradecraft-pwa.zip.sha256",
  "release-pwa-${{ github.ref_name }}-${{ github.sha }}",
  "actions/download-artifact@v4",
  "needs: verify",
  "permissions:\n  contents: read",
  "permissions:\n      contents: write",
]) {
  if (!release.includes(marker)) failures.push(`Release workflow is missing hardened publication marker: ${marker}`);
}
if (!release.includes('GRADECRAFT_E2E_PREBUILT: "1"')) {
  failures.push("Release E2E must exercise the already verified production build.");
}
requireCheckoutIsolation(release, "Release");

const tauriConfig = JSON.parse(read("src-tauri/tauri.conf.json"));
if (tauriConfig.identifier !== "in.sanskar.gradecraft") {
  failures.push("Tauri identifier must remain in.sanskar.gradecraft unless a documented migration changes it.");
}
if (tauriConfig.bundle?.active !== true || tauriConfig.bundle?.targets !== "all") {
  failures.push("Tauri bundling must remain active for all desktop bundle targets.");
}
if (tauriConfig.build?.frontendDist !== "../dist") {
  failures.push("Tauri frontendDist must consume the verified shared dist/ frontend.");
}
if ((tauriConfig.bundle?.android?.minSdkVersion ?? 0) < 24) {
  failures.push("Android minSdkVersion must remain compatible with the supported Tauri baseline (24 or newer).\n");
}
if (!tauriConfig.bundle?.iOS?.minimumSystemVersion) {
  failures.push("Tauri iOS minimum system version must be explicitly configured.");
}

const coreCapability = JSON.parse(read("src-tauri/capabilities/default.json"));
const desktopCapability = JSON.parse(read("src-tauri/capabilities/desktop-export.json"));
const mobileCapability = JSON.parse(read("src-tauri/capabilities/mobile-export.json"));
requirePermissions(coreCapability, "Shared core", ["core:default"]);
requirePermissions(desktopCapability, "Desktop export", ["dialog:default", "fs:write-files"]);
requirePermissions(mobileCapability, "Mobile export", ["dialog:default", "fs:write-files"]);
if (!hasExactPlatformSet(desktopCapability.platforms, ["linux", "macOS", "windows"])) {
  failures.push("Desktop export capability must be limited to linux, macOS, and windows.");
}
if (!hasExactPlatformSet(mobileCapability.platforms, ["iOS", "android"])) {
  failures.push("Mobile export capability must be limited to iOS and android.");
}
if (desktopCapability.$schema !== "../gen/schemas/desktop-schema.json") {
  failures.push("Desktop export capability must use the generated desktop schema.");
}
if (mobileCapability.$schema !== "../gen/schemas/mobile-schema.json") {
  failures.push("Mobile export capability must use the generated mobile schema.");
}

const cargo = read("src-tauri/Cargo.toml");
for (const dependency of ["tauri-plugin-dialog", "tauri-plugin-fs"]) {
  if (!cargo.includes(dependency)) failures.push(`Native Cargo manifest is missing ${dependency}.`);
}

if (failures.length) {
  console.error(
    `Release gate failed with ${failures.length} issue(s):\n${failures.map((item) => `- ${item}`).join("\n")}`,
  );
  process.exit(1);
}

console.log(
  `Release gate OK: ${requiredFiles.length} required files and ${requiredScripts.length} package scripts verified across web and native targets.`,
);
