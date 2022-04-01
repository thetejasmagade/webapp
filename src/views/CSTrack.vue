<template>
  <div>
    <Section
      class="section"
      title="Practice the skills that bootcamps skip, but employers are dying to hire for"
      subtitle="A complete computer science program in your browser"
    >
      <div class="p-4">
        <UnitTable :units="units" />
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
            Buying courses, being part of the
            <a
              href="https://discord.gg/EEkFwbv"
              target="_blank"
              class="text-blue-400 hover:text-blue-300 underline"
              >Discord community</a
            >, and providing great feedback will help us get the project
            finished.
          </i>
        </p>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from "@/components/Section.vue";
import UnitTable from "@/components/UnitTable.vue";

export default {
  components: {
    UnitTable,
    Section,
  },
  computed: {
    units() {
      return this.$store.getters.getTrackCS;
    },
  },
};
</script>

<style scoped>
.section {
  border-radius: 0 0.5rem 0.5rem 0.5rem;
}
</style>
