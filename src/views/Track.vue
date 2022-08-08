<template>
  <ViewNavWrapper>
    <div class="lg:p-4 p-2 flex flex-col items-center">
      <Section
        h1
        title="Your path to a career in backend development"
        :subtitle="
          units
            ? `Complete the learning path by taking these ${units.length} courses and projects in order from top to bottom.`
            : null
        "
        class="max-w-6xl w-full"
      >
        <div class="p-2 lg:p-4 text-lg">
          <p class="max-width">
            This the one-and-only learning path on Boot.dev. It will teach you
            computer science skills in order to prepare you for a job in backend
            web development. If you have any questions about the content, check
            out
            <a
              href="https://github.com/bootdotdev/curriculum"
              target="_blank"
              class="text-blue-400 hover:text-blue-300 underline"
              >our public FAQ and roadmap on GitHub.</a
            >
            If you like what we're building,
            <router-link
              to="/pricing"
              class="text-blue-400 hover:text-blue-300 underline"
              >become a Patron</router-link
            >
            to unlock full access and support future development.
          </p>
          <UnitTable
            :units="units"
            :unit-progress="unitProgress"
            class="mt-8"
          />
        </div>
      </Section>
    </div>
  </ViewNavWrapper>
</template>

<script>
import Section from "@/components/Section.vue";
import UnitTable from "@/components/UnitTable.vue";
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import { computed, onMounted, reactive, toRefs } from "vue";
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
import { getUnitsProgress } from "@/lib/cloudClient.js";

export default {
  components: {
    UnitTable,
    Section,
    ViewNavWrapper,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      unitProgress: null,
    });

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

    const getUnitsProgressIfLoggedIn = async () => {
      if (!store.getters.getIsLoggedIn) {
        return;
      }
      try {
        state.unitProgress = await getUnitsProgress();
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
      getUnitsProgressIfLoggedIn();
    });

    const computedMeta = computed(() => {
      return getComputedMeta({
        title: "Backend Development Track",
        description:
          "Take a striaght path to your career in backend development by completing our online computer science curriculum for backend engineers",
        featuredImageURL: "https://i.imgur.com/DsK1de9.png",
      });
    });
    useMeta(computedMeta);

    return {
      ...toRefs(state),
      units: computed(() => store.getters.getTrack(slugCS)),
    };
  },
};
</script>

<style scoped></style>
