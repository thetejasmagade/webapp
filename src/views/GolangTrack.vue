<template>
  <div>
    <Section
      class="section"
      title="Learn why Go is taking over modern web development"
      subtitle="Everything you need to know to get a job writing Go"
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

export default {
  components: {
    CourseTable,
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
