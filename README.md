# Free Export Bookmarks

[![Release](https://img.shields.io/github/v/release/LightAPIs/free-export-bookmarks.svg?color=orange)](https://github.com/LightAPIs/free-export-bookmarks/releases/latest) [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/dkbihgadoohejmlhpffffbmbhmkhjbfi?maxAge=86400)](https://chrome.google.com/webstore/detail/free-export-bookmarks/dkbihgadoohejmlhpffffbmbhmkhjbfi) [![Mozilla Add-ons](https://img.shields.io/amo/v/free-export-bookmarks)](https://addons.mozilla.org/zh-CN/firefox/addon/free-export-bookmarks/) [![MIT](https://img.shields.io/badge/license-MIT-green)](/LICENSE)

> 自由书签导出工具

允许用户自定义选择导出所需要的书签为 HTML 文件，并且可以自行决定导出内容的数据结构，同时在选择书签时支持通过关键字进行结果过滤。

## 安装方法

### Chrome

1. 前往 [chrome 网上应用店](https://chrome.google.com/webstore/detail/free-export-bookmarks/dkbihgadoohejmlhpffffbmbhmkhjbfi) 进行下载安装。
2. 点击[此处](https://github.com/LightAPIs/free-export-bookmarks/releases/latest)下载扩展程序压缩包并进行解压，启动浏览器在地址栏内输入 `chrome://extensions/` 进入扩展程序管理页面，点击网页右上角的开关以开启"开发者模式"，然后点击"加载已解压的扩展程序"按钮，选择加载先前解压所得目录即可完成扩展程序的安装。

### Firefox

1. [Releases](https://github.com/LightAPIs/free-export-bookmarks/releases/latest)
2. [Mozilla Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/free-export-bookmarks/)

## 开发编译

### 环境需求

- 安装 [Node.js](https://nodejs.org/) 8.9 及以上 (_新版本已集成 npm，若您的网络环境不佳，推荐安装使用 [cnpm](https://github.com/cnpm/cnpm)_)

### 初始化指令

```bash
# 安装 Vue CLI
npm install @vue/cli -g

# 安装依赖
npm install
```

### 构建指令

- 构建 chrome 版本: `npm run build-chrome`
- 构建 firefox 版本: `npm run build-firefox`

### 相关目录及文件

- 与打包相关的配置位于 `vue.config.js` 文件中
- 扩展程序源代码位于 `src` 目录中
- 未改动配置的情况下，`src/assets` 目录下所有文件及文件夹在打包时会自动复制到项目根目录

## 致谢

本项目基于以下开源项目进行构建：

- [zloirock/core-js](https://github.com/zloirock/core-js)
- [ElemeFE/element](https://github.com/ElemeFE/element)
- [vuejs/vue](https://github.com/vuejs/vue)

## 许可证

[MIT](/LICENSE) License
