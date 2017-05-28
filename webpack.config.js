// Created by Zerk on 25-May-17.

const {resolve} = require('path'),
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  SRC_DIR = resolve(__dirname, 'src'),
  BUILD_DIR = resolve(__dirname, 'build'),
  NODE_MODULES = resolve(__dirname, 'node_modules'),
  isProd = process.env.NODE_ENV === 'production';

const config = {
  context: SRC_DIR,
  entry: {
    main: './js/index.js'
  },
  output: {
    path: BUILD_DIR,
    filename: 'js/[name].bundle.js'
    // publicPath: '/assets/'
  },
  module: {
    rules: [
      // js
      {
        test: /\.js$/,
        include: SRC_DIR,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['es2015', {modules: false}]]
            }
          }
        ]
      },
      // sass
      {
        test: /\.scss$/,
        include: SRC_DIR,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {sourceMap: true}},
            {loader: 'postcss-loader', options: {sourceMap: true}},
            {loader: 'sass-loader', options: {sourceMap: true}}
          ]
        })
      },
      // html
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      // multiple html excluding index.html
      {
        test: /\.html$/,
        exclude: resolve(__dirname, 'src/index.html'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      // images
      {
        test: /\.(jpe?g|png|gif)$/i,
        include: SRC_DIR,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]?[hash]',
              outputPath: 'img/',
              limit: 10000
            }
          },
          {
            loader: 'img-loader'
          }
        ]
      },
      // svg
      {
        test: /\.svg$/i,
        include: SRC_DIR,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
              outputPath: 'img/'
            }
          },
          {
            loader: 'img-loader',
            options: {
              svgo: {
                plugins: [
                  {removeTitle: true},
                  {cleanupIDs: false},
                  {convertPathData: false}
                ]
              }
            }
          }
        ]
      },
      // fonts
      {
        test: /\.(otf|ttf|eot|woff|woff2)$/,
        include: SRC_DIR,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            }
          }
        ]
      },
      // handlebars templates
      {
        test: /\.hbs$/,
        include: SRC_DIR,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              helperDirs: resolve(__dirname, 'js/helpers')
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.scss'],
    modules: [SRC_DIR, NODE_MODULES],
  },
  plugins: [
    new webpack.ProvidePlugin({
      '_': 'lodash'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      favicon: './img/favicon.png',
      inject: true
    }),
    new ExtractTextPlugin({
      filename: 'css/styles.css',
      allChunks: true,
      disable: false
    }),
    new CleanWebpackPlugin([
      'build'
    ]),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 10,
      minChunkSize: 10000
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    })
  ]
};

if (!isProd) {
  config.devtool = 'source-map';
  config.devServer = {
    // contentBase: BUILD_DIR,
    open: true,
    compress: true,
    stats: 'errors-only',
    port: 9000
  };
}

module.exports = config;
