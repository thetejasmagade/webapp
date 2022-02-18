<template>
  <div>
    <Section
      class="section"
      title="Learn why Go is taking over modern web development"
      subtitle="Everything you need to know to get a job writing Go"
    >
      <TrackTimeline :units="trackGopherGangCourses" :num-skeleton-cards="5" />
    </Section>
  </div>
</template>

<script>
import Section from "@/components/Section.vue";
import TrackTimeline from "@/components/TrackTimeline.vue";

export default {
  components: {
    TrackTimeline,
    Section,
  },
  computed: {
    trackGopherGangCourses() {
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
