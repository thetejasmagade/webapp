import ProModal from '@/components/ProModal.vue';

export default {
  install(Vue) {
    ProModal.EventBus = new Vue();
    this.EventBus = ProModal.EventBus;
    Vue.component('ProModalPlugin', ProModal);
    Vue.prototype.$proModal = {
      show(params) {
        ProModal.EventBus.$emit('show', params);
      },
      hide(params) {
        ProModal.EventBus.$emit('hide', params);
      }
    };
  }
};

