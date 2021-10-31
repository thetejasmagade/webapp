<template>
  <div>
    <Section
      class="section"
      title="Learn the core skills that bootcamps skip, but employers are dying for"
      subtitle="This full CS program will take you from absolute beginner to job-worthy"
    >
      <CourseTimeline
        :courses="csProgramCourses"
        :click-callback="goToCourse"
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
    csProgramCourses(){
      return this.$store.getters.getProgramCS;
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
