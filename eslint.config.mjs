import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin"; // Ensure this is imported
import tsEslintParser from "@typescript-eslint/parser"; // Ensure this is imported

const tsRecommendedRules = {
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  // Add any other TypeScript specific rules you want to include
};

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsEslintParser, // Specify TypeScript parser
      parserOptions: {
        ecmaVersion: 2020, // Adjust ECMAScript version as needed
        sourceType: "module", // Use "module" for ES modules
      },
    },
  },
  pluginJs.configs.recommended, // Recommended rules for JavaScript
  {
    files: ["**/*.ts"],
    rules: {
      ...tsRecommendedRules,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
    },
  },
];
