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
        <h2 class="text-blue-400 text-xl my-4">Notes</h2>
        <p class="max-width">
          <i>
            This curriculum is in a fully-working state, get started! That said,
            it will grow over time and
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
        return "This is our full CS curriculum. If you're new to coding, start at the very top and work down in order.";
      } else if (trackSlug === slugAlgos) {
        return "If you have some coding experience, you can skip-ahead and learn algorithms here.";
      } else if (trackSlug === slugGolang) {
        return "If you're an experienced developer and just want to learn Go, start here.";
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
