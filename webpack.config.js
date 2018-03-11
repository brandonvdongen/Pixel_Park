const path = require('path');

module.exports = {
    entry: './client/js/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist/js')
    },
    module:{
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:[
                    'file-loader'
                ]
            }
        ]
    }
};