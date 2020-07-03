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
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        pathRewrite: { '^/api': '' },
        onProxyRes: function (proxyRes, req, res) {
          var cookies = proxyRes.headers['set-cookie'];
          var cookieRegex = /Domain=\.?xxx.com/i; // 返回的cookie中提取domain
          //修改cookie Path
          if (cookies) {
            var newCookie = cookies.map(function (cookie) {
              if (cookieRegex.test(cookie)) {
                // 将domain设置为localhost
                return cookie.replace(cookieRegex, 'Domain=localhost');
              }
              return cookie;
            });
            delete proxyRes.headers['set-cookie'];
            proxyRes.headers['set-cookie'] = newCookie;
          }
        }
      },
    },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});