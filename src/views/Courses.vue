<template>
  <div
    class="subcontainer"
  >
    <TabsNav />
    <router-view />
  </div>
</template>

<script>
import TabsNav from '@/components/TabsNav.vue';

export default {
  components: {
    TabsNav
  },
  data() {
    return {
      isLoading: false,
      initialTabIndex: 0
    };
  }
};
</script>

<style scoped>

</style>
