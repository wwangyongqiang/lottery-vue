const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const config = require('./user.config');
console.log(config.publicPath)

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    hot: true,
    open: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});