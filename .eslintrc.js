module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  overrides: [
    {
      files: ['**/*.spec.js'],
      rules: {
        'no-console': 'off',
        'no-underscore-dangle': 'off'
      },
    },
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
    'no-console': [0],
  },
};
