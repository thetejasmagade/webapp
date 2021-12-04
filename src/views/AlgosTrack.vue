<template>
  <div>
    <Section
      class="section"
      title="Nail coding interviews and jumpstart your career"
      subtitle="These university-quality Python courses will teach you all about algorithms and data structures"
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
import Section from '@/components/Section.vue';
import TrackTimeline from '@/components/TrackTimeline.vue';
import {unitTypeCourse, getUnitData, unitTypeProject} from '@/lib/unit.js';

import { 
  gtmEventSelectCourse
} from '@/lib/gtm.js';

export default {
  components: {
    TrackTimeline,
    Section
  },
  computed:{
    trackDSAlgosCourses(){
      return this.$store.getters.getTrackDSAlgos;
    }
  },
  methods: {
    clickUnit(unit){
      const unitData = getUnitData(unit);
      if (unit.type === unitTypeCourse){
        gtmEventSelectCourse(unitData.UUID, unitData.Title);
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

.section{
  border-radius: 0 .5rem .5rem .5rem;
}

</style>
