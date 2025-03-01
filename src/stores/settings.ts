import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    showIcon: false,
    autoExpandAll: false,
    includeIcon: false,
    includeDate: false,
    noOtherBookmarks: false,
    noParentFolders: false,
    saveAs: false,
  }),

  actions: {
    async read() {
      const res = await chrome.storage.local.get('settings');
      this.$patch(res.settings || {});
    },
  },
});
