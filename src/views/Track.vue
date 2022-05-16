<template>
  <div>
    <Section
      h1
      class="section"
      :title="sectionTitle"
      :subtitle="sectionSubtitle"
    >
      <div class="p-4">
        <UnitTable :units="units" is-ordered />
        <h2 class="text-blue-400 text-xl">Notes</h2>
        <p class="max-width">
          <i>
            This curriculum is a work-in-progress while we build towards an
            unaccredited university-level CS degree.
            <a
              href="https://github.com/bootdotdev/curriculum"
              target="_blank"
              class="text-blue-400 hover:text-blue-300 underline"
              >You can find the roadmap here.</a
            >
            Providing feedback to us and becoming a patron will help us get this
            project finished.
          </i>
        </p>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from "@/components/Section.vue";
import UnitTable from "@/components/UnitTable.vue";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { loadTrack } from "@/lib/cloudStore.js";
import { useStore } from "vuex";
import { notify } from "@/lib/notification.js";
import { slugCS, slugGolang, slugAlgos } from "@/lib/trackSlugs.js";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";

export default {
  components: {
    UnitTable,
    Section,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const trackSlug = route.params.trackSlug;

    const loadTrackInStore = async () => {
      try {
        await loadTrack(store.commit, trackSlug);
      } catch (err) {
        notify({
          type: "danger",
          text: `loadTrack: ${err}`,
        });
      }
    };

    onMounted(async () => {
      loadTrackInStore();
    });

    const sectionTitle = computed(() => {
      if (trackSlug === slugCS) {
        return "Computer Science Track";
      } else if (trackSlug === slugAlgos) {
        return "Data Structures and Algorithms Track";
      } else if (trackSlug === slugGolang) {
        return "Golang Track";
      }
      return "null";
    });

    const sectionSubtitle = computed(() => {
      if (trackSlug === slugCS) {
        return "Learn the skills that bootcamps skip, but employers are dying to hire for";
      } else if (trackSlug === slugAlgos) {
        return "It's hard to find a job if you don't understand the fundamentals of algorithms";
      } else if (trackSlug === slugGolang) {
        return "Learn why Go is taking over backend development";
      }
      return "null";
    });

    const computedMeta = computed(() => {
      return getComputedMeta({
        title: sectionTitle.value,
        description: sectionSubtitle.value,
      });
    });
    useMeta(computedMeta);

    return {
      sectionTitle,
      sectionSubtitle,
      units: computed(() => store.getters.getTrack(trackSlug)),
    };
  },
};
</script>

<style scoped>
.section {
  border-radius: 0 0.5rem 0.5rem 0.5rem;
}
</style>
