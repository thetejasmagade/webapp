import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Notifications from 'vue-notification';
import ProModalPlugin from '@/plugins/ProModal';

Vue.use(ProModalPlugin);

Vue.config.productionTip = false;

Vue.use(Notifications);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
