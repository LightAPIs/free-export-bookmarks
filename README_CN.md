# Selective Bookmarks Export Tool

[![Release](https://img.shields.io/github/v/release/LightAPIs/free-export-bookmarks.svg?color=orange)](https://github.com/LightAPIs/free-export-bookmarks/releases/latest) [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/dkbihgadoohejmlhpffffbmbhmkhjbfi?maxAge=86400)](https://chrome.google.com/webstore/detail/selective-bookmarks-export-tool/dkbihgadoohejmlhpffffbmbhmkhjbfi) [![Mozilla Add-ons](https://img.shields.io/amo/v/bookmarks-export-tool)](https://addons.mozilla.org/zh-CN/firefox/addon/bookmarks-export-tool/) [![Microsoft Edge Addons](https://img.shields.io/badge/-edge_addons-blue.svg)](https://microsoftedge.microsoft.com/addons/detail/eedggiamkopgoloilafiinldaablcohj) [![MIT](https://img.shields.io/badge/license-MIT-green)](/LICENSE)

<p align="center"><a href="./README.md">English</a> | <b>简体中文</b></p>

> 自由地书签导出工具

允许用户自定义选择导出所需要的书签为 HTML 文件，并且可以自行决定导出内容的数据结构，同时在选择书签时支持通过关键字进行结果过滤。

## 安装方法

### Chrome

前往 [chrome 网上应用店](https://chrome.google.com/webstore/detail/selective-bookmarks-export-tool/dkbihgadoohejmlhpffffbmbhmkhjbfi) 进行下载安装。

### Firefox

前往 [Mozilla Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/bookmarks-export-tool/) 进行下载安装。

### Edge

前往 [Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/eedggiamkopgoloilafiinldaablcohj) 进行下载安装。

## 开发编译

### 环境需求

- 安装 [Node.js](https://nodejs.org/) 20+

### 初始化指令

```bash
# 安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install
```

### 构建指令

- 构建 chrome 版本: `npm run build:c`
- 构建 firefox 版本: `npm run build:f`
- 构建 edge 版本: `npm run build:e`

### 相关目录及文件

- 与打包相关的配置位于 `vite.config.ts` 文件中
- 扩展程序源代码位于 `src` 目录中
- 未改动配置的情况下，`src/assets` 目录下所有文件及文件夹在打包时会自动复制到项目根目录

## 许可证

[MIT](/LICENSE) License
