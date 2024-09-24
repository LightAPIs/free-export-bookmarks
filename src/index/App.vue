<template>
  <el-container :element-loading-text="i18n('indexLoadingText')">
    <el-header class="bookmarks-header">
      <el-button type="primary" :title="i18n('indexExportTip')" :loading="exportLoading" @click="exportHtml">
        {{ exportLoading ? i18n('indexExportLoadingText') : i18n('indexExportText') }}
      </el-button>
      <el-button :title="i18n('indexReloadTip')" :disabled="exportLoading" @click="reloadBookmarks">
        {{ i18n('indexReloadText') }}
      </el-button>
      <el-input v-model="filterText" class="bookmarks-input" :placeholder="i18n('indexInputPlaceholder')" autofocus clearable>
        <template #prefix>
          <el-icon v-if="searching" class="is-loading">
            <loading></loading>
          </el-icon>
          <search v-else></search>
        </template>
      </el-input>
      <el-button type="info" class="bookmarks-settings-btn" :title="i18n('indexDrawerTitle')" :icon="Setting" circle @click="drawerShow = true"></el-button>
      <el-button class="bookmarks-settings-btn" :icon="isDark ? Moon : Sunny" circle @click="toggleDark()"></el-button>
    </el-header>
    <div v-show="progress.show" style="padding: 0 10px">
      <el-progress :percentage="progress.value"></el-progress>
    </div>
    <el-main id="bookmarks-index-main">
      <el-tree
        ref="treeRef"
        :data="dataSource"
        node-key="id"
        :props="{ label: 'title' }"
        :default-expanded-keys="expandedKeys"
        :filter-node-method="filterNode"
        show-checkbox
      >
        <template #default="{ node, data }">
          <template v-if="settingsStore.showIcon">
            <img v-if="data.url" class="bookmarks-item-icon" :src="faviconURL(data.url)" />
            <el-icon v-else :size="16" class="bookmarks-item-icon">
              <folder></folder>
            </el-icon>
          </template>
          <span v-if="data.type === 'separator'">
            <el-divider class="bookmarks-divider"></el-divider>
          </span>
          <span v-else :title="node.label + (data.url ? '\n' + data.url : '')">
            {{ node.label }}
          </span>
        </template>
      </el-tree>
    </el-main>
  </el-container>
  <b-settings-drawer v-model:open="drawerShow"></b-settings-drawer>
</template>

<script setup lang="ts">
import i18n from '@/common/i18n';
import { ref, reactive, watch, nextTick, onMounted } from 'vue';
import { useDark, useToggle } from '@vueuse/core';
import { useSettingsStore } from '@/stores/settings';
import { ElMessage, ElLoading, type ElTree } from 'element-plus';
import { Folder, Loading, Search, Setting, Moon, Sunny } from '@element-plus/icons-vue';
import { downloadTextFile, htmlFileGenerator, faviconURL } from '@/common/tools';
import { debounce } from 'lodash-es';
import BSettingsDrawer from '@/components/BSettingsDrawer.vue';

type TreeKey = string | number;
interface TreeNodeData {
  [key: string]: string;
}

const settingsStore = useSettingsStore();

const isDark = useDark();
const toggleDark = useToggle(isDark);

const treeRef = ref<InstanceType<typeof ElTree>>();

const filterText = ref('');
const searching = ref(false);
const exportLoading = ref(false);
const drawerShow = ref(false);

const dataSource = ref<chrome.bookmarks.BookmarkTreeNode[]>([]);
const expandedKeys = ref<string[]>(['1', '2', 'menu________', 'toolbar_____', 'unfiled_____', 'mobile______']);
const checkedKeys = ref<TreeKey[]>([]);

const progress = reactive({
  show: false,
  value: 0,
  count: 0,
  total: 0,
});

const debounced = debounce((newVal: string) => {
  nextTick(() => {
    treeRef.value?.filter(newVal);
    searching.value = false;
  });
}, 1000);

