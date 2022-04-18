<template>
  <div>
    <TopNav :title="title" />
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
  props: {
    title: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>

<style scoped></style>
