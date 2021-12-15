<template>
  <div class="bg-white shadow flex flex-col text-gray-700 relative z-50">
    <div class="nav flex flex-row justify-between">
      <div class="flex flex-row items-stretch justify-end">
        <div class="ml-3 flex items-center">
          <img
            alt="Qvault logo"
            src="../img/qvault-icon-250.png"
            class="align-middle w-10 h-10 ml-2"
          >
          <span class="text-xl ml-4">{{ title }}</span>
        </div>
      </div>
      <div class="flex flex-row items-stretch justify-end desktop">
        <router-link
          v-if="$store.getters.getIsLoggedIn"
          to="/"
          class="item px-4 m-2"
          :class="{current: routePath.includes('dashboard')}"
        >
          <span>Dashboard</span>
        </router-link>
        <router-link
          v-else
          to="/"
          class="item px-4 m-2"
          :class="{current: routeName === 'Login'}"
        >
          <span>Login</span>
        </router-link>

        <router-link
          to="/pricing"
          class="item px-4 m-2"
          :class="{current: routeName === 'Pricing' }"
        >
          <span>Pricing</span>
        </router-link>

        <a
          href="https://discord.gg/k4rVEWt"
          target="_blank"
          class="item px-4 m-2"
        >
          <FontAwesomeIcon
            :icon="['fab', 'discord']"
            class="icon mr-2"
          />
          <span>Community</span>
        </a>

        <a
          href="https://qvault.io/articles"
          target="_blank"
          class="item px-4 m-2"
        >
          <span>Blog</span>
        </a>
      </div>

      <div class="mobile bg-white flex flex-row items-stretch justify-end p-4">
        <FontAwesomeIcon
          :icon="['fa', 'bars']"
          class="text-3xl cursor-pointer"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="mobile bg-white"
    >
      <a
        href="/"
        class="item"
        :class="{current: routePath.includes('dashboard')}"
      >
        <span>Dashboard</span>
      </a>   
      <a
        href="/pricing"
        class="item"
        :class="{current: routeName === 'Pricing' }"
      >
        <span>Pricing</span>
      </a> 
      <a
        href="https://discord.gg/k4rVEWt"
        target="_blank"
        class="item"
      >
        <FontAwesomeIcon
          :icon="['fab', 'discord']"
          class="icon mr-2"
        />
        <span>Community</span>
      </a>   
      <a
        href="https://qvault.io/articles"
        target="_blank"
        class="item"
      >
        <span>Blog</span>
      </a>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRoute } from 'vue-router';

export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    title: {
      default: null,
      required: false,
      type: String
    }
  },
  data(){
    return {
      mobileMenuOpen: false
    };
  },
  computed:{
    routePath(){
      return useRoute().path;
    },
    routeName(){
      return useRoute().name;
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.nav {
  height: var(--top-nav-bar-height);
}

.mobile {
  display: none !important;
  @media screen and (max-width: $mobile-size) {
    display: block !important;
  }
}

.desktop {
  @media screen and (max-width: $mobile-size) {
    display: none !important;
  }
}

.item {
  text-decoration: none;
  display: flex;
  align-items: center;
  color: $gray-darker;

  @media screen and (max-width: $mobile-size) {
    padding: .75em;
  }

  @media screen and (min-width: $mobile-size) {
    border-radius: 5px;
  }

  &.current {
    border: solid 1px $gold-mid;
  }

  &:hover{
    color: $gray-lightest;
    background-color: $gold-mid;
  }
}
</style>
