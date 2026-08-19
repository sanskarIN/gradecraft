import { defineConfig,devices } from "@playwright/test";
const webServerCommand=process.env.GRADECRAFT_E2E_PREBUILT==="1"?"npm run preview -- --host 127.0.0.1":"npm run build && npm run preview -- --host 127.0.0.1";
export default defineConfig({testDir:"./e2e",fullyParallel:true,retries:process.env.CI?2:0,reporter:"html",use:{baseURL:"http://127.0.0.1:4173",trace:"on-first-retry"},webServer:{command:webServerCommand,port:4173,reuseExistingServer:!process.env.CI},projects:[{name:"chromium",use:{...devices["Desktop Chrome"]}}]});
