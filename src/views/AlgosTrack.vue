<template>
  <div>
    <Section
      class="section"
      title="It's hard to find a job if you don't understand the fundamentals of algorithms"
      subtitle="These Python courses will teach you how to ace whiteboard interviews"
    >
      <TrackTimeline :units="trackDSAlgosCourses" :num-skeleton-cards="5" />
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
    trackDSAlgosCourses() {
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
