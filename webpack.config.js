const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'));

module.exports = function(env = {}) {
    const config = {
        mode: 'development',
        devtool: 'source-map',
        entry: './src/ts/App.ts',
        output: {
            path: path.join(__dirname, 'public', 'js'),
            filename: 'script.js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve('src', 'index.html'),
                templateParameters: {isDevServer},
                filename: isDevServer ? 'index.html' : path.join(__dirname, 'index.html')
            }),
            new WrapperPlugin({
                test: /script\.js$/,
                header: 'window.$w = function(o, e){with (o) {return eval(e)}};'
            })
        ],
        resolve: {
            extensions: ['.ts', '.js', '.frag', '.vert']
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: 'ts-loader'
                },
                {
                    test: /\.frag?$/,
                    use: 'raw-loader'
                },
                {
                    test: /\.vert?$/,
                    use: 'raw-loader'
                }
            ]
        }
    };

    if (env.cdp) {
        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /a\.js|node_modules/,
                failOnError: true,
                cwd: process.cwd(),
            })
        )
    }

    return config;
};