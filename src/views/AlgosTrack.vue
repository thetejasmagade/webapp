<template>
  <div>
    <Section
      class="section"
      title="Nail coding interviews and jumpstart your career"
      subtitle="These university-quality Python courses will teach you all about algorithms and data structures"
    >
      <CourseTimeline
        :courses="trackDSAlgosCourses"
        :click-callback="goToCourse"
      />
    </Section>
  </div>
</template>

<script>
import Section from '@/components/Section.vue';
import CourseTimeline from '@/components/CourseTimeline.vue';

import { 
  gtmEventSelectCourse
} from '@/lib/gtm.js';

export default {
  components: {
    CourseTimeline,
    Section
  },
  computed:{
    trackDSAlgosCourses(){
      return this.$store.getters.getTrackDSAlgos;
    }
  },
  methods: {
    goToCourse(course){
      gtmEventSelectCourse(course.UUID, course.Title);
      this.$router.push({name: 'Exercise', params: {courseUUID: course.UUID}});
    }
  }
};
</script>

<style scoped>

.section{
  border-radius: 0 .5rem .5rem .5rem;
}

</style>
