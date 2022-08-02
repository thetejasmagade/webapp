<template>
  <div>
    <div class="flex flex-col justify-evenly w-full items-center">
      <div class="mb-12 mt-4 w-60">
        <BlockButton
          :disabled="!isReady"
          :click="onLoginClick"
          color="blue"
          class="w-full mb-4"
        >
          <FontAwesomeIcon :icon="['fab', 'google']" class="mr-3" />
          Sign in with Google
        </BlockButton>

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
import { useOneTap } from "vue3-google-signin";

import { loginGoogle } from "@/lib/cloudClient.js";
import { eventRegister, singupMethodGoogle } from "@/lib/analytics.js";
import { notify } from "@/lib/notification.js";

import { loadLoggedIn } from "@/lib/cloudStore.js";

import { getLoginWithGithubURL } from "@/lib/cloudClient.js";
import { reactive, toRefs } from "vue";
import { saveRegisterIsSubscribedNews } from "@/lib/localStorageLib.js";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

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

    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const beforeIntegration = () => {
      if (!state.tosAccepted) {
        notify({
          type: "danger",
          text: "You need to accept the terms of service",
        });
        return;
      }
    };
    const onGoogleFailure = async () => {
      notify({
        type: "danger",
        text: "Couldn't log in with Google",
      });
    };

    const onGoogleSuccess = async (googleUser) => {
      try {
        const resp = await loginGoogle(
          googleUser.credential,
          state.subscribeNews,
          route.query.ruid
        );
        loadLoggedIn(store.commit);
        if (resp.registered) {
          eventRegister(singupMethodGoogle);
          router.push({
            name: "SignupFlow",
            query: { redirect: route.query.redirect },
          });
          return;
        }
        router.push({
          name: "Tracks",
          query: { redirect: route.query.redirect },
        });
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const onLoginClick = () => {
      console.log("Button Clicked");
      login();
    };

    const { isReady, login } = useOneTap({
      disableAutomaticPrompt: true,
      onSuccess: (response) => {
        console.log("Success:", response);
        onGoogleSuccess(response);
      },
      onError: (err) => console.log(`Error Logged: ${err}`),
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
      onGoogleSuccess,
      onGoogleFailure,
      clickGithub,
      beforeIntegration,
      isReady,
      onLoginClick,
    };
  },
};
</script>

<style scoped></style>
