import { readFileSync } from "node:fs";import { describe,expect,it } from "vitest";
interface ManifestIcon{src:string;sizes:string;type:string;purpose:string;}
interface Manifest{name:string;short_name:string;start_url:string;scope:string;display:string;icons:ManifestIcon[];}
const manifest=JSON.parse(readFileSync(new URL("../public/manifest.webmanifest",import.meta.url),"utf8")) as Manifest;
describe("PWA manifest",()=>{it("keeps portable relative start and scope URLs",()=>{expect(manifest.start_url).toBe(".");expect(manifest.scope).toBe(".");expect(manifest.display).toBe("standalone");});it("declares separate any and maskable icon sources",()=>{expect(manifest.icons).toEqual(expect.arrayContaining([expect.objectContaining({src:"icons/icon.svg",purpose:"any"}),expect.objectContaining({src:"icons/icon-maskable.svg",purpose:"maskable"})]));for(const icon of manifest.icons){expect(icon.type).toBe("image/svg+xml");expect(icon.sizes).toBe("any");}});});
