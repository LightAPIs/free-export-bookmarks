const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const path = require('path');
const packageInfo = require('./package.json');

// Generate pages object
const pages = {};

const chromeName = ['index', 'background'];

chromeName.forEach(name => {
  pages[name] = {
    entry: `src/${name}/index.js`,
    template: path.resolve(`src/${name}/index.html`),
    filename: `${name}.html`,
    chunks: ['chunks-vendors', 'chunk-common', name],
  };
});

const copyFiles =
  process.env.NODE_ENV === 'production'
    ? [
        {
          from: path.resolve('src/manifest.production.json'),
          to: `${path.resolve('dist')}/manifest.json`,
        },
      ]
    : [
        {
          from: path.resolve('src/manifest.development.json'),
          to: `${path.resolve('dist')}/manifest.json`,
        },
      ];

copyFiles.push({
  from: path.resolve('src/assets'),
  to: path.resolve('dist'),
});

process.env.VUE_APP_VERSION = packageInfo.version;

module.exports = {
  filenameHashing: false,
  lintOnSave: 'warning',
  pages,
  productionSourceMap: false,
  configureWebpack: config => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: copyFiles,
      })
    );

    if (process.env.VUE_APP_TITLE === 'zip') {
      config.plugins.push(
        new ZipWebpackPlugin({
          path: path.resolve('archive'),
          filename: `${packageInfo.name}_${packageInfo.version}.zip`,
        })
      );
    }

    // 关闭 webpack 的性能提示
    config.performance = {
      hints: false,
    };
  },
};
