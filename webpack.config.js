var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = (function () {

    return {
        context: __dirname,
        entry: {
            soundIt: './client/js/soundIt.js'
        },
        output: {
            path: './dist',
            filename: 'js/[name].min.js'
        },
        resolve: {
            extensions: ['', '. js', '.sass']
        },
        stats: {
            colors: true
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    context: path.resolve(__dirname + '/client'),
                    from: './index.html'
                }, {
                    context: path.resolve(__dirname + '/client'),
                    from: './workers/',
                    to: 'js/workers/'
                }, {
                    context: path.resolve(__dirname + '/client'),
                    from: './css/',
                    to: 'css/'
                }, {
                    context: path.resolve(__dirname),
                    from: './node_modules/libmp3lame/libmp3lame.js',
                    to: 'libmp3lame/'
                }
            ])
        ],
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
                    query: {
                        presets: ['es2015']
                    }
                }
            ]
        }

    };

})();
