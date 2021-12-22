<template>
  <div>
    <TopNav />
    <div
      class="
        flex
        h-full-minus-bar
      "
    >
      <Sidebar
        :path-name="routeName"
        :route-path="routePath"
        class="
          inline-block
          align-top
          w-20"
      />

      <div
        class="
        align-top
        h-full
        overflow-auto
        flex-1
        flex
        flex-col
      "
      >
        <router-view
          :key="routePath"
          class="router-view"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue';
import Sidebar from '@/components/Sidebar.vue';
import { useRoute } from 'vue-router';

import {
  loadTracks,
  loadBalance,
  loadUser
} from '@/lib/cloudStore.js';

export default {
  components: {
    Sidebar,
    TopNav
  },
  computed: {
    routePath(){
      return useRoute().path;
    },
    routeName(){
      return useRoute().name;
    },
    routeQuery(){
      return useRoute().query.redirect;
    }
  },
  async mounted(){
    if (this.routeQuery){
      this.$router.push({path: this.routeQuery});
    }

    loadTracks(this);
    if (!this.$store.getters.getUser){
      loadUser(this);
    }
    loadBalance(this);
  }
};
</script>

<style scoped>
.h-full-minus-bar {
  height: calc(100vh - var(--top-nav-bar-height));
}
</style>
