import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // Global ignores
  {
    ignores: ["dist", "build", "coverage", "node_modules"],
  },

  // Default JS + React rules
  {
    files: ["**/*.{js,jsx}"],
    ...js.configs.recommended,
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      ecmaVersion: "latest",
      globals: { ...globals.browser },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "no-undef": "error",
    },
  },

  // Jest test files - override rules
  {
    files: [
      "**/__tests__/**/*.{js,jsx}",
      "**/*.test.{js,jsx}",
      "**/*.spec.{js,jsx}",
    ],
    languageOptions: {
      globals: { ...globals.jest, ...globals.browser },
    },
    rules: {
      "no-undef": "off",
      "no-redeclare": "off",
      "no-unused-vars": "off", // Allow unused vars in tests
    },
  },

  // Cypress e2e tests
  {
    files: ["cypress/e2e/**/*.cy.{js,jsx}"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      "no-undef": "off",
    },
  },
];
