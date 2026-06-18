import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginImport from "eslint-plugin-import";

export default [
  {
    ignores: ["node_modules", "dist", "vite.config.ts"], // Ignore these directories
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      js,
      import: pluginImport,
    },
    rules: {
      ...js.configs.recommended.rules, // Include recommended JS rules
      "no-unused-vars": "off", // Disable unused variables rule
      "import/order": "error",
      "import/no-duplicates": "error",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      ...tseslint.configs.recommended.rules, // Include recommended TypeScript rules
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReact.configs.recommended.rules, // Include recommended React rules
      "react-hooks/rules-of-hooks": "error", // Enforce React hooks rules
      "react-hooks/exhaustive-deps": "warn", // Warn about missing dependencies in hooks
      "react/jsx-key": "off",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      ...pluginReact.configs["jsx-runtime"].rules,
    },
  },
];
