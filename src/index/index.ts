import i18n from '@/common/i18n';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

document.title = i18n('indexTitle');
const isChromium = import.meta.env.IS_CHROMIUM;

const pinia = createPinia();
pinia.use(({ store }) => {
  store.$subscribe((mutation, state) => {
    if (mutation.storeId === 'settings' && mutation.type === 'direct') {
      chrome.storage.local.set({
        settings: isChromium ? state : Object.assign({}, state),
      });
    }
  });
});

const app = createApp(App);
app.use(pinia);
app.mount('#app');
