import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Notifications from 'vue-notification';
import VueGtm from 'vue-gtm';

Vue.config.productionTip = false;

Vue.use(Notifications);

Vue.use(VueGtm, {
  id: [
    'GTM-PT7FHFB'
  ],
  defer: true,
  debug: false,
  loadScript: true,
  trackOnNextTick: false
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
