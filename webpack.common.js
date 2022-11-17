const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    main: './index.js'
  },
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      },
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules\/art/,
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
       process: 'process/browser',
    }),
  ],
  resolve: {
    extensions: [ '.web.js', '.default.js', '.js' ],
    alias: {
      'react-native': 'react-native-web',
    },
    fallback: {
      "os": false,
      "path": false,
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
    }
  }
}
