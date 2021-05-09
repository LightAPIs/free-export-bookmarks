<template>
  <div id="index-app">
    <el-container class="index-container">
      <el-header class="index-header">
        <el-button type="primary" size="small" class="btn" @click="exportHtml" :title="$ui.get('indexExportTip')" :loading="exportLoading">
          {{ exportLoading ? $ui.get('indexExportLoadingText') : $ui.get('indexExportText') }}
        </el-button>
        <el-button size="small" class="btn" @click="reloadBookmarks" :title="$ui.get('indexReloadTip')">
          {{ $ui.get('indexReloadText') }}
        </el-button>
        <el-input
          :placeholder="$ui.get('indexInputPlaceholder')"
          v-model="filterText"
          class="filter-input"
          :prefix-icon="searching ? 'el-icon-loading' : 'el-icon-search'"
          autofocus
          clearable
        ></el-input>
        <el-button
          :title="$ui.get('indexDrawerTitle')"
          type="info"
          icon="el-icon-setting"
          size="small"
          circle
          class="right btn"
          @click="drawer = true"
        ></el-button>
      </el-header>
      <div class="export-progress" v-show="progress.isShow">
        <el-progress :percentage="progress.value"></el-progress>
      </div>
      <el-main id="index-main">
        <el-tree
          :data="dataSource"
          :props="{ label: 'title' }"
          node-key="id"
          :default-expanded-keys="expandedKeys"
          :filter-node-method="filterNode"
          ref="tree"
          show-checkbox
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <template v-if="settings.showIcon">
              <img v-if="data.url" :src="'chrome://favicon/' + data.url" />
              <i v-else class="el-icon-folder"></i>
            </template>
            <el-tooltip v-if="data.url" placement="right-start">
              <div slot="content">
                {{ node.label }}
                <br />
                {{ data.url }}
              </div>
              <span>
                {{ node.label }}
              </span>
            </el-tooltip>
            <span v-else>
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </el-main>
    </el-container>
    <el-drawer :visible.sync="drawer" :title="$ui.get('indexDrawerTitle')" class="modal-backgrund">
      <el-collapse v-model="activeName">
        <el-collapse-item name="dispaly" class="collapse-item">
          <template slot="title">
            <i class="header-icon el-icon-view"></i>
            {{ $ui.get('indexDrawerDisplayTitle') }}
          </template>
          <el-divider></el-divider>
          <template v-if="isChrome">
            <div>
              <el-switch
                v-model="settings.showIcon"
                :active-text="$ui.get('indexDrawerDisplayShowIconText')"
                @change="handleChange"
              ></el-switch>
            </div>
            <el-divider></el-divider>
          </template>
          <div>
            <el-switch
              v-model="settings.autoExpandAll"
              :active-text="$ui.get('indexDrawerDisplayAutoExpandAllText')"
              @change="handleChange"
            ></el-switch>
          </div>
          <p>
            {{ $ui.get('indexDrawerDisplayAutoExpandAllTip') }}
          </p>
          <el-divider></el-divider>
        </el-collapse-item>
        <el-collapse-item name="export" class="collapse-item">
          <template slot="title">
            <i class="header-icon el-icon-files"></i>
            {{ $ui.get('indexDrawerExportTitle') }}
          </template>
          <el-divider></el-divider>
          <template v-if="isChrome">
            <div>
              <el-switch
                v-model="settings.includeIcon"
                :active-text="$ui.get('indexDrawerExportIncludeIconText')"
                @change="handleChange"
              ></el-switch>
            </div>
            <p>
              {{ $ui.get('indexDrawerExportIncludeIconTip') }}
            </p>
            <el-divider></el-divider>
          </template>
          <div>
            <el-switch
              v-model="settings.includeDate"
              :active-text="$ui.get('indexDrawerExportIncludeDateText')"
              @change="handleChange"
            ></el-switch>
          </div>
          <el-divider></el-divider>
          <div>
            <el-switch
              v-model="settings.noOtherBookmarks"
              :active-text="
                isChrome ? $ui.get('indexDrawerExportNoOtherBookmarksText') : $ui.get('indexDrawerExportNoOtherBookmarksTextFirefox')
              "
              @change="handleChange"
            ></el-switch>
          </div>
          <p>
            {{ isChrome ? $ui.get('indexDrawerExportNoOtherBookmarksTip') : $ui.get('indexDrawerExportNoOtherBookmarksTipFirefox') }}
          </p>
          <el-divider></el-divider>
          <div>
            <el-switch
              v-model="settings.noParentFolders"
              :active-text="$ui.get('indexDrawerExportNoParentFoldersText')"
              @change="handleChange"
            ></el-switch>
          </div>
          <p>
            {{ isChrome ? $ui.get('indexDrawerExportNoParentFoldersTip') : $ui.get('indexDrawerExportNoParentFoldersTipFirefox') }}
          </p>
          <el-divider></el-divider>
        </el-collapse-item>
        <el-collapse-item name="about" class="collapse-item">
          <template slot="title">
            <i class="header-icon el-icon-info"></i>
            {{ $ui.get('indexDrawerAboutTitle') }}
          </template>
          <el-divider></el-divider>
          <div class="extension">
            <img class="extension-icon" src="@/img/icon-24.png" />
            <span class="extension-name">{{ $ui.get('extensionName') + ' v' + version }}</span>
          </div>
          <el-divider content-position="left">
            {{ $ui.get('indexDrawerAboutSupportText') }}
          </el-divider>
          <div>
            <p>
              {{ $ui.get('indexDrawerAboutSupportLabel') }}
            </p>
            <ul>
              <li v-for="(item, index) in support" :key="index">
                <a target="_blank" :href="item.url">
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </div>
          <el-divider content-position="left">
            {{ $ui.get('indexDrawerAboutThanksText') }}
          </el-divider>
          <div>
            <p>
              {{ $ui.get('indexDrawerAboutThanksLabel') }}
            </p>
            <ul>
              <li v-for="(item, index) in thanks" :key="index">
                <a target="_blank" :href="item.url">
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </div>
          <el-divider></el-divider>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      dataSource: [],
      loadingInstance: null,
      exportLoading: false,
      drawer: false,
      activeName: [],
      settings: {
        showIcon: false,
        autoExpandAll: false,
        includeIcon: false,
        includeDate: false,
        noOtherBookmarks: false,
        noParentFolders: false,
      },
      expandedKeys: ['1', '2', '3', '4', '5', '6', 'menu________', 'toolbar_____', 'unfiled_____', 'mobile______'],
      checkedKeys: [],
      filterText: '',
      searching: false,
      version: process.env.VUE_APP_VERSION,
      support: [
        {
          title: this.$ui.get('indexDrawerAboutSourceCodeText'),
          url: 'https://github.com/LightAPIs/free-export-bookmarks',
        },
        {
          title: this.$ui.get('indexDrawerAboutFeedbackText'),
          url: 'https://github.com/LightAPIs/free-export-bookmarks/issues',
        },
      ],
      thanks: [
        {
          title: 'core-js (MIT Liscense)',
          url: 'https://github.com/zloirock/core-js',
        },
        {
          title: 'Element (MIT License)',
          url: 'https://github.com/ElemeFE/element',
        },
        {
          title: 'Vue.js (MIT Liscense)',
          url: 'https://github.com/vuejs/vue',
        },
      ],
      progress: {
        isShow: false,
        value: 0,
        count: 0,
        totalCount: 0,
      },
      isChrome: process.env.VUE_APP_TITLE === 'chrome' || process.env.VUE_APP_TITLE === 'opera',
    };
  },
  watch: {
    filterText(val) {
      this.searching = true;
      this.$tools.debounce(() => {
        this.$nextTick(() => {
          this.$refs.tree.filter(val);
          this.searching = false;
        });
      }, 1000);
    },
  },
  methods: {
    progressHandle() {
      this.progress.count++;
      if (this.progress.count / this.progress.totalCount > (this.progress.value + 10) / 100) {
        this.progress.value += 10;
      }
    },
    progressCompleted() {
      this.progress.value = 100;
    },
    exportHtml() {
      this.checkedKeys = this.$refs.tree.getCheckedKeys();
      // console.log(this.checkedKeys);
      if (this.checkedKeys.length > 0) {
        this.exportLoading = true;
        // 为了不影响已存在的书签树，重新读取一个书签列表
        chrome.bookmarks.getTree(async results => {
          if (results) {
            const data = [...results[0].children];
            Object.assign(this.progress, {
              isShow: true,
              value: 0,
              count: 0,
              totalCount: this.checkedKeys.length,
            });
            const exportArr = this.traverseBookmarks(data);
            const time = new Date();
            const { settings } = this;

            this.$tools.downloadTextFile(
              await this.$tools.createHtmlFile(exportArr, settings),
              `bookmarks_${time.getFullYear().toString()}_${(time.getMonth() + 1).toString()}_${time.getDate().toString()}.html`,
              () => {
                this.exportLoading = false;
                this.progress.isShow = false;
                this.$message({
                  message: this.$ui.get('indexExportSuccessTip'),
                  type: 'success',
                });
              }
            );
          }
        });
      } else {
        this.$message({
          message: this.$ui.get('indexExportNoSelectedTip'),
          type: 'warning',
        });
      }
    },
    reloadBookmarks() {
      Object.assign(this, {
        dataSource: [],
        loadingInstance: null,
        expandedKeys: ['1', '2', '3', '4', '5', '6', 'menu________', 'toolbar_____', 'unfiled_____', 'mobile______'],
        checkedKeys: [],
        filterText: '',
      });

      this.loadingInstance = this.$loading({
        target: document.getElementById('index-main'),
        text: this.$ui.get('indexLoadingText'),
      });

      setTimeout(() => {
        this.loadBookmarks();
      }, 0);
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.title.indexOf(value) !== -1;
    },
    handleChange() {
      const { settings, isChrome } = this;
      chrome.storage.local.set(
        {
          settings: isChrome ? settings : Object.assign({}, settings),
        },
        () => {
          console.log('The settings have been set.');
        }
      );
    },
    /**
     * 递归遍历获取需要展开的节点 key 值
     * @param {Array} arr 数组值
     */
    traverseArray(arr) {
      arr.forEach(item => {
        if (item.children) {
          this.expandedKeys.push(item.id);
          this.traverseArray(item.children);
        }
      });
    },
    /**
     * 递归遍历返回需要导出的书签节点
     * @param {Array} arr 数组值
     */
    traverseBookmarks(arr) {
      const { checkedKeys } = this;
      return arr
        .map(item => {
          if (checkedKeys.includes(item.id)) {
            return item;
          } else if (item.children) {
            item.children = this.traverseBookmarks(item.children);
            if (item.children.length > 0) {
              return item;
            }
            return null;
          } else {
            return null;
          }
        })
        .filter(v => v);
    },
    loadBookmarks() {
      chrome.bookmarks.getTree(results => {
        if (results) {
          // console.log(results[0].children);
          this.dataSource = [...results[0].children];
          if (this.settings.autoExpandAll) {
            this.expandedKeys = [];
            this.traverseArray(this.dataSource);
          }
          this.loadingInstance.close();
        }
      });
    },
  },
  mounted() {
    this.loadingInstance = this.$loading({
      target: document.getElementById('index-main'),
      text: this.$ui.get('indexLoadingText'),
    });

    chrome.storage.local.get('settings', res => {
      const settings = res.settings || {};
      Object.assign(this.settings, settings);
      this.loadBookmarks();
    });
  },
};
</script>

<style lang="scss">
body {
  overflow: hidden;
}
#index-app {
  :focus {
    outline: 0;
  }
  .index-container {
    height: 97vh;
  }
  .index-header {
    background-color: rgb(75, 114, 187);
    .filter-input {
      width: 50%;
      margin-left: 25px;
    }
  }
  .btn {
    margin-top: 15px;
  }
  .right {
    float: right;
  }
  .custom-tree-node {
    font-size: 16px;
    img {
      height: 1em;
      width: 1em;
    }
  }
  .modal-backgrund {
    background-color: rgba(0, 0, 0, 0.25);
  }
  .el-drawer__body {
    padding: 0px 15px;
    overflow: auto;
  }
  .header-icon {
    margin-right: 10px;
  }
  .extension {
    text-align: center;
    .extension-icon {
      margin: 0px 5px -5px 0px;
    }
    .extension-name {
      font-size: 24px;
    }
  }
}
</style>
