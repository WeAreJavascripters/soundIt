var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (function () {

    return {
        context: './client/',
        entry: {
            soundIt: './js/soundIt.js'
        },
        output: {
            path: './dist',
            filename: 'js/[name].min.js'
        },
        resolve: {
            extensions: ['', '.js', '.sass']
        },
        stats: {
            colors: true
        },
        plugins: [
          new CopyWebpackPlugin([
                {
                    from: './index.html'
                },{
                    from: './css/',
                    to: 'css/'
                }
          ])
      ]
    };

})();
