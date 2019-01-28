#!/usr/bin/env node
const enquirer = require('enquirer');
const chalk = require('chalk');
const developmentConfigurator = require('./development');
const productionConfigurator = require('./production');
const packagesInstaller = require('./packages');
console.log(chalk.bold.green('Let\'s setup your Webpack boilerplate! ⚡'));
new enquirer()
  .prompt([
    {
      type: 'text',
      message: 'Path to your input file',
      name: 'input',
      required: true
    },
    {
      type: 'text',
      message: 'Path to your output folder',
      name: 'output',
      required: true
    },
    {
      type: 'multiselect',
      name: 'languages',
      message: 'Select (using Space) language transpiler/s you want to use',
      choices: [
        { message: 'TypeScript', value: 'ts' },
        { message: 'CoffeeScript', value: 'coffee' },
        { message: 'Babel', value: 'babel' },
        {
          message: 'JSX',
          value: 'jsx',
          hint: chalk.red('(Requires Babel or TypeScript)')
        }
      ]
    },
    {
      type: 'select',
      name: 'stack',
      message: 'Select framework you\'re going to use',
      choices: [
        {
          message: 'React',
          name: 'React',
          value: 'react',
          hint: chalk.yellow('(Uses JSX (Babel/TypeScript))')
        },
        {
          message: 'Vue',
          name: 'Vue',
          value: 'vue'
        },
        { message: 'None', name: 'None', value: 'none' }
      ]
    },
    {
      type: 'list',
      name: 'urlLoader',
      message:
        'Type comma-separated file extensions to be loaded inline (url-loader)'
    },
    {
      type: 'list',
      name: 'fileLoader',
      message:
        'Type comma-separated file extensions to be loaded as files (file-loader)'
    },
    {
      type: 'multiselect',
      name: 'css',
      message: 'Select (using Space) CSS preprocessor/s you want to use',
      choices: [
        { message: 'CSS Modules', value: 'modules' },
        { message: 'SCSS', value: 'scss' },
        { message: 'Less', value: 'less' },
        { message: 'Stylus', value: 'stylus' },
        {
          message: 'PostCSS',
          value: 'postcss',
          hint: chalk.yellow('(PostCSS Preset Env)')
        }
      ]
    },
    {
      type: 'toggle',
      name: 'sourceMaps',
      message: 'Use source maps?'
    },
    {
      type: 'toggle',
      name: 'production',
      message: 'Do you want to setup production config?'
    },
    {
      type: 'select',
      name: 'lint',
      message: ({ answers }) => {
        return `Do you want to lint your files${
          answers.production ? ' on production' : ''
        }?`;
      },
      choices: [
        { message: 'ESLint', value: 'eslint' },
        { message: 'JSHint', value: 'jshint' },
        {
          message: 'TSHint',
          value: 'tshint',
          hint: chalk.yellow('(Requires TypeScript)')
        },
        { message: 'No', value: 'no' }
      ]
    },
    {
      type: 'multiselect',
      name: 'minify',
      message: ({ answers }) =>
        `Select (using Space) files you want to minify${
          answers.production ? ' on production' : ''
        }?`,
      choices: [
        { message: 'JS and alike', value: 'js' },
        { message: 'CSS and alike', value: 'css' }
      ]
    },
    {
      type: 'toggle',
      name: 'cache',
      message: ({ answers }) =>
        `Do you want to cache your files? ${
          answers.production ? 'Development only!' : ''
        }`
    }
  ])
  .then(config => {
    packagesInstaller(config);
    if (config.production) {
      productionConfigurator(config);
    }
    developmentConfigurator(config);
    console.log(chalk.bold.green('All done!'));
    if (config.production) {
      console.log(
        `Add ${chalk.bold(`webpack --config webpack.dev.js`)} and ${chalk.bold(`webpack --config webpack.prod.js`)} to your NPM scripts for optimal experience!`
      );
    } else {
      console.log(
        `Add ${chalk.bold(`webpack --config webpack.config.js`)} to your NPM scripts for optimal experience!`
      );
    }
  })
  .catch((err) => {
    if(err) console.log(err)
    console.log(chalk.bold.red('Configuration cancelled!'));
  });
