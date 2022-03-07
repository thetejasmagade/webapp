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
import { useMeta } from "vue-meta";

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

    const title = "Courses";
    const description =
      "If you’re not sure what to learn next, this is the place to start. Check out our coding courses, projects and tracks";
    useMeta({
      title: title,
      meta: [
        { vmid: "description", name: "description", content: description },

        { vmid: "og:title", name: "og:title", content: title },
        {
          vmid: "og:description",
          name: "og:description",
          content: description,
        },

        { vmid: "twitter:title", name: "twitter:title", content: title },
        {
          vmid: "twitter:description",
          name: "twitter:description",
          content: description,
        },
      ],
    });
  },
};
</script>

<style scoped></style>
