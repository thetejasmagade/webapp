import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import { createMetaManager } from "vue-meta";
import { init } from "@/lib/analytics.js";
import "mosha-vue-toastify/dist/style.css";

const main = async () => {
  init();

  const app = createApp(App);
  app.use(store);
  app.use(router);
  app.use(createMetaManager());
  await router.isReady();
  app.mount("#app");
};

main();
