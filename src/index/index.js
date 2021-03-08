import ui from '../commons/ui';
import tools from '../commons/tools';
import Vue from 'vue';
import App from './App/App.vue';
import {
  Button,
  Collapse,
  CollapseItem,
  Container,
  Divider,
  Drawer,
  Header,
  Input,
  Loading,
  Main,
  Message,
  Progress,
  Switch,
  Tooltip,
  Tree,
} from 'element-ui';

Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Button);
Vue.use(Tree);
Vue.use(Drawer);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Switch);
Vue.use(Divider);
Vue.use(Tooltip);
Vue.use(Input);
Vue.use(Progress);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$ui = ui;
Vue.prototype.$tools = tools;
Vue.prototype.$message = Message;
Vue.config.productionTip = false;

document.title = ui.get('indexTitle');

new Vue({
  el: '#index-app',
  components: {
    App,
  },
  render(h) {
    return h(App);
  },
});
