<template>
  <ViewNavWrapper>
    <div
      class="p-4"
    >
      <TabsNav />
      <router-view />
    </div>
  </ViewNavWrapper>
</template>

<script>
import TabsNav from '@/components/TabsNav.vue';
import ViewNavWrapper from '@/components/ViewNavWrapper.vue';
import { 
  loadAllInterests
} from '@/lib/cloudStore.js';
import { useRoute } from 'vue-router';

import {
  loadTracks
} from '@/lib/cloudStore.js';

export default {
  components: {
    TabsNav,
    ViewNavWrapper
  },
  computed: {
    routeQuery(){
      return useRoute().query.redirect;
    }
  },
  async mounted(){
    if (this.routeQuery){
      this.$router.push({path: this.routeQuery});
    }
    loadTracks(this);
    loadAllInterests(this);
  }
};
</script>

<style scoped>
</style>
