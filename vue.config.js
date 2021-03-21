const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const path = require('path');
const packageInfo = require('./package.json');

const productionMode = process.env.NODE_ENV === 'production';
const chromeMode = process.env.VUE_APP_TITLE === 'chrome';
const zipMode = process.env.VUE_APP_BUILD === 'zip';

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

let outputDir = '';
let copyFiles = '';
if (productionMode) {
  if (chromeMode) {
    outputDir = 'build/chrome';
    copyFiles = [
      {
        from: path.resolve('src/chrome/manifest.production.json'),
        to: `${path.resolve('build')}/chrome/manifest.json`,
      },
    ];
  } else {
    outputDir = 'build/firefox';
    copyFiles = [
      {
        from: path.resolve('src/firefox/manifest.production.json'),
        to: `${path.resolve('build')}/firefox/manifest.json`,
      },
    ];
  }
} else {
  if (chromeMode) {
    outputDir = 'dist/chrome';
    copyFiles = [
      {
        from: path.resolve('src/chrome/manifest.development.json'),
        to: `${path.resolve('dist')}/chrome/manifest.json`,
      },
    ];
  } else {
    outputDir = 'dist/firefox';
    copyFiles = [
      {
        from: path.resolve('src/firefox/manifest.development.json'),
        to: `${path.resolve('dist')}/firefox/manifest.json`,
      },
    ];
  }
}

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
          filename: `${packageInfo.name}_${chromeMode ? 'chrome' : 'firefox'}_v${packageInfo.version}.zip`,
        })
      );
    }

    // 关闭 webpack 的性能提示
    config.performance = {
      hints: false,
    };
  },
};
