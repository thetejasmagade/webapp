<template>
  <div>
    <div class="flex flex-col justify-evenly w-full items-center">
      <div class="mb-12 mt-4 w-60">
        <div ref="googleSignin" class="w-full mb-4 hover:opacity-90"></div>
        <BlockButton :click="clickGithub" color="gray" class="w-full">
          <FontAwesomeIcon :icon="['fab', 'github']" class="mr-3" />
          Sign in with Github
        </BlockButton>
      </div>

      <div
        class="mb-2 flex flex-row items-center justify-center text-sm text-gray-400 leading-none"
      >
        <ToggleSwitch v-model="subscribeNews" />
        <span class="flex-1 ml-2">Get the no-spam newsletter</span>
      </div>

      <div
        class="mb-4 flex flex-row items-center justify-center text-sm text-gray-400 leading-none"
      >
        <ToggleSwitch v-model="tosAccepted" />
        <span class="flex-1 ml-2">
          I've read and agree to the
          <a
            class="underline cursor-pointer text-blue-400 hover:text-blue-300"
            href="https://blog.boot.dev/terms"
          >
            terms
          </a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import BlockButton from "@/components/BlockButton.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { getLoginWithGithubURL } from "@/lib/cloudClient.js";
import { reactive, toRefs, ref, onMounted } from "vue";
import { saveRegisterIsSubscribedNews } from "@/lib/localStorageLib.js";
import { useRoute } from "vue-router";

export default {
  components: {
    BlockButton,
    ToggleSwitch,
    FontAwesomeIcon,
  },
  setup() {
    const state = reactive({
      state: "register",
      email: null,
      firstName: null,
      lastName: null,
      password: null,
      passwordConfirm: null,
      subscribeNews: true,
      tosAccepted: true,
      validationCode: null,
    });

    const googleSignin = ref(null);
    const route = useRoute();

    onMounted(async () => {
      window.google?.accounts.id.renderButton(
        googleSignin.value,
        { theme: "outline", size: "large", width: 240 } // customization attributes
      );
    });

    const clickGithub = async () => {
      if (state.subscribeNews) {
        saveRegisterIsSubscribedNews();
      }
      window.location.replace(
        getLoginWithGithubURL(state.isSubscribedNews, route.query.ruid)
      );
    };

    return {
      ...toRefs(state),
      clickGithub,
      googleSignin,
    };
  },
};
</script>

<style scoped></style>
