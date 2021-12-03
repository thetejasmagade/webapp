<template>
  <div>
    <Section
      title="All Courses"
      subtitle="Browse all of Qvault's content. We release new courses often"
    >
      <div class="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4 p-4">
        <div
          v-for="(courseUnit, i) of courseUnits"
          :key="i"
        >
          <ImageCard
            :click="() => clickUnit(courseUnit)"
            :img-src="getUnitData(courseUnit).ImageURL"
          >
            <UnitCardBody
              :unit="courseUnit"
            />
          </ImageCard>
        </div>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from '@/components/Section.vue';
import ImageCard from '@/components/ImageCard.vue';
import UnitCardBody from '@/components/UnitCardBody.vue';
import {
  unitTypeCourse, 
  getUnitData, 
  unitTypeProject,
  createCourseUnit
} from '@/lib/unit.js';

import { 
  gtmEventSelectCourse
} from '@/lib/gtm.js';

export default {
  components: {
    Section,
    ImageCard,
    UnitCardBody
  },
  data() {
    return {
      isLoading: false,
      initialTabIndex: 0
    };
  },
  computed:{
    courseUnits(){
      let courses = this.$store.getters.getCourses;
      courses.sort((course1, course2) => { return course1.Difficulty < course2.Difficulty ? -1 : 1;} );
      courses = courses.map(course => createCourseUnit(course));
      return courses;
    }
  },
  methods: {
    getUnitData,
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

.section {
  border-radius: 0 .5rem .5rem .5rem;
}

</style>
