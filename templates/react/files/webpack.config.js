'use strict';

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const PROJECT_ROOT_PATH = path.resolve(__dirname);

const APP_SOURCES_PATH = path.resolve(PROJECT_ROOT_PATH, 'src');
const APPLICATION_ENTRY_PATH = path.resolve(APP_SOURCES_PATH, 'index.ts');
const HTML_TEMPLATE_PATH = path.resolve(APP_SOURCES_PATH, 'index.html');
const FAVICON_PATH = path.resolve(APP_SOURCES_PATH, 'assets/favicon.ico');

const OUTPUT_FOLDER = 'dist';
const OUTPUT_ASSETS_FOLDER = 'assets';
const OUTPUT_SCRIPTS_FOLDER = 'scripts';
const OUTPUT_STYLES_FOLDER = 'styles';
const OUTPUT_PATH = path.resolve(PROJECT_ROOT_PATH, OUTPUT_FOLDER);

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT, 10) || 8080;

const openDevServer = process.platform === 'darwin' ? 'Google Chrome' : true;

const commonConfig = {
  target: 'browserslist',
  context: __dirname, // to automatically find tsconfig.json
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  entry: {
    app: APPLICATION_ENTRY_PATH
  },
  output: {
    path: OUTPUT_PATH,
    filename: `${OUTPUT_SCRIPTS_FOLDER}/[name].[contenthash].js`,
    chunkFilename: `${OUTPUT_SCRIPTS_FOLDER}/[name].[contenthash].chunk.js`,
    assetModuleFilename: `${OUTPUT_ASSETS_FOLDER}/[name][ext]`
  },
  module: {
    // Makes missing exports an error instead of warning
    strictExportPresence: true,
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        enabled: true,
        files: './src/**/*.{ts,js}' // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
      },
      async: true,
      typescript: {
        enabled: true,
        memoryLimit: 4096
      }
    })
  ]
};

const developmentConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  performance: { hints: false },
  optimization: {
    minimize: false,
    moduleIds: 'deterministic'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: HTML_TEMPLATE_PATH,
      inject: true,
      favicon: FAVICON_PATH
    }),
    new ForkTsCheckerNotifierWebpackPlugin({
      title: 'TypeScript',
      excludeWarnings: false
    })
  ],
  devServer: {
    // only dev
    contentBase: OUTPUT_PATH,
    compress: true,
    watchContentBase: true,
    hot: true,
    port: PORT,
    host: HOST,
    overlay: {
      errors: true,
      warnings: true
    },
    open: openDevServer,
    publicPath: '/'
  }
};

const productionConfig = {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  performance: {
    hints: 'error',
    maxEntrypointSize: 1500000,
    maxAssetSize: 2500000
  },
  optimization: {
    minimize: true,
    moduleIds: 'deterministic',
    minimizer: [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${OUTPUT_STYLES_FOLDER}/[name].[contenthash].css`,
      chunkFilename: `${OUTPUT_STYLES_FOLDER}/[name].[contenthash].chunk.css`
    }),
    new HtmlWebpackPlugin({
      template: HTML_TEMPLATE_PATH,
      inject: true,
      favicon: FAVICON_PATH,
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    })
  ]
};

module.exports = (env) => {
  if (env.development) {
    return merge(commonConfig, developmentConfig);
  } else if (env.production) {
    return merge(commonConfig, productionConfig);
  } else {
    throw new Error('No matching configuration was found!');
  }
};
