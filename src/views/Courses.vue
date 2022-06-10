<template>
  <ViewNavWrapper>
    <div class="p-4">
      <TabsNav :tabs="tabs" />
      <router-view />
    </div>
  </ViewNavWrapper>
</template>

<script>
import TabsNav from "@/components/navs/TabsNav.vue";
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import {
  loadAllInterests,
  loadCourses,
  loadProjects,
} from "@/lib/cloudStore.js";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { useStore } from "vuex";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";
import { notify } from "@/lib/notification.js";
import { slugCS, slugGolang, slugAlgos } from "@/lib/trackSlugs.js";

export default {
  components: {
    TabsNav,
    ViewNavWrapper,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    onMounted(async () => {
      if (useRoute().query.redirect) {
        router.push({ path: useRoute().query.redirect });
      }
      try {
        await Promise.all([
          loadAllInterests(store.commit),
          loadCourses(store.commit),
          loadProjects(store.commit),
        ]);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    });

    const computedMeta = getComputedMeta({
      title: "Courses",
      description:
        "If you’re not sure what to learn next, this is the place to start. Check out our coding courses, projects and tracks",
    });
    useMeta(computedMeta);

    const tabs = [
      {
        route: `/tracks/${slugCS}`,
        icon: "graduation-cap",
        name: "CS track",
      },
      {
        route: `/tracks/${slugGolang}`,
        icon: ["fab", "golang"],
        name: "Golang track",
      },
      {
        route: `/tracks/${slugAlgos}`,
        icon: ["fab", "python"],
        name: "Algorithms track",
      },
      {
        route: "/courses/browse",
        icon: "search",
        name: "All courses",
      },
    ];

    return {
      tabs,
    };
  },
};
</script>

<style scoped></style>
