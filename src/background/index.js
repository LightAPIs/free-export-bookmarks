import tools from '../commons/tools.js';

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({
    url: './index.html',
  });
});

if (process.env.VUE_APP_TITLE === 'firefox') {
  chrome.contextMenus.create({
    id: 'bookmarksMenu',
    type: 'normal',
    contexts: ['bookmark'],
    title: chrome.i18n.getMessage('contextMenuExport'),
    onclick: info => {
      if (!chrome.runtime.lastError) {
        const { bookmarkId } = info;
        if (bookmarkId) {
          chrome.storage.local.get('settings', res => {
            const settings = res.settings || {};
            const time = new Date();
            chrome.bookmarks.getSubTree(bookmarkId, async results => {
              tools.downloadTextFile(
                await tools.createHtmlFile(results, settings),
                `bookmarks_${time.getFullYear().toString()}_${(time.getMonth() + 1).toString()}_${time.getDate().toString()}.html`
              );
            });
          });
        }
      }
    },
  });
}
