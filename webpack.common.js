const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = require('./user.config');
const { loader } = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    index: './src/js/index.js',
    login: './src/js/login.js',
  },
  output: {
    filename: 'js/[name].bundle.js',
    path: `${__dirname}/dist`,
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        //打包公共模块
        commons: {
          chunks: 'initial', //initial表示提取入口文件的公共部分
          minChunks: 2, //表示提取公共部分最少的文件数
          minSize: 0, //表示提取公共部分最小的大小
          name: 'commons' //提取出来的文件命名
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        }
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              name: `images/[name]_[hash:7].[ext]`,
            },
          },
        ],
      },
      // {
      //   test: /\.js$/,
      //   include: [
      //     `${__dirname}/src`,
      //   ],
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: {
      //         presets: ['@babel/preset-env'],
      //       },
      //     },

      //   ],
      // },
      {
        test: /\.js$/,
        include: /src/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].chunk.css',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/html/login.html',
      filename: './html/login.html',
      chunks: ['login', 'commons'],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      chunks: ['index', ]
    }),
  ],
};