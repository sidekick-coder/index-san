module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'indent': ['error', 4],
        'quotes': ['off'], //leave prettier handle quotes
        'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
        'no-debugger': 'warn',
        'semi': ['error', 'never'],
        'no-useless-escape': 'off',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
                trailingComma: 'es5',
                semi: false,
                singleQuote: true,
                useTabs: false,
                quoteProps: 'consistent',
                tabWidth: 4,
                bracketSpacing: true,
                arrowParens: 'always',
                printWidth: 100,
            },
        ],
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-undef': 'off',
        'no-self-assign': 'off',
    },
}
