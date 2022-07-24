<template>
  <ViewNavWrapper>
    <div class="lg:p-4 p-2 flex flex-col items-center">
      <Section
        h1
        title="Your path to a career in backend development"
        :subtitle="
          units
            ? `This is our one and only computer science program. Complete these ${units.length} courses and projects from top to bottom. `
            : null
        "
        class="max-w-6xl w-full"
      >
        <div class="p-2 lg:p-4">
          <UnitTable :units="units" class="mt-8" />
          <h2 class="text-blue-400 text-xl my-4">
            A living breathing curriculum
          </h2>
          <p class="max-width">
            <i>
              This curriculum is in a fully-working state, get started! That
              said, it will grow over time and
              <a
                href="https://github.com/bootdotdev/curriculum"
                target="_blank"
                class="text-blue-400 hover:text-blue-300 underline"
                >you can find the public roadmap on Github.</a
              >
              Becoming a patron will help us get this project finished.
            </i>
          </p>
        </div>
      </Section>
    </div>
  </ViewNavWrapper>
</template>

<script>
import Section from "@/components/Section.vue";
import UnitTable from "@/components/UnitTable.vue";
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  loadTrack,
  loadAllInterests,
  loadCourses,
  loadProjects,
} from "@/lib/cloudStore.js";
import { useStore } from "vuex";
import { slugCS } from "@/lib/trackSlugs.js";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";

export default {
  components: {
    UnitTable,
    Section,
    ViewNavWrapper,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const loadTrackInStore = async () => {
      try {
        await loadTrack(store.commit, slugCS);
      } catch (err) {
        console.log(err);
      }
    };

    const loadInterestsInStore = async () => {
      try {
        await loadAllInterests(store.commit);
      } catch (err) {
        console.log(err);
      }
    };

    const loadCoursesInStore = async () => {
      try {
        await loadCourses(store.commit);
      } catch (err) {
        console.log(err);
      }
    };

    const loadProjectsInStore = async () => {
      try {
        await loadProjects(store.commit);
      } catch (err) {
        console.log(err);
      }
    };

    onMounted(async () => {
      if (useRoute().query.redirect) {
        router.push({ path: useRoute().query.redirect });
      }

      loadTrackInStore();
      loadInterestsInStore();
      loadCoursesInStore();
      loadProjectsInStore();
    });

    const computedMeta = computed(() => {
      return getComputedMeta({
        title: "Computer Science Track",
        description:
          "Prepare for a job in backend development by taking our fully-online CS program",
        featuredImageURL: "https://i.imgur.com/DsK1de9.png",
      });
    });
    useMeta(computedMeta);

    return {
      units: computed(() => store.getters.getTrack(slugCS)),
    };
  },
};
</script>

<style scoped></style>
