<template>
  <div class="login-container flex flex-col h-screen">
    <div class="nav-container">
      <TopNav />
    </div>

    <div class="grid place-items-center mx-2 my-20 sm:my-auto">
      <div
        class="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 px-6 py-10 sm:px-10 sm:py-6 bg-gray-800 rounded-lg mb-8"
      >
        <img
          loading="lazy"
          alt="Qvault logo"
          src="../img/qvault-icon-250.png"
          class="mx-auto w-24 mb-3"
        />

        <h2 class="text-center font-semibold mb-2 text-2xl">
          Learn coding concepts that
          <span class="font-bold text-blue-400">get you hired</span>
        </h2>

        <h3 class="text-center text-gray-500 mb-3">
          Create a free account to track your progress
        </h3>

        <div v-if="state === 'integration'">
          <IntegrationLoginForm />
          <div class="text-center">
            <p>
              Don't like integrations?
              <a
                class="underline cursor-pointer text-blue-400 hover:text-blue-300"
                @click="state = 'register'"
              >
                Use Magic Link
              </a>
            </p>
          </div>
        </div>

        <div v-if="state === 'register'">
          <MagicLinkRegister />
          <div class="text-center">
            <p>
              Have an integration?
              <a
                class="underline cursor-pointer text-blue-400 hover:text-blue-300"
                @click="state = 'integration'"
              >
                Single Sign-On
              </a>
            </p>
            <p>
              Have an account?
              <a
                class="underline cursor-pointer text-blue-400 hover:text-blue-300"
                @click="state = 'login'"
              >
                Login
              </a>
            </p>
          </div>
        </div>

        <div v-if="state === 'login'">
          <MagicLinkLogin />
          <div class="text-center">
            <p>
              Need an account?
              <a
                class="underline cursor-pointer text-blue-400 hover:text-blue-300"
                @click="state = 'register'"
              >
                Sign Up Free
              </a>
            </p>
            <p>
              Have an integrated account?
              <a
                class="underline cursor-pointer text-blue-400 hover:text-blue-300"
                @click="state = 'integration'"
              >
                Single Sign-On
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginToken, getUser, updateUserCache } from "@/lib/cloudClient.js";
import { eventRegister, singupMethodGithub } from "@/lib/analytics.js";

import { loadLoggedIn } from "@/lib/cloudStore.js";
import { notify } from "@/lib/notification.js";

import MagicLinkLogin from "@/components/MagicLinkLogin.vue";
import MagicLinkRegister from "@/components/MagicLinkRegister.vue";
import IntegrationLoginForm from "@/components/IntegrationLoginForm.vue";
import TopNav from "@/components/TopNav.vue";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";

export default {
  components: {
    MagicLinkRegister,
    IntegrationLoginForm,
    MagicLinkLogin,
    TopNav,
  },
  data() {
    return {
      state: "integration",
    };
  },
  async mounted() {
    if (this.$route.query.error) {
      notify({
        type: "danger",
        text: this.$route.query.error,
      });
    }
    if (this.$route.query.auth_token) {
      try {
        loginToken(this.$route.query.auth_token);
        // just make sure token works
        await getUser();

        if (this.$route.query.new_user === "true") {
          try {
            updateUserCache();
            eventRegister(singupMethodGithub);
            loadLoggedIn(this);
            this.$router.push({
              name: "SignupFlowCode",
              query: { redirect: this.$route.query.redirect },
            });
            return;
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    }

    loadLoggedIn(this);
    if (
      this.$store.getters.getIsLoggedIn &&
      this.$store.getters.getIsEmailVerified
    ) {
      this.$router.push({
        name: "Courses",
        query: { redirect: this.$route.query.redirect },
      });
    }

    const computedMeta = getComputedMeta({
      title: "Login",
      description:
        "Login or sign up for Qvault's computer science and coding courses. All my courses are free to audit, get started today.",
      image:
        "https://qvault.io/wp-content/uploads/2021/04/qvault-social-banner.jpg",
    });
    useMeta(computedMeta);
  },
};
</script>

<style scoped></style>
