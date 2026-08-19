import { existsSync,readFileSync,statSync } from "node:fs";
const requiredFiles=["README.md","LICENSE","CONTRIBUTING.md","CODE_OF_CONDUCT.md","SECURITY.md","SUPPORT.md","PRIVACY.md","CHANGELOG.md","ROADMAP.md","what_changed.md","docs/architecture.md","docs/setup.md","docs/development.md","docs/testing.md","docs/release.md","docs/troubleshooting.md","docs/accessibility.md","docs/performance.md",".github/workflows/ci.yml",".github/workflows/e2e.yml",".github/workflows/codeql.yml",".github/workflows/release.yml",".github/dependabot.yml",".github/pull_request_template.md",".github/ISSUE_TEMPLATE/bug_report.yml",".github/ISSUE_TEMPLATE/feature_request.yml","public/manifest.webmanifest","public/sw.js"];
const requiredScripts=["build","typecheck","lint","format:check","docs:links","security:secrets","test","test:e2e","verify","release:gate","perf:budget"];
const failures=[];
for(const file of requiredFiles){if(!existsSync(file))failures.push(`Missing required file: ${file}`);else if(statSync(file).size===0)failures.push(`Required file is empty: ${file}`);}
const pkg=JSON.parse(readFileSync("package.json","utf8"));
if(!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version??""))failures.push("package.json must use a valid semantic version.");
if(pkg.private!==true)failures.push("The application package must remain private to prevent accidental npm publication.");
for(const script of requiredScripts)if(typeof pkg.scripts?.[script]!=="string"||pkg.scripts[script].trim()==="")failures.push(`Missing package script: ${script}`);
const read=(file)=>readFileSync(file,"utf8");
const readme=read("README.md");
for(const marker of ["Made by the Sanskar","buymeacoffee.com/sanskarIN","sanskarin@outlook.in","supportramsandesh@gmail.com","docs/setup.md","docs/testing.md","docs/release.md"])if(!readme.includes(marker))failures.push(`README.md is missing required marker: ${marker}`);
const ci=read(".github/workflows/ci.yml");
for(const command of ["npm run typecheck","npm run lint","npm run format:check","npm run docs:links","npm run security:secrets","npm run release:gate","npm test","npm run build","npm run perf:budget","npm audit --audit-level=high"])if(!ci.includes(command))failures.push(`CI is missing quality gate: ${command}`);
const release=read(".github/workflows/release.yml");
if(!release.includes("npm run verify"))failures.push("Release workflow must run the full verification suite.");
if(failures.length){console.error(`Release gate failed with ${failures.length} issue(s):\n${failures.map((item)=>`- ${item}`).join("\n")}`);process.exit(1);}
console.log(`Release gate OK: ${requiredFiles.length} required files and ${requiredScripts.length} package scripts verified.`);
