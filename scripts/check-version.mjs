import { readFile } from "node:fs/promises";
const packageJson=JSON.parse(await readFile("package.json","utf8")),version=packageJson.version;
if(typeof version!=="string"||!/^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/.test(version)){console.error("package.json contains an invalid semantic version.");process.exit(1);}
const [about,changelog]=await Promise.all([readFile("src/i18n/en.ts","utf8"),readFile("CHANGELOG.md","utf8")]),failures=[];
if(!about.includes(`version:\"GradeCraft ${version}\"`))failures.push(`src/i18n/en.ts does not expose GradeCraft ${version}.`);
if(!changelog.includes(`## [${version}]`))failures.push(`CHANGELOG.md does not contain a ${version} release section.`);
if(failures.length){console.error(failures.join("\n"));process.exit(1);}console.log(`Release version references agree on ${version}.`);
