/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = { NODE_ENV: 'development' }) => {
  const isProd = env.NODE_ENV === 'production';
  return {
    resolve: {
      modules: [ path.join(__dirname, 'node_modules') ],
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },

    context: __dirname,
    mode: isProd ? 'production' : 'development',
    entry: {
      app: './src/index',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js',
        publicPath: '/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'statics/index.html'
      }),
      !isProd ? new webpack.HotModuleReplacementPlugin() : null,
    ].filter(v => !!v),
    module: {
      rules: [
        {
          test: /\.(tsx|ts)$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'ts-loader',
            }
          ],
          include: [ path.join(__dirname, 'src') ],
        },
        {
          test: /\.(jsx|js)$/,
          use: [
            {
              loader: 'babel-loader',
            }
          ],
          include: [ path.join(__dirname, 'src') ],
        },
        {
          test: /\.svg(\?.*)?$/,
          use: [ 'babel-loader', {
            loader: 'react-svg-loader',
            options: {
              jsx: true
            }
          } ]
        },
        {
          test: /\.(woff)$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 65000
            }
          }]
        },
        {
          test: /\.(png|jpg|jpeg|gif)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 50000,
              name: 'img/[name]-[hash:6].[ext]'
            }
          }]
        },
        {
          test: /locales/,
          use: [{
            loader: '@alienfast/i18next-loader'
          }]
        }
      ]
    },
    devtool: 'source-map',
    devServer: {
      https: true,
      publicPath: '/',
      port: 3000,
      host: '0.0.0.0',
      contentBase: './dist',
      inline: true,
      hot: !isProd,
      historyApiFallback: true
    }
  }
};
