const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'ton.js-mnemonic.js',
        path: path.resolve(__dirname, 'dist'),
    },
};