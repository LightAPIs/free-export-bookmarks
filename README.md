# Selective Bookmarks Export Tool

- English
- [中文版](/README_CN.md)

[![Release](https://img.shields.io/github/v/release/LightAPIs/free-export-bookmarks.svg?color=orange)](https://github.com/LightAPIs/free-export-bookmarks/releases/latest) [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/dkbihgadoohejmlhpffffbmbhmkhjbfi?maxAge=86400)](https://chrome.google.com/webstore/detail/selective-bookmarks-export-tool/dkbihgadoohejmlhpffffbmbhmkhjbfi) [![Mozilla Add-ons](https://img.shields.io/amo/v/selective-bookmarks-export-tool)](https://addons.mozilla.org/zh-CN/firefox/addon/selective-bookmarks-export-tool/) [![Microsoft Edge Addons](https://img.shields.io/badge/-edge_addons-blue.svg)](https://microsoftedge.microsoft.com/addons/detail/eedggiamkopgoloilafiinldaablcohj) [![MIT](https://img.shields.io/badge/license-MIT-green)](/LICENSE)

> Freely bookmark export tool

It allows users to choose the bookmarks they want to export as HTML file, to decide the data structure of the exported content, and to filter the results by keywords when selecting bookmarks.

## Installation

### Chrome

Go to the [Chrome Web Store](https://chrome.google.com/webstore/detail/selective-bookmarks-export-tool/dkbihgadoohejmlhpffffbmbhmkhjbfi) to download and install.

### Firefox

Go to the [Mozilla Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/selective-bookmarks-export-tool/) to download and install.

### Edge

Go to the [Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/eedggiamkopgoloilafiinldaablcohj) to download and install.

## Development

### Environment

- Install [Node.js](https://nodejs.org/) 8.9 and above (_new version has integrated npm_)

### Initialization

```bash
# Install Vue CLI
npm install @vue/cli -g

# Installation dependency
npm install
```

### Build

- Build the Chrome version: `npm run build-chrome`
- Build the Firefox version: `npm run build-firefox`
- Build the Edge version: `npm run build-edge`

### Related

- Package configuration is located in `vue.config.js`
- Extension source code is in the `src` directory
- Without changing the configuration, all files and folders in the `src/assets` directory will be automatically copied to the root directory when packaging

## Thanks

- [zloirock/core-js](https://github.com/zloirock/core-js)
- [ElemeFE/element](https://github.com/ElemeFE/element)
- [vuejs/vue](https://github.com/vuejs/vue)

## Licence

[MIT](/LICENSE) License
