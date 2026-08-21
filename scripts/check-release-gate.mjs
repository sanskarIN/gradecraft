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
  "src-tauri/.gitignore",
  "src-tauri/build.rs",
  "src-tauri/Cargo.toml",
  "src-tauri/tauri.conf.json",
  "src-tauri/src/main.rs",
  "src-tauri/src/lib.rs",
  "src-tauri/capabilities/default.json",
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

const e2e = read(".github/workflows/e2e.yml");
for (const marker of [
  "npm run test:e2e",
  "publication-screenshots-${{ github.sha }}",
  "test-results/publication-screenshots/",
  "EVIDENCE.txt",
]) {
  if (!e2e.includes(marker)) failures.push(`E2E workflow is missing release evidence marker: ${marker}`);
}

const nativeCi = read(".github/workflows/native.yml");
for (const command of ["npm run native:check", "npm run android:init", "npm run ios:init"]) {
  if (!nativeCi.includes(command)) failures.push(`Native CI is missing platform gate: ${command}`);
}

const release = read(".github/workflows/release.yml");
for (const command of [
  "npm run release:tag",
  "npm run verify",
  "npm audit --audit-level=high",
  "npx playwright install --with-deps chromium",
  "npm run test:e2e",
]) {
  if (!release.includes(command)) failures.push(`Release workflow is missing gate: ${command}`);
}
for (const marker of [
  "release-screenshots-${{ github.ref_name }}-${{ github.sha }}",
  "test-results/publication-screenshots/",
  "EVIDENCE.txt",
  "tag=$GITHUB_REF_NAME",
]) {
  if (!release.includes(marker)) failures.push(`Release workflow is missing screenshot evidence marker: ${marker}`);
}
if (!release.includes('GRADECRAFT_E2E_PREBUILT: "1"')) {
  failures.push("Release E2E must exercise the already verified production build.");
}

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

const capability = JSON.parse(read("src-tauri/capabilities/default.json"));
for (const permission of ["core:default", "dialog:default", "fs:write-files"]) {
  if (!capability.permissions?.includes(permission)) {
    failures.push(`Native capability is missing required permission: ${permission}`);
  }
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
