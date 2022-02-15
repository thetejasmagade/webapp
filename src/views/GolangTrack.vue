<template>
  <div>
    <Section
      class="section"
      title="Learn why Go is taking over modern web development"
      subtitle="Everything you need to know to get a job writing Go"
    >
      <TrackTimeline
        :units="trackGopherGangCourses"
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
    trackGopherGangCourses() {
      return this.$store.getters.getTrackGopherGang;
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
