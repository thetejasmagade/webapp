<template>
  <div>
    <TopNav :title="title" />
    <div class="flex h-full-minus-bar">
      <Sidebar
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
import TopNav from "@/components/TopNav.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  components: {
    Sidebar,
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
