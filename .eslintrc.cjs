module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  ignorePatterns: ["dist/", "coverage/"],
  overrides: [
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended-type-checked"],
      rules: {
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      },
    },
  ],
};
