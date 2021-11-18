
const path = require('path');

const { NormalModuleReplacementPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');


module.exports = function configureWebpack(env, argv) {

    // Getting Webpack CLI args, or falling back to defaults
    const {
        target = 'node',
        mode = (process.env.NODE_ENV || 'development'),

    } = argv;

    /**
     * Basic config suitable for Node.js.
     */
    let config = {
        mode,
        entry: './src/index.js',
        devtool: 'source-map',
        target,
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, `dist/${target}`),
            libraryTarget: 'commonjs2',
        },
        plugins: [],
    };

    /**
     * Browser-specific config.
     */
    if (target === 'web') {
        config = merge(config, {
            output: {
                libraryTarget: 'umd',
                library: {
                    root: ['TonWeb', 'mnemonic'],
                    amd: 'tonweb-mnemonic',
                    commonjs: 'tonweb-mnemonic'
                },
            },
            plugins: [
                // Using native "webcrypto" utilities
                new NormalModuleReplacementPlugin(
                    /crypto\/crypto-node/,
                    path.resolve(__dirname, 'src/crypto/crypto-web.js')
                )
            ],
        });
    }

    /**
     * Node-specific config.
     */
    if (target === 'node') {

        config = merge(config, {
            externals: [nodeExternals()],
        });

        if (mode === 'production') {
            // No need to minify for Node.js
            config = merge(config, {
                optimization: {
                    minimize: false,
                },
            });
        }

    }

    return config;

}
