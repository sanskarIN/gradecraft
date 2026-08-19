import { readFileSync } from "node:fs";
const read=(path)=>readFileSync(path,"utf8"),pkg=JSON.parse(read("package.json")),version=pkg.version??"",failures=[];
if(!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version))failures.push(`Invalid package version: ${version||"<missing>"}`);
const changelog=read("CHANGELOG.md"),handoff=read("what_changed.md"),about=read("src/pages/AboutPage.tsx"),catalogs=[read("src/i18n/en.ts"),read("src/i18n/hi.ts")];
if(!changelog.includes(`## [${version}] - `))failures.push(`CHANGELOG.md has no dated ${version} release heading.`);
if(!handoff.includes(`**Package version:** ${version}`))failures.push(`what_changed.md does not declare package version ${version}.`);
if(!about.includes('from "../../package.json"')||!about.includes("appVersion"))failures.push("AboutPage must derive its displayed version from package.json.");
for(const [index,catalog] of catalogs.entries())if(/GradeCraft\s+\d+\.\d+\.\d+/.test(catalog))failures.push(`i18n catalog ${index+1} contains a hardcoded GradeCraft semantic version.`);
if(failures.length){console.error(`Version synchronization failed with ${failures.length} issue(s):\n${failures.map((item)=>`- ${item}`).join("\n")}`);process.exit(1);}console.log(`Version synchronization OK: ${version}.`);
