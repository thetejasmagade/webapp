<template>
  <div>
    <Section
      class="section"
      title="It's hard to find a job if you don't understand the fundamentals of algorithms"
      subtitle="These Python courses will teach you how to ace whiteboard interviews"
    >
      <div class="p-4">
        <UnitTable :units="units" />
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
      return this.$store.getters.getTrackDSAlgos;
    },
  },
};
</script>

<style scoped>
.section {
  border-radius: 0 0.5rem 0.5rem 0.5rem;
}
</style>
