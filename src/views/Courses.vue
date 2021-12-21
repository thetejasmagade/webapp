<template>
  <div
    class="p-4"
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
  }
};
</script>

<style scoped>

</style>
