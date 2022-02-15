import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import gAuth from "vue3-google-auth";
import { createMetaManager } from "vue-meta";
import { init } from "@/lib/analytics.js";
import "mosha-vue-toastify/dist/style.css";

init();

const $gAuth = gAuth.createGAuth({
  clientId:
    "44792168937-cm11c7cfa2co3pov1rt7p8r4keiee9cl.apps.googleusercontent.com",
  scope: "profile email",
  prompt: "select_account",
});

const app = createApp(App);
app.use(store);
app.use(router);
app.use($gAuth);
app.use(createMetaManager());
app.mount("#app");
