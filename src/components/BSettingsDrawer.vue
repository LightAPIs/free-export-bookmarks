<template>
  <el-drawer v-model="open" :title="i18n('indexDrawerTitle')">
    <el-collapse v-model="activeName">
      <el-collapse-item name="display">
        <template #title>
          <el-icon class="bookmarks-header-icon">
            <view-icon></view-icon>
          </el-icon>
          {{ i18n('indexDrawerDisplayTitle') }}
        </template>
        <el-divider></el-divider>

        <template v-if="isChromium">
          <div>
            <el-switch v-model="showIcon" :active-text="i18n('indexDrawerDisplayShowIconText')"></el-switch>
          </div>
          <el-divider></el-divider>
        </template>

        <div>
          <el-switch v-model="autoExpandAll" :active-text="i18n('indexDrawerDisplayAutoExpandAllText')"></el-switch>
        </div>
        <p>{{ i18n('indexDrawerDisplayAutoExpandAllTip') }}</p>
        <el-divider></el-divider>
      </el-collapse-item>

      <el-collapse-item name="export">
        <template #title>
          <el-icon class="bookmarks-header-icon">
            <files></files>
          </el-icon>
          {{ i18n('indexDrawerExportTitle') }}
        </template>
        <el-divider></el-divider>

        <template v-if="isChromium">
          <div>
            <el-switch v-model="includeIcon" :active-text="i18n('indexDrawerExportIncludeIconText')"></el-switch>
          </div>
          <p>{{ i18n('indexDrawerExportIncludeIconTip') }}</p>
          <el-divider></el-divider>
        </template>

        <div>
          <el-switch v-model="includeDate" :active-text="i18n('indexDrawerExportIncludeDateText')"></el-switch>
        </div>
        <el-divider></el-divider>

        <div>
          <el-switch
            v-model="noOtherBookmarks"
            :active-text="isChromium ? i18n('indexDrawerExportNoOtherBookmarksText') : i18n('indexDrawerExportNoOtherBookmarksTextFirefox')"
          ></el-switch>
        </div>
        <p>{{ isChromium ? i18n('indexDrawerExportNoOtherBookmarksTip') : i18n('indexDrawerExportNoOtherBookmarksTipFirefox') }}</p>
        <el-divider></el-divider>

        <div>
          <el-switch v-model="noParentFolders" :active-text="i18n('indexDrawerExportNoParentFoldersText')"></el-switch>
        </div>
        <p>{{ isChromium ? i18n('indexDrawerExportNoParentFoldersTip') : i18n('indexDrawerExportNoParentFoldersTipFirefox') }}</p>
        <el-divider></el-divider>
      </el-collapse-item>

      <el-collapse-item name="about">
        <template #title>
          <el-icon class="bookmarks-header-icon">
            <info-filled></info-filled>
          </el-icon>
          {{ i18n('indexDrawerAboutTitle') }}
        </template>
        <el-divider></el-divider>

        <div class="bookmarks-extension">
          <img class="bookmarks-extension-icon" src="@/img/icon-24.png" />
          <span class="bookmarks-extension-name">{{ i18n('extensionName') + ' v' + version }}</span>
        </div>

        <el-divider content-position="left">
          {{ i18n('indexDrawerAboutSupportText') }}
        </el-divider>

        <div>
          <p>{{ i18n('indexDrawerAboutSupportLabel') }}</p>
          <ul>
            <li v-for="(item, index) in support" :key="index">
              <a :href="item.url" target="_blank">{{ item.title }}</a>
            </li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-drawer>
</template>

<script setup lang="ts">
import i18n from '@/common/i18n';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import { View as ViewIcon, Files, InfoFilled } from '@element-plus/icons-vue';

const isChromium = import.meta.env.IS_CHROMIUM;
const version = import.meta.env.VERSION;

const support = [
  {
    title: i18n('indexDrawerAboutSourceCodeText'),
    url: 'https://github.com/LightAPIs/free-export-bookmarks',
  },
  {
    title: i18n('indexDrawerAboutFeedbackText'),
    url: 'https://github.com/LightAPIs/free-export-bookmarks/issues',
  },
];

const settingsStore = useSettingsStore();
const { showIcon, autoExpandAll, includeIcon, includeDate, noOtherBookmarks, noParentFolders } = storeToRefs(settingsStore);

const open = defineModel<boolean>('open', {
  default: false,
});

const activeName = ref<string[]>([]);
</script>

<style>
.bookmarks-header-icon {
  margin-right: 10px;
}

.bookmarks-extension {
  text-align: center;
}

.bookmarks-extension-icon {
  margin: 0 5px -5px 0;
}

.bookmarks-extension-name {
  font-size: 24px;
}
</style>
