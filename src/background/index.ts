import { downloadTextFile, htmlFileGenerator } from '@/common/tools';

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: './index/index.html',
  });
});

if (import.meta.env.BROWSER === 'firefox') {
  browser.runtime.onInstalled.addListener(() => {
    browser.menus.create({
      id: 'bookmarksMenu',
      type: 'normal',
      contexts: ['bookmark'],
      title: chrome.i18n.getMessage('contextMenuExport'),
    });
  });

  browser.menus.onClicked.addListener(info => {
    const { bookmarkId } = info;
    if (bookmarkId) {
      chrome.storage.local.get('settings', res => {
        const settings = res.settings || {};
        const time = new Date();
        chrome.bookmarks.getSubTree(bookmarkId, async results => {
          downloadTextFile(
            await htmlFileGenerator(results, settings),
            `bookmarks_${time.getFullYear().toString()}_${(time.getMonth() + 1).toString()}_${time.getDate().toString()}.html`
          );
        });
      });
    }
  });
}
