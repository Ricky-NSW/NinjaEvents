module.exports = {
    parser: '@babel/eslint-parser',
    extends: [
        'plugin:react/recommended'
    ],
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true
    },
    settings: {
        react: {
            version: 'detect' // Automatically detect the React version
        }
    },
    plugins: [
        'react',
        'react-hooks'
    ],
    rules: {
        'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
        'react-hooks/exhaustive-deps': 'warn', // Checks dependencies of useEffect and similar hooks
        'react/prop-types': 'off', // Turn off prop-types validation
    },

    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    }
};
