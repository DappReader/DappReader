import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import JsonViewer from 'vue-json-viewer'
import Vuex from 'vuex'
import store from '@/store/store.js'
import rightMenu from "vue-right-click-menu";
import './assets/css/reset.scss'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(JsonViewer);
Vue.use(rightMenu);
new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app')
