const fs = require('fs');
const chalk = require('chalk');
const prettier = require('prettier');
const shell = require('shelljs');
module.exports = config => {
  const input = config.input;
  const output = config.output;
  const isTS = config.languages.indexOf('ts') > -1;
  const isCoffee = config.languages.indexOf('coffee') > -1;
  const isBabel = config.languages.indexOf('babel') > -1;
  const isJSX = config.languages.indexOf('jsx') > -1;
  const isReact = config.stack === 'react';
  const isVue = config.stack === 'vue';
  const isCSSModules = config.css.indexOf('modules') > -1;
  const isSCSS = config.css.indexOf('scss') > -1;
  const isLess = config.css.indexOf('less') > -1;
  const isStylus = config.css.indexOf('stylus') > -1;
  const isPostCSS = config.css.indexOf('postcss') > -1;
  const urlLoader = config.urlLoader;
  const fileLoader = config.fileLoader;
  const isSourceMaps = config.sourceMaps;
  const isProduction = config.production;
  const isESLint = config.lint.indexOf('eslint') > -1;
  const isJSHint = config.lint.indexOf('jshint') > -1;
  const isTSLint = config.lint.indexOf('tshint') > -1;
  const isJSMinify = config.minify.indexOf('js') > -1;
  const isCSSMinify = config.minify.indexOf('css') > -1;
  const isCache = config.cache;

  fs.writeFile(
    isProduction ? './webpack.dev.js' : './webpack.config.js',
    /*javascript*/ prettier.format(`
    ${isCache ? `const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');` : ``}
    ${(isJSMinify && !isProduction) ? `const UglifyJsPlugin = require('uglifyjs-webpack-plugin');` : ``}
    ${isVue ? `const VueLoaderPlugin = require('vue-loader/lib/plugin');` : ``}
    const path = require('path');

    module.exports = {
      entry: '${input}',
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '${output}'),
      },
      mode: 'development',
      resolve: {
        extensions: [
          '.js', '.css',
          ${isTS ? `'.ts', '.tsx',` : ``}
          ${isCoffee ? `'.coffee',` : ``}
          ${isBabel ? `'.mjs', '.jsx',` : ``}
          ${isVue ? `'.vue',` : ``}
          ${isSCSS ? `'.scss',` : ``}
          ${isLess ? `'.less',` : ``}
          ${isStylus ? `'.styl',` : ``}
        ]
      },
      ${isSourceMaps ? `devtool: 'source-map',` : ``}
      ${(isJSMinify && !isProduction) ? 
      `optimization: {
        minimizer: [
          new UglifyJsPlugin({
            parallel: true,
            ${isCache ? `cache: true,` : ``}
            ${isSourceMaps ? `sourceMap: true,` : ``}
          })
        ]
      },` : ``}
      module: {
        rules: [
          ${(isTS || (isTSLint && !isProduction)) ? `{
            test: /\\.tsx?$/,
            use: {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  ${isSourceMaps ? `sourceMap: true,` : ``}
                  ${isJSX ? `jsx: React,` : ``}
                },
              },
            },
            exclude: /node_modules/,
          },` : ``}
          ${isCoffee ? `{
            test: /\\.coffee$/,
            use: 'coffee-loader',
            exclude: /node_modules/,
          },` : ``}
          ${(isBabel || (isReact && !isTS)) ? `{
            test: /\\.m?jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                ${isCache ? `cacheDirectory: true,` : ``}
                presets: ['@babel/preset-env'],
                plugins: [
                  '@babel/plugin-transform-runtime',
                  ${(isJSX || isReact) ? `'@babel/plugin-transform-react-jsx',` : ``}
                ],
              },
            },
          },` : ``}
          ${(isTS && isTSLint && !isProduction) ? `{
            test: /\\.tsx?$/,
            enforce: 'pre',
            loader: 'tslint-loader',
          },` : ``}
          ${(isESLint && !isProduction) ? `{
            test: /\\.m?jsx?$/,
            enforce: 'pre',
            exclude: /node_modules/,
            loader: 'eslint-loader',
          },` : ``}
          ${(isJSHint && !isProduction) ? `{
            test: /\\.m?jsx?$/,
            enforce: 'pre',
            exclude: /node_modules/,
            loader: 'jshint-loader',
          },`: ``}
          ${isVue ? `{
            test: /\\.vue$/,
            loader: 'vue-loader',
          },` : ``}
          ${fileLoader.length > 0 ? `{
            test: /\\.(${fileLoader.join('|')})$/,
            use: 'file-loader',
            exclude: /node_modules/,
          },` : ``}
          ${urlLoader.length > 0 ? `{
            test: /\\.(${urlLoader.join('|')})$/,
            use: 'url-loader',
            exclude: /node_modules/,
          },` : ``}
          {
            test: /\\.css$/,
            use: [
              'style-loader',
              { 
                loader: 'css-loader',
                options: { 
                  ${isCSSModules ? `modules: true,` : ``}
                  ${isPostCSS ? `importLoaders: 1,` : ``}
                  ${(isCSSMinify && !isProduction) ? `minimize: true,` : ``} 
                },
              },
              ${isPostCSS ? `{
                loader: 'postcss-loader',
                options: {
                  plugins: (loader) => [
                    require('postcss-preset-env')(),
                  ],
                },
              },` : ``}
            ],
          },
          ${isSCSS ? `{
            test: /\\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ],
          },` : ``}
          ${isLess ? `{
            test: /\\.less$/,
            use: [
                'style-loader',
                'css-loader',
                'less-loader',
            ],
          },` : ``}
          ${isStylus ? `{
            test: /\\.styl$/,
            use: [
                'style-loader',
                'css-loader',
                'stylus-loader',
            ],
          },` : ``}
        ],
      },
      ${(isVue || isCache) ? `
      plugins: [
        ${isVue ? `new VueLoaderPlugin(),` : ``}
        ${isCache ? `new HardSourceWebpackPlugin(),` : ``}
      ],` : ``}
    }`, { semi: false, parser: 'babel' }),
    () => {
      console.log(
        chalk.bold.green(`${isProduction ? `Development config` : `Config`} created!`)
      );
    }
  );
};