watch(
  () => filterText.value,
  newVal => {
    searching.value = true;
    debounced(newVal);
  }
);

function progressHandler() {
  progress.count++;
  if (progress.count / progress.total > (progress.value + 10) / 100) {
    progress.value += 10;
  }
}

function progressCompleted() {
  progress.value = 100;
}

function filterNode(value: string, data: TreeNodeData) {
  return data.title.includes(value);
}

function exportHtml() {
  checkedKeys.value = treeRef.value?.getCheckedKeys() || [];
  if (checkedKeys.value.length > 0) {
    exportLoading.value = true;
    chrome.bookmarks.getTree(async results => {
      // To avoid affecting the existing bookmark tree, reread a bookmark list
      if (results && results[0].children) {
        const data = [...results[0].children];
        Object.assign(progress, {
          show: true,
          value: 0,
          count: 0,
          total: checkedKeys.value.length,
        });
        const exportArr = traverseBookmarks(data);
        const time = new Date();

        downloadTextFile(
          await htmlFileGenerator(exportArr, settingsStore.$state, progressHandler, progressCompleted),
          `bookmarks_${time.getFullYear()}_${time.getMonth() + 1}_${time.getDate()}.html`,
          () => {
            exportLoading.value = false;
            progress.show = false;
            ElMessage({
              message: i18n('indexExportSuccessTip'),
              type: 'success',
            });
          }
        );
      }
    });
  } else {
    ElMessage({
      message: i18n('indexExportNoSelectedTip'),
      type: 'warning',
    });
  }
}

/**
 * Recursive traversal to obtain the node key value that needs to be expanded.
 * @param arr
 */
function traverseArray(arr: chrome.bookmarks.BookmarkTreeNode[]) {
  arr.forEach(item => {
    if (item.children) {
      expandedKeys.value.push(item.id);
      traverseArray(item.children);
    }
  });
}

/**
 * Recursive traversal returns the bookmark node that needs to be exported.
 * @param arr
 */
function traverseBookmarks(arr: chrome.bookmarks.BookmarkTreeNode[]) {
  return arr
    .map(item => {
      if (checkedKeys.value.includes(item.id)) {
        return item;
      } else if (item.children) {
        item.children = traverseBookmarks(item.children);
        if (item.children.length > 0) {
          return item;
        }
        return null;
      } else {
        return null;
      }
    })
    .filter((v): v is chrome.bookmarks.BookmarkTreeNode => v != null);
}

async function loadBookmarks() {
  const results = await chrome.bookmarks.getTree();
  if (results && results[0].children) {
    dataSource.value = [...results[0].children];
    if (settingsStore.autoExpandAll) {
      expandedKeys.value = [];
      traverseArray(dataSource.value);
    }
  }
}

async function reloadBookmarks() {
  dataSource.value = [];
  expandedKeys.value = ['1', '2', 'menu________', 'toolbar_____', 'unfiled_____', 'mobile______'];
  checkedKeys.value = [];
  filterText.value = '';

  const loadingInstance = ElLoading.service({
    target: document.getElementById('bookmarks-index-main') || document.body,
    text: i18n('indexLoadingText'),
  });

  await loadBookmarks();

  loadingInstance.close();
}

onMounted(async () => {
  const loadingInstance = ElLoading.service({
    target: document.getElementById('bookmarks-index-main') || document.body,
    text: i18n('indexLoadingText'),
  });

  await settingsStore.read();
  await loadBookmarks();

  loadingInstance.close();
});
</script>

<style>
body {
  overflow: hidden;
}

#bookmarks-index-main {
  height: calc(100vh - 60px);
}

.bookmarks-header {
  background-color: #162848;
  padding-top: 14px;
}

.bookmarks-input {
  width: 50%;
  margin-left: 25px;
}

.bookmarks-settings-btn {
  float: right;
  margin-left: 12px;
}

.bookmarks-divider {
  width: 75vw;
}

.bookmarks-item-icon {
  margin-right: 2px;
}
</style>
