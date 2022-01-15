<template>
  <div>
    <div
      class="
      block
      list-none
      m-0
      p-0
    "
    >
      <router-link
        v-if="$store.getters.getIsLoggedIn"
        class="
          text-gray-700
          py-3
          px-4
          rounded-t
          mr-2
          inline-block
          cursor-pointer
        "
        :class="{
          'bg-white': routePath.includes('browse'),
          'bg-gray-300': !routePath.includes('browse')
        }"
        :to="{ name: 'Browse'}"
      >
        <FontAwesomeIcon
          icon="search"
          class="
            md:mr-4
            mx-2
          "
        />
        <span
          class="
            md:inline-block
            hidden
          "
        >
          All courses
        </span>
      </router-link>
      <router-link
        v-if="$store.getters.getIsLoggedIn"
        class="
          text-gray-700
          py-3
          px-4
          rounded-t
          mr-2
          inline-block
          cursor-pointer
        "
        :class="{
          'bg-white': routePath.includes('algos-track'),
          'bg-gray-300': !routePath.includes('algos-track')
        }"
        :to="{ name: 'AlgosTrack'}"
      >
        <FontAwesomeIcon
          :icon="['fab', 'python']"
          class="
            md:mr-4
            mx-2
          "
        />
        <span
          class="
            md:inline-block
            hidden
          "
        >
          Algorithms track
        </span>
      </router-link>
      <router-link
        v-if="$store.getters.getIsLoggedIn"
        class="
          text-gray-700
          py-3
          px-4
          rounded-t
          mr-2
          inline-block
          cursor-pointer
        "
        :class="{
          'bg-white': routePath.includes('cs-track'),
          'bg-gray-300': !routePath.includes('cs-track')
        }"
        :to="{ name: 'CSTrack'}"
      >
        <FontAwesomeIcon
          icon="graduation-cap"
          class="
            md:mr-4
            mx-2
          "
        />
        <span
          class="
            md:inline-block
            hidden
          "
        >
          CompSci track
        </span>
      </router-link>
      <router-link
        v-if="$store.getters.getIsLoggedIn"
        class="
          text-gray-700
          py-3
          px-4
          rounded-t
          mr-2
          inline-block
          cursor-pointer
        "
        :class="{
          'bg-white': routePath.includes('golang-track'),
          'bg-gray-300': !routePath.includes('golang-track')
        }"
        :to="{ name: 'GolangTrack'}"
      >
        <FontAwesomeIcon
          :icon="['fab', 'golang']"
          class="
            md:mr-4
            mx-2
          "
        />
        <span
          class="
            md:inline-block
            hidden
          "
        >
          Gopher gang track
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

<style scoped>
</style>
