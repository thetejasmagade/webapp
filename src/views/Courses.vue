<template>
  <ViewNavWrapper>
    <div class="p-4">
      <TabsNav />
      <router-view />
    </div>
  </ViewNavWrapper>
</template>

<script>
import TabsNav from "@/components/TabsNav.vue";
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import { loadAllInterests } from "@/lib/cloudStore.js";
import { useRoute } from "vue-router";
import { useCalculatedMeta } from "@/lib/meta.js";

import { loadTracks } from "@/lib/cloudStore.js";

export default {
  components: {
    TabsNav,
    ViewNavWrapper,
  },
  async mounted() {
    if (useRoute().query.redirect) {
      this.$router.push({ path: useRoute().query.redirect });
    }
    loadTracks(this);
    loadAllInterests(this);

    useCalculatedMeta({
      title: "Courses",
      description:
        "If you’re not sure what to learn next, this is the place to start. Check out our coding courses, projects and tracks",
    });
  },
};
</script>

<style scoped></style>
