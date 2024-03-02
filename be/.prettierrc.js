module.exports = {
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 80,
    tabWidth: 4,
    proseWrap: 'never',
    endOfLine: 'lf',
    overrides: [
        {
            files: '.prettierrc',
            options: {
                parser: 'json',
            },
        },
        {
            files: 'document.ejs',
            options: {
                parser: 'html',
            },
        },
    ],
};
