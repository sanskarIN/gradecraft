import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
const roots=[".","src","tests","e2e","docs",".github","public","scripts"],extensions=new Set([".ts",".tsx",".js",".mjs",".json",".md",".yml",".yaml",".css",".html",".svg"]),ignored=new Set(["node_modules","dist","coverage","playwright-report",".git"]),files=new Set();
const isMissingPath=(error)=>Boolean(error&&typeof error==="object"&&"code" in error&&error.code==="ENOENT");
async function walk(path){for(const entry of await readdir(path,{withFileTypes:true})){if(ignored.has(entry.name))continue;const full=join(path,entry.name);if(entry.isDirectory())await walk(full);else if(extensions.has(extname(entry.name))||entry.name.startsWith("."))files.add(full);}}
for(const root of roots){try{await walk(root);}catch(error){if(!isMissingPath(error))throw error;}}
const failures=[];for(const file of files){const text=await readFile(file,"utf8");if(text.includes("\r"))failures.push(`${file}: CRLF line endings`);if(/\t/.test(text))failures.push(`${file}: tab character`);if(/[ \t]+$/m.test(text))failures.push(`${file}: trailing whitespace`);if(text.length>0&&!text.endsWith("\n"))failures.push(`${file}: missing final newline`);}if(failures.length){console.error(failures.join("\n"));process.exit(1);}console.log(`Formatting baseline OK for ${files.size} files.`);
