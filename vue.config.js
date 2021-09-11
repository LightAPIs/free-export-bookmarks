const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const path = require('path');
const packageInfo = require('./package.json');

const productionMode = process.env.NODE_ENV === 'production';
const zipMode = process.env.VUE_APP_BUILD === 'zip';

// Generate pages object
const pages = {};

const chromeName = ['index', 'background'];

chromeName.forEach(name => {
  pages[name] = {
    entry: `src/${name}/index.js`,
    template: path.resolve(`src/${name}/index.html`),
    filename: `${name}.html`,
    chunks: ['chunk-vendors', 'chunk-common', name],
  };
});

let outputDir = '';
let copyFiles = '';
const folderName = productionMode ? 'build' : 'dist';
outputDir = `${folderName}/${process.env.VUE_APP_TITLE}`;
copyFiles = [
  {
    from: path.resolve(`src/manifest/${process.env.VUE_APP_TITLE}/manifest.${productionMode ? 'production' : 'development'}.json`),
    to: `${path.resolve(folderName)}/${process.env.VUE_APP_TITLE}/manifest.json`,
  },
];

copyFiles.push({
  from: path.resolve('src/assets'),
  to: path.resolve(outputDir),
});

process.env.VUE_APP_VERSION = productionMode ? packageInfo.version : packageInfo.version + ' (Dev)';

module.exports = {
  outputDir,
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

    if (productionMode) {
      Object.assign(config.optimization.minimizer[0].options.terserOptions.compress, {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      });
    }

    if (zipMode) {
      config.plugins.push(
        new ZipWebpackPlugin({
          path: path.resolve('archive'),
          filename: `${packageInfo.name}_${process.env.VUE_APP_TITLE}_v${packageInfo.version}.zip`,
        })
      );
    }

    // 关闭 webpack 的性能提示
    config.performance = {
      hints: false,
    };
  },
};
