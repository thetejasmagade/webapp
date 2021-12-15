<template>
  <div class="tabs">
    <div class="tabs-header">
      <router-link
        v-if="$store.getters.getIsLoggedIn"
        class="tabs-tab"
        :class="{'tab-selected': routePath.includes('algos-track')}"
        to="/dashboard/courses/algos-track"
      >
        <FontAwesomeIcon
          :icon="['fab', 'python']"
          class="icon"
        />
        <span
          class="desktop"
        >
          Algorithms Track
        </span>
      </router-link>
      <router-link
        v-if="$store.getters.getIsLoggedIn"
        class="tabs-tab"
        :class="{'tab-selected': routePath.includes('cs-track')}"
        to="/dashboard/courses/cs-track"
      >
        <FontAwesomeIcon
          icon="graduation-cap"
          class="icon"
        />
        <span
          class="desktop"
        >
          CompSci Track
        </span>
      </router-link>
      <router-link
        v-if="$store.getters.getIsLoggedIn"
        class="tabs-tab"
        :class="{'tab-selected': routePath.includes('golang-track')}"
        to="/dashboard/courses/golang-track"
      >
        <FontAwesomeIcon
          :icon="['fab', 'golang']"
          class="icon"
        />
        <span
          class="desktop"
        >
          Gopher Gang Track
        </span>
      </router-link>
      <router-link
        v-if="$store.getters.getIsLoggedIn"
        class="tabs-tab"
        :class="{'tab-selected': routePath.includes('browse')}"
        to="/dashboard/courses/browse"
      >
        <FontAwesomeIcon
          icon="search"
          class="icon"
        />
        <span
          class="desktop"
        >
          All Courses
        </span>
      </router-link>
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

.tabs-header {
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tabs-tab {
  background-color: $gray-lighter;
  color: $gray-darker;
  padding: 15px 30px;
  @media screen and (max-width: $mobile-size) {
    padding: 10px 20px;
  }
  border-radius: 3px 3px 0 0;
  margin: 0 5px 0 0;
  display: inline-block;
  cursor: pointer;

  &.tab-selected {
    background-color: white
  }
}

.icon {
  margin: 0 10px 0 0;
  @media screen and (max-width: $mobile-size) {
    margin: 0 5px 0 5px;
  }
}

.desktop {
  display: none !important;
  @media screen and (min-width: $mobile-size) {
    display: inline-block !important;
  }
}

</style>
