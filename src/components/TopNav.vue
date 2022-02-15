<template>
  <div class="bg-white shadow flex flex-col text-gray-700 relative z-50">
    <div class="top-nav-bar-height flex flex-row justify-between">
      <div class="flex flex-row items-stretch justify-end">
        <div class="ml-3 flex items-center">
          <router-link to="/">
            <img
              loading="lazy"
              alt="Qvault logo"
              src="../img/qvault-icon-250.png"
              class="align-middle w-10 h-10 ml-2"
            />
          </router-link>
          <span class="text-xl ml-10">{{ title }}</span>
        </div>
      </div>
      <div class="md:flex flex-row items-stretch justify-end hidden">
        <router-link
          v-if="!$store.getters.getIsLoggedIn"
          to="/"
          class="flex items-center px-4 m-2 rounded text-gray-700 hover:text-gray-200 hover:bg-gold-500 current:border current:border-gold-500"
          :class="{
            border: routePath === '/',
            'border-gold-500': routePath === '/',
          }"
        >
          <span>Login</span>
        </router-link>

        <router-link
          to="/courses"
          class="flex items-center px-4 m-2 rounded text-gray-700 hover:text-gray-200 hover:bg-gold-500 current:border current:border-gold-500"
          :class="{
            border: routePath.includes('courses'),
            'border-gold-500': routePath.includes('courses'),
          }"
        >
          <span>Courses</span>
        </router-link>

        <router-link
          to="/pricing"
          class="flex items-center px-4 m-2 rounded text-gray-700 hover:text-gray-200 hover:bg-gold-500 current:border current:border-gold-500"
          :class="{
            border: routePath.includes('pricing'),
            'border-gold-500': routePath.includes('pricing'),
          }"
        >
          <span>Pricing</span>
        </router-link>

        <a
          href="https://discord.gg/k4rVEWt"
          target="_blank"
          class="flex items-center px-4 m-2 rounded text-gray-700 hover:text-gray-200 hover:bg-gold-500 current:border current:border-gold-500"
        >
          <FontAwesomeIcon :icon="['fab', 'discord']" class="icon mr-2" />
          <span>Community</span>
        </a>

        <a
          href="https://qvault.io/method"
          target="_blank"
          class="flex items-center px-4 m-2 rounded text-gray-700 hover:text-gray-200 hover:bg-gold-500 current:border current:border-gold-500"
        >
          <span>Method</span>
        </a>

        <a
          href="https://qvault.io/articles"
          target="_blank"
          class="flex items-center px-4 m-2 rounded text-gray-700 hover:text-gray-200 hover:bg-gold-500 current:border current:border-gold-500"
        >
          <span>Blog</span>
        </a>
      </div>

      <div
        class="md:hidden bg-white flex flex-row items-stretch justify-end p-4"
      >
        <FontAwesomeIcon
          :icon="['fa', 'bars']"
          class="text-3xl cursor-pointer"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="md:hidden block bg-white">
      <a
        v-if="!$store.getters.getIsLoggedIn"
        href="/"
        class="flex items-center p-3 text-gray-700 hover:text-gray-200 hover:bg-gold-500"
      >
        <span>Login</span>
      </a>
      <a
        href="/courses"
        class="flex items-center p-3 text-gray-700 hover:text-gray-200 hover:bg-gold-500"
      >
        <span>Courses</span>
      </a>
      <a
        href="/pricing"
        class="flex items-center p-3 text-gray-700 hover:text-gray-200 hover:bg-gold-500"
      >
        <span>Pricing</span>
      </a>
      <a
        href="https://discord.gg/k4rVEWt"
        target="_blank"
        class="flex items-center p-3 text-gray-700 hover:text-gray-200 hover:bg-gold-500"
      >
        <FontAwesomeIcon :icon="['fab', 'discord']" class="icon mr-2" />
        <span>Community</span>
      </a>
      <a
        href="https://qvault.io/method"
        target="_blank"
        class="flex items-center p-3 text-gray-700 hover:text-gray-200 hover:bg-gold-500"
      >
        <span>Method</span>
      </a>
      <a
        href="https://qvault.io/articles"
        target="_blank"
        class="flex items-center p-3 text-gray-700 hover:text-gray-200 hover:bg-gold-500"
      >
        <span>Blog</span>
      </a>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRoute } from "vue-router";

export default {
  components: {
    FontAwesomeIcon,
  },
  props: {
    title: {
      default: null,
      required: false,
      type: String,
    },
  },
  data() {
    return {
      mobileMenuOpen: false,
    };
  },
  computed: {
    routePath() {
      return useRoute().path;
    },
    routeName() {
      return useRoute().name;
    },
  },
};
</script>

<style scoped>
.top-nav-bar-height {
  height: var(--top-nav-bar-height);
}
</style>
