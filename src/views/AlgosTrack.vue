<template>
  <div>
    <Section
      class="section"
      title="It's hard to find a job if you don't understand the fundamentals of algorithms"
      subtitle="These Python courses will teach you how to ace whiteboard interviews"
    >
      <TrackTimeline
        :units="trackDSAlgosCourses"
        :click-callback="clickUnit"
        :num-skeleton-cards="5"
      />
    </Section>
  </div>
</template>

<script>
import Section from "@/components/Section.vue";
import TrackTimeline from "@/components/TrackTimeline.vue";
import { unitTypeCourse, getUnitData, unitTypeProject } from "@/lib/unit.js";

import { eventSelectCourse } from "@/lib/analytics.js";

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
  methods: {
    clickUnit(unit) {
      const unitData = getUnitData(unit);
      if (unit.type === unitTypeCourse) {
        eventSelectCourse(unitData.UUID, unitData.Title);
        this.$router.push({
          name: "Course",
          params: { courseUUID: unitData.UUID },
        });
      }
      if (unit.type === unitTypeProject) {
        this.$router.push({
          name: "Project",
          params: { projectUUID: unitData.UUID },
        });
      }
    },
  },
};
</script>

<style scoped>
.section {
  border-radius: 0 0.5rem 0.5rem 0.5rem;
}
</style>
