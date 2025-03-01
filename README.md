# Selective Bookmarks Export Tool

[![Release](https://img.shields.io/github/v/release/LightAPIs/free-export-bookmarks.svg?color=orange)](https://github.com/LightAPIs/free-export-bookmarks/releases/latest) [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/dkbihgadoohejmlhpffffbmbhmkhjbfi?maxAge=86400)](https://chrome.google.com/webstore/detail/selective-bookmarks-export-tool/dkbihgadoohejmlhpffffbmbhmkhjbfi) [![Mozilla Add-ons](https://img.shields.io/amo/v/bookmarks-export-tool)](https://addons.mozilla.org/en-US/firefox/addon/bookmarks-export-tool/) [![Microsoft Edge Addons](https://img.shields.io/badge/-edge_addons-blue.svg)](https://microsoftedge.microsoft.com/addons/detail/eedggiamkopgoloilafiinldaablcohj) [![MIT](https://img.shields.io/badge/license-MIT-green)](/LICENSE)

<p align="center"><b>English</b> | <a href="./README_CN.md">简体中文</a></p>

> Freely bookmark export tool

It allows users to choose the bookmarks they want to export as HTML file, to decide the data structure of the exported content, and to filter the results by keywords when selecting bookmarks.

## Installation

### Chrome

Go to the [Chrome Web Store](https://chrome.google.com/webstore/detail/selective-bookmarks-export-tool/dkbihgadoohejmlhpffffbmbhmkhjbfi) to download and install.

### Firefox

Go to the [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/bookmarks-export-tool/) to download and install.

### Edge

Go to the [Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/eedggiamkopgoloilafiinldaablcohj) to download and install.

## Development

### Environment

- Install [Node.js](https://nodejs.org/) 20+

### Initialization

```bash
# Install pnpm
npm install -g pnpm

# Installation dependency
pnpm install
```

### Build

- Build the Chrome version: `pnpm run build:c`
- Build the Firefox version: `pnpm run build:f`
- Build the Edge version: `pnpm run build:e`

### Related

- Package configuration is located in `vite.config.ts`
- Extension source code is in the `src` directory
- Without changing the configuration, all files and folders in the `src/assets` directory will be automatically copied to the root directory when packaging

## Licence

[MIT](/LICENSE) License
