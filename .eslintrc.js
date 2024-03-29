/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  extends: [
    // "@remix-run/eslint-config",
    // "@remix-run/eslint-config/node",
    // "@remix-run/eslint-config/jest-testing-library",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: [".eslintrc.js"],
  // We're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but we have to
  // set the jest version explicitly.
  settings: { jest: { version: 27 } },
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    // "@typescript-eslint/no-explicit-any": "off",
    "no-unused-vars": "off",
    // "object-curly-newline": [
    //   "warn",
    //   {
    //     ObjectExpression: { multiline: false, minProperties: 3 },
    //     ObjectPattern: { multiline: false, minProperties: 3 },
    //     ImportDeclaration: "never",
    //     ExportDeclaration: { multiline: false, minProperties: 3 },
    //   },
    // ],
    // "comma-dangle": ["warn", "never"],
    "object-curly-spacing": ["warn", "always"],
  },
};
