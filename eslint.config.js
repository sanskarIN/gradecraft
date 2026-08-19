import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
const nodeGlobals={Buffer:"readonly",TextDecoder:"readonly",TextEncoder:"readonly",URL:"readonly",clearTimeout:"readonly",console:"readonly",crypto:"readonly",fetch:"readonly",process:"readonly",setTimeout:"readonly"};
const serviceWorkerGlobals={Response:"readonly",URL:"readonly",caches:"readonly",fetch:"readonly",self:"readonly"};
const typedFiles=["**/*.{ts,tsx}"];
export default tseslint.config(
  {ignores:["dist","coverage","playwright-report"]},
  js.configs.recommended,
  {files:["**/*.{js,mjs}"],languageOptions:{globals:nodeGlobals}},
  {files:["public/sw.js"],languageOptions:{globals:serviceWorkerGlobals}},
  ...tseslint.configs.recommendedTypeChecked.map((config)=>({...config,files:typedFiles})),
  {files:typedFiles,languageOptions:{parserOptions:{projectService:true,tsconfigRootDir:import.meta.dirname}},plugins:{"react-hooks":reactHooks,"react-refresh":reactRefresh},rules:{...reactHooks.configs.recommended.rules,"react-refresh/only-export-components":["warn",{allowConstantExport:true}],"@typescript-eslint/consistent-type-imports":"error","@typescript-eslint/no-misused-promises":["error",{checksVoidReturn:{attributes:false}}]}},
  {files:["src/state/AppContext.tsx"],rules:{"react-refresh/only-export-components":"off"}},
);
