<template>
  <nav class="bg-gray-800 z-50">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 top-nav-bar-height">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
            @click="clickMobileMenuToggle"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              class="hidden h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/">
              <img
                class="block lg:hidden h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                alt="Workflow"
              />
              <img
                class="hidden lg:block h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                alt="Workflow"
              />
            </router-link>
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <router-link
                v-if="!$store.getters.getIsLoggedIn"
                to="/"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </router-link>

              <router-link
                to="/courses"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Courses
              </router-link>

              <router-link
                to="/pricing"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Pricing
              </router-link>

              <a
                href="https://discord.gg/EEkFwbv"
                target="_blank"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Community
              </a>

              <a
                href="https://blog.boot.dev/about"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </a>

              <a
                href="https://blog.boot.dev"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      id="mobile-menu"
      :class="{ hidden: !mobileMenuOpen, block: mobileMenuOpen }"
      class="sm:hidden"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          v-if="!$store.getters.getIsLoggedIn"
          to="/"
          class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
          aria-current="page"
        >
          Login
        </router-link>

        <router-link
          to="/courses"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Courses
        </router-link>

        <router-link
          to="/pricing"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Pricing
        </router-link>

        <a
          href="https://discord.gg/EEkFwbv"
          target="_blank"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Community
        </a>

        <a
          href="https://blog.boot.dev/about"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          About
        </a>

        <a
          href="https://blog.boot.dev/about"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Blog
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { toRefs, reactive } from "vue";

export default {
  props: {
    title: {
      default: null,
      required: false,
      type: String,
    },
  },
  setup() {
    const state = reactive({
      mobileMenuOpen: false,
    });

    const clickMobileMenuToggle = () => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    };

    return {
      ...toRefs(state),
      clickMobileMenuToggle,
    };
  },
};
</script>

<style scoped>
.top-nav-bar-height {
  height: var(--top-nav-bar-height);
}
</style>
