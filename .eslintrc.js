module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    overrides: [
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
                'no-console': 'off',
            },
        },
        {
            files: ['*.vue'],
            parser: 'vue-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
                sourceType: 'module',
            },
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['vue', '@typescript-eslint'],
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
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-setup-props-destructure': 'off',
        'vue/one-component-per-file': 'off',
        'vue/no-v-html': 'off',
        'vue/no-v-text-v-html-on-component': 'off',
        'no-undef': 'off',
    },
}
