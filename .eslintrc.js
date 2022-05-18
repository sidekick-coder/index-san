module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'quotes': 'off',
    'indent': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: false,
        ignoredNodes: ['TSTypeParameterInstantiation'],
      },
    ],
    // vue
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-v-model-argument': 'off',
  },
}
