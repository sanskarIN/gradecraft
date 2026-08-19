import { access,readdir,readFile } from "node:fs/promises";
import { dirname,extname,resolve } from "node:path";
const ignored=new Set(["node_modules","dist","coverage","playwright-report",".git"]),markdown=[];
async function walk(path){for(const entry of await readdir(path,{withFileTypes:true})){if(ignored.has(entry.name))continue;const full=resolve(path,entry.name);if(entry.isDirectory())await walk(full);else if(extname(entry.name)===".md")markdown.push(full);}}
function localTarget(raw){const value=raw.trim().replace(/^<|>$/g,"");if(!value||value.startsWith("#")||/^(?:https?:|mailto:|tel:)/i.test(value))return null;const withoutTitle=value.replace(/\s+["'][^"']*["']\s*$/,"").split(/[?#]/,1)[0];if(!withoutTitle)return null;try{return decodeURIComponent(withoutTitle);}catch{return withoutTitle;}}
await walk(".");const failures=[];for(const file of markdown){const text=await readFile(file,"utf8"),pattern=/!?\[[^\]]*\]\(([^)]+)\)/g;for(const match of text.matchAll(pattern)){const target=localTarget(match[1]??"");if(!target)continue;const candidate=resolve(dirname(file),target);try{await access(candidate);}catch{failures.push(`${file}: missing link target ${target}`);}}}
if(failures.length){console.error(failures.join("\n"));process.exit(1);}console.log(`Documentation links OK across ${markdown.length} Markdown files.`);
