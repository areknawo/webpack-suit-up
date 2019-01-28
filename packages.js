const shell = require('shelljs');
module.exports = config => {
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
  const isESLint = config.lint.indexOf('eslint') > -1;
  const isJSHint = config.lint.indexOf('jshint') > -1;
  const isTSLint = config.lint.indexOf('tshint') > -1;
  const isJSMinify = config.minify.indexOf('js') > -1;
  const isCache = config.cache;

 const packages = ['webpack', 'webpack-cli', 'css-loader', 'style-loader'];
    (isTS || isTSLint) && packages.push('typescript', 'ts-loader');
    isCoffee && packages.push('coffee-loader');
    if (isBabel || (isReact && !isTS)) {
         packages.push('@babel/core', '@babel/preset-env', '@babel/plugin-transform-runtime', 'babel-loader');
         if(isJSX || isReact){
            packages.push('@babel/plugin-transform-react-jsx');
         }
    }
    fileLoader.length > 0 && packages.push('file-loader');
    urlLoader.length > 0 && packages.push('url-loader');
    isSCSS && packages.push('node-sass', 'sass-loader');
    isLess && packages.push('less-loader');
    isStylus && packages.push('stylus', 'stylus-loader');
    isPostCSS && packages.push('postcss-loader', 'postcss-preset-env');
    isESLint && packages.push('eslint', 'eslint-loader');
    isJSHint && packages.push('jshint', 'jshint-loader')
    isTSLint && packages.push('tslint', 'tslint-loader')
    isJSMinify && packages.push('uglifyjs-webpack-plugin');
    isCache && packages.push('hard-source-webpack-plugin');
    shell.exec(`npm install --save-dev ${packages.join(' ')}`)
};
