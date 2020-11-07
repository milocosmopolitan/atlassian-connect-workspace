"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareConfig = exports.createWebpackConfig = void 0;
// https://github.com/nrwl/nx/blob/master/packages/next/src/utils/config.ts
const workspace_1 = require("@nrwl/workspace");
const config_1 = require("next/dist/next-server/server/config");
const path_1 = require("path");
const tsconfig_paths_webpack_plugin_1 = require("tsconfig-paths-webpack-plugin");
const config_2 = require("@nrwl/web/src/utils/config");
function createWebpackConfig(workspaceRoot, projectRoot, fileReplacements = []) {
    return function webpackConfig(config, { defaultLoaders }) {
        const mainFields = ['es2015', 'module', 'main'];
        const extensions = ['.ts', '.tsx', '.mjs', '.js', '.jsx'];
        config.resolve.plugins = [
            new tsconfig_paths_webpack_plugin_1.TsconfigPathsPlugin({
                configFile: path_1.resolve(workspaceRoot, projectRoot, 'tsconfig.json'),
                extensions,
                mainFields,
            }),
        ];
        fileReplacements
            .map((fileReplacement) => ({
            replace: path_1.resolve(workspaceRoot, fileReplacement.replace),
            with: path_1.resolve(workspaceRoot, fileReplacement.with),
        }))
            .reduce((alias, replacement) => {
            alias[replacement.replace] = replacement.with;
            return alias;
        }, config.resolve.alias);
        config.module.rules.push({
            test: /\.tsx?$/,
            use: [defaultLoaders.babel],
        }, {
            test: /\.svg$/,
            oneOf: [
                // If coming from JS/TS file, then transform into React component using SVGR.
                {
                    issuer: {
                        test: /\.[jt]sx?$/,
                    },
                    use: [
                        '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                        {
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                                name: '[name].[hash:7].[ext]',
                            },
                        },
                    ],
                },
                // Fallback to plain URL loader.
                {
                    use: [
                        {
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                                name: '[name].[hash:7].[ext]',
                            },
                        },
                    ],
                },
            ],
        });
        config.plugins.push(config_2.createCopyPlugin([
            {
                input: 'public',
                // distDir is `dist/apps/[name]/.next` and we want public to be copied
                // to `dist/apps/[name]/public` thus the `..` here.
                output: '../public',
                glob: '**/*',
            },
        ]));
        return config;
    };
}
exports.createWebpackConfig = createWebpackConfig;
function prepareConfig(phase, options, context) {
    const config = config_1.default(phase, options.root, null);
    const userWebpack = config.webpack;
    const userNextConfig = options.nextConfig
        ? require(options.nextConfig)
        : (_, x) => x;
    // Yes, these do have different capitalisation...
    config.outdir = `${workspace_1.offsetFromRoot(options.root)}${options.outputPath}`;
    config.distDir = path_1.join(config.outdir, '.next');
    config.webpack = (a, b) => createWebpackConfig(context.workspaceRoot, options.root, options.fileReplacements)(userWebpack ? userWebpack(a, b) : a, b);
    return userNextConfig(phase, config, { options });
}
exports.prepareConfig = prepareConfig;
//# sourceMappingURL=config.js.map