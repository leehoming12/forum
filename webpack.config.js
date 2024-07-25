/* eslint no-var: 0 */

const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {

  const IS_PRODUCTION = argv.mode !== 'development';

  const babelLoaderConfiguration = ({ server }) => ({
    test: /\.(ts|tsx|m?js)?$/i,
    use: {
      loader: 'babel-loader',
      options: {
        compact: IS_PRODUCTION,
        cacheDirectory: true,
        presets: [
          ['@babel/preset-env', {
            exclude: [
              '@babel/plugin-transform-regenerator',
              '@babel/plugin-transform-async-generator-functions',
              '@babel/plugin-transform-async-to-generator',
            ],
            ...server ? { targets: { node: 'current' } } : {},
          }],
          ['@babel/preset-react', {
            development: !IS_PRODUCTION,
          }],
          '@babel/preset-typescript',
        ]
      },
    },
    resolve: {
      fullySpecified: false,
    },
  });

  const cssLoaderConfiguration = ({ server }) => ({
    test: /\.(css|sass|scss)$/,
    use: [
      !server && MiniCssExtractPlugin.loader,
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              'autoprefixer',
            ],
          }
        }
      },
      'sass-loader',
    ].filter(Boolean),
  });

  const imageLoaderConfiguration = ({ server }) => ({
    test: /\.(gif|jpe?g|a?png|svg)$/i,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[contenthash].[ext]',
        publicPath: '/images',
        outputPath: '/images',
        emitFile: !server,
      }
    }
  });

  const fontLoaderConfiguration = ({ server }) => ({
    test: /\.ttf$/i,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[contenthash].[ext]',
        publicPath: '/fonts',
        outputPath: '/fonts',
        emitFile: !server,
      }
    }
  });

  const webpackConfiguration = {
    mode: IS_PRODUCTION ? 'production' : 'development',
    devtool: IS_PRODUCTION ? false : 'cheap-module-source-map',
    optimization: {
      minimize: IS_PRODUCTION,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            sourceMap: false,
            compress: true,
            format: {
              comments: !IS_PRODUCTION,
            },
          },
        }),
      ],
    },
    experiments: {
      topLevelAwait: true,
    },
    resolve: {
      alias: {
        'jQuery': 'jquery',
        'url': 'whatwg-url',
        '~': path.resolve(__dirname, './src'),
      },
      extensions: [
        '.web.tsx', '.web.jsx', '.tsx', '.tsx',
        '.web.ts', '.web.mjs', '.web.js',
        '.ts', '.ts', '.mjs', '...'
      ]
    },
  };

  const webpackPlugins = [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new webpack.DefinePlugin({ __DEV__: JSON.stringify(!IS_PRODUCTION) }),
    new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
  ];

  return [
    {
      ...webpackConfiguration,
      plugins: [
        ...webpackPlugins,
        new webpack.ProvidePlugin({
          _: 'lodash',
          $: 'jquery',
          React: 'react',
          Parse: 'parse',
          jQuery: 'jquery',
        }),
      ],
      entry: _.fromPairs(_.map(['site', 'cms'], entry => [`${entry}_bundle`, [
        'core-js/stable',
        `./src/${entry}/bin/index.js`,
      ]])),
      output: {
        path: path.join(__dirname, 'dist/public'),
      },
      module: {
        rules: [
          babelLoaderConfiguration({ server: false }),
          cssLoaderConfiguration({ server: false }),
          imageLoaderConfiguration({ server: false }),
          fontLoaderConfiguration({ server: false }),
        ]
      }
    },
    {
      ...webpackConfiguration,
      plugins: [
        ...webpackPlugins,
        new webpack.ProvidePlugin({
          _: 'lodash',
          React: 'react',
        }),
      ],
      target: 'node',
      entry: {
        server: [
          'core-js/stable',
          './src/server/index.js',
        ],
      },
      output: {
        path: path.join(__dirname, 'dist'),
      },
      module: {
        rules: [
          babelLoaderConfiguration({ server: true }),
          cssLoaderConfiguration({ server: true }),
          imageLoaderConfiguration({ server: true }),
          fontLoaderConfiguration({ server: true }),
        ]
      },
      performance: {
        hints: false,
      },
      externals: [
        nodeExternals(),
      ]
    }
  ];
};
