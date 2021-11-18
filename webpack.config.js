
const path = require('path');

const { NormalModuleReplacementPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');


module.exports = function configureWebpack(env) {

    // Getting Webpack CLI args, or falling back to defaults
    const {
        mode = (process.env.NODE_ENV || 'development'),

    } = env;

    const baseConfig = {
        mode,
        entry: './src/index.js',
        devtool: 'source-map',
        output: {
            filename: 'index.js',
        },
    };

    /**
     * Browser-specific config.
     */
    const webConfig = merge(baseConfig, {
        name: 'web',
        target: 'web',
        output: {
            library: {
                type: 'umd',
                name: {
                    root: ['TonWeb', 'mnemonic'],
                    amd: 'tonweb-mnemonic',
                    commonjs: 'tonweb-mnemonic',
                },
            },
            path: path.resolve(__dirname, 'dist/web'),
        },
        plugins: [
            // Using native "webcrypto" utilities
            new NormalModuleReplacementPlugin(
                /crypto\/crypto-node/,
                path.resolve(__dirname, 'src/crypto/crypto-web.js')
            )
        ],
    });

    /**
     * Node-specific config.
     */
    const nodeConfig = merge(baseConfig, {
        name: 'node',
        target: 'node',
        output: {
            library: {
              type: 'commonjs2',
            },
            path: path.resolve(__dirname, 'dist/node'),
        },
        externalsPresets: {
            node: true,
        },
        externals: [nodeExternals()],
        optimization: {
            minimize: false,
        },
    });

    // Returning multiple configs
    // for parallel builds
    return [
        nodeConfig,
        webConfig,
    ];

}
