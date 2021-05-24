<template>
  <div class="navs">
    <div class="nav">
      <div class="item-group">
        <div class="item">
          <img
            alt="Qvault logo"
            src="../img/qvault-icon-250.png"
          >
          <span class="title">{{ title }}</span>
        </div>
      </div>
      <div class="item-group desktop">
        <router-link
          v-if="$store.getters.getIsLoggedIn"
          to="/"
          class="item link"
          :class="{current: routePath.includes('dashboard')}"
        >
          <span>Dashboard</span>
        </router-link>
        <router-link
          v-else
          to="/"
          class="item link"
          :class="{current: routeName === 'Login'}"
        >
          <span>Login</span>
        </router-link>

        <router-link
          to="/pricing"
          class="item link"
          :class="{current: routeName === 'Pricing' }"
        >
          <span>Pricing</span>
        </router-link>

        <a
          href="https://discord.gg/k4rVEWt"
          target="_blank"
          class="item link"
        >
          <span>Community</span>
        </a>

        <router-link
          to="/playground/go"
          class="item link"
          :class="{current: routeName === 'Playground' }"
        >
          <span>Playground</span>
        </router-link>  

        <a
          href="https://qvault.io/articles"
          target="_blank"
          class="item link"
        >
          <span>Blog</span>
        </a>
      </div>

      <div class="mobile item-group icon">
        <div
          class="item"
        >
          <FontAwesomeIcon
            :icon="['fa', 'bars']"
            class="text-3xl cursor-pointer"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />
        </div>
      </div>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="mobile"
    >
      <a
        href="/"
        class="item link"
        :class="{current: routePath.includes('dashboard')}"
      >
        <span>Dashboard</span>
      </a>   
      <a
        href="/playground/go"
        class="item link"
        :class="{current: routeName === 'Playground' }"
      >
        <span>Playground</span>
      </a>   
      <a
        href="https://qvault.io/contact"
        target="_blank"
        class="item link"
      >
        <span>Contact</span>
      </a>   
      <a
        href="https://qvault.io/articles"
        target="_blank"
        class="item link"
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

.navs {
  display: flex;
  flex-direction: column;
}

.nav {
  background-color: $gray-darker-2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 15px;
  height: calc(#{$bar-height} - 2px);
  border-bottom: 2px solid $gray-light;

  .item-group {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-end;
  }
}

.mobile {
  display: none !important;
  background-color: $gray-darker-2;
  @media screen and (max-width: $mobile-size) {
    display: block !important;
  }
}

.desktop {
  @media screen and (max-width: $mobile-size) {
    display: none !important;
  }
}

.icon {
  font-size: 1em;
}

.item {
  color: $white;
  text-decoration: none;
  display: flex;
  align-items: center;

  @media screen and (max-width: $mobile-size) {
    padding: .75em;
  }

  @media screen and (min-width: $mobile-size) {
    padding: 0 1em 0 1em;
    border-radius: 5px;
    margin: .75em .5em .75em .5em;
  }

  &.link {
    cursor: pointer;

    &.current {
      color: $gray-darker;
      background-color: $gold-light;
    }

    &:hover{
      color: $gray-darker;
      background-color: $gold-mid;
    }
  }

  img {
    vertical-align: middle;
    width: 40px;
    height: 40px;
    margin-left: .5em;
  }

  .title {
    font-size: 1.2em;
    margin-left: 1em;
  }
}
</style>
