import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'design', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    // Providers intentionally ship their consumer hook (and a few shared
    // helpers) alongside the component; that only costs HMR granularity.
    files: [
      'src/context/**/*.tsx',
      'src/components/ui/RadialGauge.tsx',
      'src/pages/farmer/MetricLayout.tsx',
      'src/pages/farmer/EarningsPage.tsx',
    ],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
)
