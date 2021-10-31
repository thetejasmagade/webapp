<template>
  <div
    class="courses-page"
  >
    <LoadingOverlay
      :is-loading="isLoading" 
    />
    <div
      v-if="!isLoading"
      class="subcontainer"
    >
      <TabsNav />
      <router-view />
    </div>
  </div>
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import TabsNav from '@/components/TabsNav.vue';
import { useRoute } from 'vue-router';

import {
  loadUser
} from '@/lib/cloudStore.js';

export default {
  components: {
    LoadingOverlay,
    TabsNav
  },
  data() {
    return {
      isLoading: false,
      initialTabIndex: 0
    };
  },
  async mounted(){
    if (useRoute().path !=='/dashboard/courses'){
      return;
    }
    this.isLoading = true;
    if (!this.$store.getters.getUser){
      await loadUser(this);
    }
    this.isLoading = false;
    const user = this.$store.getters.getUser;
    if (user.ExperienceLevel > 10){
      this.$router.push({
        name: 'AlgosTrack'
      });
      return;
    }
    if (user.ExperienceLevel > 20){
      this.$router.push({
        name: 'GolangTrack'
      });
      return;
    }
    this.$router.push({
      name: 'CSTrack'
    });
  }
};
</script>

<style scoped>

</style>
