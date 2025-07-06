import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // 👇 تخفيف القيود
      "@typescript-eslint/no-explicit-any": "off",       
      "@typescript-eslint/explicit-module-boundary-types": "off", 
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "react/react-in-jsx-scope": "off",               
      "no-console": "off",                             
      "no-debugger": "warn"                             
    },
  },
];

export default eslintConfig;
