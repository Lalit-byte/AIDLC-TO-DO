import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

// Controls of the security design (C-1, C-2): storage and network names are allowed only in
// src/services/, and raw HTML insertion is forbidden everywhere.
const STORAGE_AND_NETWORK_GLOBALS = [
  'localStorage',
  'sessionStorage',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
  'indexedDB',
].map((name) => ({
  name,
  message: `Browser storage and network access belong in src/services/ only (RULES.md, NFR5.2). Use the storage service.`,
}));

const RAW_HTML_PROPERTIES = ['innerHTML', 'outerHTML', 'insertAdjacentHTML'].map((property) => ({
  property,
  message: 'Never insert raw HTML; titles are shown as plain text (NFR4.1).',
}));

const STORAGE_AND_NETWORK_PROPERTIES = [
  ...[
    'localStorage',
    'sessionStorage',
    'fetch',
    'XMLHttpRequest',
    'WebSocket',
    'EventSource',
    'indexedDB',
  ].flatMap((property) =>
    ['window', 'globalThis'].map((object) => ({
      object,
      property,
      message: 'Browser storage and network access belong in src/services/ only (NFR5.2).',
    })),
  ),
  {
    object: 'navigator',
    property: 'sendBeacon',
    message: 'Network access belongs in src/services/ only (NFR5.2).',
  },
  {
    object: 'document',
    property: 'cookie',
    message: 'Cookies are browser storage; storage belongs in src/services/ only (NFR5.2).',
  },
];

export default [
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'aidlc/**', '.claude/**', 'docs/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.flat.recommended.rules,
      // Plain JavaScript project without the prop-types package; shapes are in the contracts.
      'react/prop-types': 'off',
      'react/no-danger': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-restricted-globals': ['error', ...STORAGE_AND_NETWORK_GLOBALS],
      'no-restricted-properties': [
        'error',
        ...STORAGE_AND_NETWORK_PROPERTIES,
        ...RAW_HTML_PROPERTIES,
      ],
    },
  },
  {
    // The one override that allows storage and network names: the services folder.
    files: ['src/services/**/*.js'],
    rules: {
      'no-restricted-globals': 'off',
      'no-restricted-properties': ['error', ...RAW_HTML_PROPERTIES],
    },
  },
  {
    // The title rules only compute: all storage and network names stay forbidden there.
    files: ['src/services/titleRules.js'],
    rules: {
      'no-restricted-globals': ['error', ...STORAGE_AND_NETWORK_GLOBALS],
      'no-restricted-properties': [
        'error',
        ...STORAGE_AND_NETWORK_PROPERTIES,
        ...RAW_HTML_PROPERTIES,
      ],
    },
  },
  {
    // Narrow override for tests: only localStorage and fetch (to set up and spy on them).
    files: ['src/**/*.test.{js,jsx}', 'src/test/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        ...STORAGE_AND_NETWORK_GLOBALS.filter(
          (entry) => entry.name !== 'localStorage' && entry.name !== 'fetch',
        ),
      ],
    },
  },
  {
    // Tool configuration files run in Node, not in the browser.
    files: ['*.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
];
