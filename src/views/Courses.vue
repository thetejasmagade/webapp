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
  }
};
</script>

<style scoped>

</style>
