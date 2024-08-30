import noOnlyTests from 'eslint-plugin-no-only-tests'
import globals from 'globals'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '**/node_modules',
      '**/public',
      '**/assets',
      '**/cypress.json',
      '**/reporter-config.json',
      '**/dist/',
      '**/pt_tests',
      '**/E2E_Tests',
    ],
  },
  ...compat.extends('plugin:prettier/recommended', 'prettier'),
  {
    plugins: {
      'no-only-tests': noOnlyTests,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },

        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      },
    },

    rules: {
      'no-unused-vars': [
        1,
        {
          argsIgnorePattern: 'res|next|^err|_',
          ignoreRestSiblings: true,
        },
      ],

      'no-use-before-define': 0,
      semi: 0,

      'comma-dangle': ['error', 'always-multiline'],

      'no-only-tests/no-only-tests': 'error',

      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 120,
          semi: false,
        },
      ],

      'no-empty-function': [
        'error',
        {
          allow: ['constructors', 'arrowFunctions'],
        },
      ],

      'no-restricted-syntax': 0,
    },
  },
  ...compat
    .extends(
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    )
    .map(config => ({
      ...config,
      files: ['**/*.ts'],
      ignores: ['**/*.js'],
    })),
  {
    files: ['**/*.ts'],
    ignores: ['**/*.js'],

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      '@typescript-eslint/no-use-before-define': 0,
      'class-methods-use-this': 0,
      'no-useless-constructor': 0,
      'prefer-regex-literals': 0,

      '@typescript-eslint/no-unused-vars': [
        1,
        {
          argsIgnorePattern: 'res|next|^err|_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/semi': 0,

      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 120,
          semi: false,
        },
      ],
    },
  },
]
