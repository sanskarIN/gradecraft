import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const ignored=new Set([".git","node_modules","dist","coverage","playwright-report","test-results"]);
const markdown=[];
function walk(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){if(ignored.has(entry.name))continue;const full=path.join(directory,entry.name);if(entry.isDirectory())walk(full);else if(entry.isFile()&&entry.name.endsWith(".md"))markdown.push(full);}}
walk(root);
const failures=[];
const linkPattern=/!?(?:\[[^\]]*\])\(([^)]+)\)/g;
for(const file of markdown){const lines=fs.readFileSync(file,"utf8").split(/\r?\n/);let fenced=false;for(let index=0;index<lines.length;index+=1){const line=lines[index]??"";if(line.trimStart().startsWith("```")){fenced=!fenced;continue;}if(fenced)continue;for(const match of line.matchAll(linkPattern)){let target=(match[1]??"").trim();if(target.startsWith("<")&&target.endsWith(">"))target=target.slice(1,-1);if(!target||target.startsWith("#")||/^(https?:|mailto:|tel:)/i.test(target))continue;const clean=target.split(/[?#]/,1)[0];if(!clean)continue;let decoded;try{decoded=decodeURIComponent(clean);}catch{failures.push(`${path.relative(root,file)}:${index+1} invalid encoded link ${target}`);continue;}const resolved=decoded.startsWith("/")?path.join(root,decoded):path.resolve(path.dirname(file),decoded);if(!fs.existsSync(resolved))failures.push(`${path.relative(root,file)}:${index+1} missing ${target}`);}}}
if(failures.length){console.error("Documentation link check failed:\n"+failures.map((item)=>`- ${item}`).join("\n"));process.exit(1);}console.log(`Documentation link check passed for ${markdown.length} Markdown files.`);
