const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    main: './index.js'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
        enforce: 'pre'
      },
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
        query: {
          presets: [
            ['env', {
              loose: true
            }],
            'react'
          ],
          plugins: [
            'transform-object-rest-spread',
            'transform-class-properties',
            'transform-decorators-legacy'
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.web.js', '.default.js', '.js', '.json' ],
    alias: {
      'react-native': 'react-native-web'
    }
  }
}
