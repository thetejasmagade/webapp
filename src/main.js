import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import GoogleSignInPlugin from "vue3-google-signin";
import { createMetaManager } from "vue-meta";
import { init } from "@/lib/analytics.js";
import "mosha-vue-toastify/dist/style.css";

const main = async () => {
  init();

  const app = createApp(App);
  app.use(GoogleSignInPlugin, {
    clientId:
      "44792168937-cm11c7cfa2co3pov1rt7p8r4keiee9cl.apps.googleusercontent.com",
    scope: "profile email",
    prompt: "select_account",
  });
  app.use(store);
  app.use(router);
  app.use(createMetaManager());
  await router.isReady();
  app.mount("#app");
};

main();
