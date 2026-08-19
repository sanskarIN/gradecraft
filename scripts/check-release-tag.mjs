import { readFileSync } from "node:fs";
const pkg=JSON.parse(readFileSync("package.json","utf8")),tag=process.argv[2]??process.env.GITHUB_REF_NAME,expected=`v${pkg.version}`;
if(!tag){console.error("Release tag validation requires a tag argument or GITHUB_REF_NAME.");process.exit(1);}if(tag!==expected){console.error(`Release tag ${tag} does not match package version ${pkg.version}; expected ${expected}.`);process.exit(1);}console.log(`Release tag OK: ${tag}.`);
