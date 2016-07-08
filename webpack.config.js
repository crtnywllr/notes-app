var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: [
        './js/main.js'
    ],
    output: {
        path: __dirname + '/dist/js',
        publicPath: '/static/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                CLIENT: JSON.stringify(true)
            }
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loaders: ['babel-loader'],
                exclude: [/node_modules/, /bower_components/, /.+\.config.js/],
                include: __dirname,
            }
        ]
    }
};
