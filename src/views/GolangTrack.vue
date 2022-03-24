<template>
  <div>
    <Section
      class="section"
      title="Learn why Go is taking over modern web development"
      subtitle="Everything you need to know to get a job writing Go"
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
      return this.$store.getters.getTrackGopherGang;
    },
  },
};
</script>

<style scoped>
.section {
  border-radius: 0 0.5rem 0.5rem 0.5rem;
}
</style>
