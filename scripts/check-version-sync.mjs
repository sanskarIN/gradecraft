import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const pkg = JSON.parse(read("package.json"));
const version = pkg.version ?? "";
const failures = [];

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  failures.push(`Invalid package version: ${version || "<missing>"}`);
}

const changelog = read("CHANGELOG.md");
const handoff = read("what_changed.md");
const about = read("src/pages/AboutPage.tsx");
const catalogs = [read("src/i18n/en.ts"), read("src/i18n/hi.ts")];
const cargo = read("src-tauri/Cargo.toml");
const tauriConfig = JSON.parse(read("src-tauri/tauri.conf.json"));
const cargoVersion = cargo.match(/^version\s*=\s*"([^"]+)"/m)?.[1] ?? "";

if (!changelog.includes(`## [${version}] - `)) {
  failures.push(`CHANGELOG.md has no dated ${version} release heading.`);
}
if (!handoff.includes(`**Package version:** ${version}`)) {
  failures.push(`what_changed.md does not declare package version ${version}.`);
}
if (!about.includes('from "../../package.json"') || !about.includes("appVersion")) {
  failures.push("AboutPage must derive its displayed version from package.json.");
}
if (cargoVersion !== version) {
  failures.push(`src-tauri/Cargo.toml version ${cargoVersion || "<missing>"} does not match package version ${version}.`);
}
if (tauriConfig.version !== "../package.json") {
  failures.push("src-tauri/tauri.conf.json must source its app version from ../package.json.");
}
for (const [index, catalog] of catalogs.entries()) {
  if (/GradeCraft\s+\d+\.\d+\.\d+/.test(catalog)) {
    failures.push(`i18n catalog ${index + 1} contains a hardcoded GradeCraft semantic version.`);
  }
}

if (failures.length) {
  console.error(
    `Version synchronization failed with ${failures.length} issue(s):\n${failures.map((item) => `- ${item}`).join("\n")}`,
  );
  process.exit(1);
}

console.log(`Version synchronization OK across web and native packages: ${version}.`);
