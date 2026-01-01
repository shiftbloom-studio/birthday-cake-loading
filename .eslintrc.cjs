module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/react-in-jsx-scope": "off"
  }
};
