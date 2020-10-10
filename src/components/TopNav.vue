<template>
  <div id="navs">
    <div id="nav">
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
          :class="{current: $router.currentRoute.fullPath.includes('dashboard')}"
        >
          <span>Dashboard</span>
        </router-link>
        <router-link
          v-else
          to="/"
          class="item link"
          :class="{current: $router.currentRoute.name === 'Login'}"
        >
          <span>Login</span>
        </router-link>

        <router-link
          to="/playground/go"
          class="item link"
          :class="{current: $router.currentRoute.name === 'Playground' }"
        >
          <span>Playground</span>
        </router-link>  

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

      <div class="mobile item-group icon">
        <div
          class="item"
        >
          <FontAwesomeIcon
            icon="bars"
            class="item"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />
        </div>
      </div>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="dropdown mobile"
    >
      <a
        href="/"
        class="item link"
        :class="{current: $router.currentRoute.fullPath.includes('dashboard')}"
      >
        <span>Dashboard</span>
      </a>   
      <a
        href="/playground/go"
        class="item link"
        :class="{current: $router.currentRoute.name === 'Playground' }"
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
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

#navs {
  display: flex;
  flex-direction: column;
}

#nav {
  background-color: $gray-darkest;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 15px;
  height: $bar-height;

  .item-group {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-end;
  }
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

.icon {
  font-size: 1em;
}

.item {
  color: $white;
  text-decoration: none;
  display: flex;
  align-items: center;
  background-color: $gray-darkest;

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
      background-color: $gold-lighter;
    }

    &:hover{
      color: $gray-darker;
      background-color: $gold-light;
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
