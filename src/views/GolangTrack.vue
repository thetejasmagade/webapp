<template>
  <div>
    <Section
      class="section"
      title="Learn why Golang is taking over modern tech companies"
      subtitle="We'll take you through all the fundamentals of the Go programming language"
    >
      <CourseTimeline
        :courses="trackGopherGangCourses"
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
    trackGopherGangCourses(){
      return this.$store.getters.getTrackGopherGang;
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

.section {
  border-radius: 0 .5rem .5rem .5rem;
}

</style>
