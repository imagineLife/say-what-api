module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: ['airbnb', 'prettier'],
  overrides: [
    {
      files: ["*.spec.js"],
      rules: {
        "no-console": "off"
      }
    }
  ],
  ignorePatterns: ['dist/index.js'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['prettier'],
  rules: {
    'spaced-comment': [0],
  },
};
