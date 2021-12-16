<template>
  <div>
    <Section
      class="section"
      title="Learn the core skills that bootcamps skip, but employers are dying for"
      subtitle="This full CS program will take you from absolute beginner to job-worthy"
    >
      <TrackTimeline
        :units="trackCS"
        :click-callback="clickUnit"
        :num-skeleton-cards="5"
      />
      <h2 class="text-gold-600 text-xl">
        Notes
      </h2>
      <p class="max-width">
        <i>
          This curriculum is a work-in-progress
          while we build towards an unaccredited university-level CS degree.
          <a
            href="https://github.com/qvault/curriculum"
            target="_blank"
          >You can find the roadmap here.</a>
          Buying courses,
          being part of the
          <a
            href="https://discord.gg/k4rVEWt"
            target="_blank"
          >Discord community</a>,
          and providing great feedback will help us get the project finished.
        </i>
      </p>
    </Section>
  </div>
</template>

<script>
import Section from '@/components/Section.vue';
import TrackTimeline from '@/components/TrackTimeline.vue';
import {unitTypeCourse, getUnitData, unitTypeProject} from '@/lib/unit.js';

import { 
  eventSelectCourse
} from '@/lib/analytics.js';

export default {
  components: {
    TrackTimeline,
    Section
  },
  computed:{
    trackCS(){
      console.log(JSON.stringify(this.$store.getters.getTrackCS));
      return this.$store.getters.getTrackCS;
    }
  },
  methods: {
    clickUnit(unit){
      const unitData = getUnitData(unit);
      if (unit.type === unitTypeCourse){
        eventSelectCourse(unitData.UUID, unitData.Title);
        this.$router.push({name: 'Exercise', params: {courseUUID: unitData.UUID}});
      }
      if (unit.type === unitTypeProject){
        this.$router.push({name: 'Step', params: {projectUUID: unitData.UUID}});
      }
    }
  }
};
</script>

<style scoped>

.section {
  border-radius: 0 .5rem .5rem .5rem;
}

</style>
