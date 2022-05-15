<template>
  <div>
    <TopNav />
    <div class="flex h-full-minus-bar">
      <SideNav
        v-if="$store.getters.getIsLoggedIn"
        class="inline-block align-top w-20"
      />

      <div class="align-top h-full overflow-auto flex-1 flex flex-col">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/navs/TopNav.vue";
import SideNav from "@/components/navs/SideNav.vue";

export default {
  components: {
    SideNav,
    TopNav,
  },
};
</script>

<style scoped></style>
