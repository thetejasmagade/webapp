<template>
  <div>
    <Section
      class="section"
      title="All courses and projects"
      subtitle="Looking for recommendations? We can help you out in the Discord"
    >
      <div class="p-4">
        <CourseTable :units="units" />
      </div>
    </Section>
  </div>
</template>

<script>
import Section from "@/components/Section.vue";
import CourseTable from "@/components/CourseTable.vue";
import { getUnitData } from "@/lib/unit.js";

export default {
  components: {
    Section,
    CourseTable,
  },
  computed: {
    units() {
      let units = this.$store.getters.getUnits;
      units.sort((unit1, unit2) => {
        return getUnitData(unit1).Difficulty < getUnitData(unit2).Difficulty
          ? -1
          : 1;
      });
      return units;
    },
  },
  methods: {
    getUnitData,
  },
};
</script>

<style scoped>
.section {
  border-radius: 0 0.5rem 0.5rem 0.5rem;
}
</style>
