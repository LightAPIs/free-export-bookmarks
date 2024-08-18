import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import packageInfo from './package.json';
import HTMLLocation from 'rollup-plugin-html-location';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import ElementPlus from 'unplugin-element-plus/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Copy from 'rollup-plugin-copy';
import ZipPack from 'vite-plugin-zip-pack';

const productionMode = process.env.NODE_ENV === 'production';
const modeDir = productionMode ? 'build' : 'dist';
const browserName = process.env.BROWSER_ENV || 'unknown';
const isChromium = browserName === 'chrome' || browserName === 'edge';

const htmlNames = ['index'];
const jsNames = ['background'];
const pages = {};
htmlNames.forEach(name => {
  pages[name] = path.resolve(__dirname, `src/${name}/index.html`);
});
jsNames.forEach(name => {
  pages[name] = path.resolve(__dirname, `src/${name}/index.ts`);
});
const outDir = `${path.resolve(__dirname, modeDir, browserName)}`;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir,
    sourcemap: !productionMode,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      input: pages,
      output: {
        entryFileNames: '[name]/index.js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'src/assets',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({}),
    Copy({
      targets: [
        {
          src: `src/manifest/${browserName}/manifest.json`,
          dest: `${modeDir}/${browserName}`,
        },
      ],
    }),
    HTMLLocation({
      filename: input => input.replace('src/', ''),
    }),
    productionMode
      ? ZipPack({
          inDir: outDir,
          outDir: 'archive',
          outFileName: `selective-bookmarks-export-tool_${browserName}_v${packageInfo.version}.zip`,
        })
      : undefined,
  ],
  define: {
    'import.meta.env.BROWSER': JSON.stringify(browserName),
    'import.meta.env.IS_CHROMIUM': isChromium,
    'import.meta.env.VERSION': JSON.stringify(packageInfo.version),
  },
});
