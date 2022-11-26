const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: 'false'
    }),
    new HtmlWebpackPlugin({
      title: 'Tristan\'s DND Assistant'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new FaviconsWebpackPlugin(path.resolve(__dirname, 'media/logo-icon.png'))
  ],
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'docs')
  }
})
