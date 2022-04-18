<template>
  <nav class="bg-gray-800 z-50 border-b border-gray-600">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 top-nav-bar-height">
      <div class="relative flex items-center justify-between h-full">
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
          class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-evenly"
        >
          <div class="flex-shrink-0">
            <router-link to="/">
              <div class="flex flex-row items-center">
                <img
                  class="block h-10 w-auto mr-2"
                  src="/src/img/boot_dev_logo_full_256.png"
                  alt="Boot.dev Logo"
                  height="40"
                  width="40"
                />
                <h2 class="text-xl font-bold">
                  Boot<span class="text-blue-400">.dev</span>
                </h2>
              </div>
            </router-link>
          </div>
          <div class="hidden sm:flex sm:ml-6">
            <div class="flex space-x-4 text-sm h-full items-center">
              <router-link
                v-if="!$store.getters.getIsLoggedIn"
                to="/"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded"
              >
                Login
              </router-link>

              <router-link
                to="/courses"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded"
              >
                Courses
              </router-link>

              <router-link
                to="/pricing"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded"
              >
                Pricing
              </router-link>

              <a
                href="https://discord.gg/EEkFwbv"
                target="_blank"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded"
              >
                Community
              </a>

              <a
                href="https://blog.boot.dev/about"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded"
              >
                About
              </a>

              <a
                href="https://blog.boot.dev"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded"
              >
                Blog
              </a>
            </div>
          </div>
          <div class="">
            <div class="hidden md:flex flex-row items-center">
              <img
                class="block h-10 w-auto mr-2"
                src="/src/img/qvault-icon-250.png"
                alt="Qvault Logo"
                width="10"
                height="10"
              />
              <h2 class="text-md mr-2 font-bold">Formerly Qvault.io</h2>
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

<style></style>
