import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
export default tseslint.config(
  {ignores:["dist","coverage","playwright-report"]},
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {languageOptions:{parserOptions:{projectService:true,tsconfigRootDir:import.meta.dirname}},plugins:{"react-hooks":reactHooks,"react-refresh":reactRefresh},rules:{...reactHooks.configs.recommended.rules,"react-refresh/only-export-components":["error",{allowConstantExport:true,allowExportNames:["useApp"]}],"@typescript-eslint/consistent-type-imports":"error","@typescript-eslint/no-misused-promises":["error",{checksVoidReturn:{attributes:false}}]}},
  {files:["scripts/**/*.mjs","eslint.config.js"],languageOptions:{globals:{console:"readonly",process:"readonly"}}},
  {files:["public/sw.js"],languageOptions:{globals:{caches:"readonly",fetch:"readonly",Response:"readonly",self:"readonly",URL:"readonly"}}}
);
