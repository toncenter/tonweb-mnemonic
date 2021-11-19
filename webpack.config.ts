
const path = require('path');

import { NormalModuleReplacementPlugin, Configuration as WebpackConfig } from 'webpack';
import { merge } from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';


export default function configureWebpack(env): WebpackConfig[] {

    // Getting Webpack CLI args, or falling back to defaults
    const {
        mode = (process.env.NODE_ENV || 'development'),

    } = env;

    const baseConfig = <WebpackConfig> {
        mode,
        entry: './src/index.ts',
        devtool: 'source-map',
        output: {
            filename: 'index.js',
        },
        resolve: {
            extensions: ['.ts'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-typescript'],
                            plugins: ['@babel/plugin-transform-runtime']
                        }
                    },
                },
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                typescript: {
                    configFile: path.resolve(__dirname, 'tsconfig.lib.json'),
                },
            }),
        ]
    };

    /**
     * Browser-specific config.
     */
    const webConfig = merge(baseConfig, <WebpackConfig> {
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
                path.resolve(__dirname, 'src/crypto/crypto-web.ts')
            )
        ],
    });

    /**
     * Node-specific config.
     */
    const nodeConfig = merge(baseConfig, <WebpackConfig> {
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
