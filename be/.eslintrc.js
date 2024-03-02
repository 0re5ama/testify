module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: ['airbnb-base'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    settings: {
        'import/resolver': {
            'babel-module': {},
        },
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'max-len': ['error', { code: 120 }],
        'no-eval': 'off',
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
    },
};
