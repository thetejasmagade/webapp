<template>
  <div>
    <Section
      title="All Courses"
      subtitle="Browse all of Qvault's content. We release new courses often"
    >
      <div class="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4 p-4">
        <div
          v-for="(course, i) of courses"
          :key="i"
        >
          <ImageCard
            :click="() => goToCourse(course)"
            :img-src="course.ImageURL"
          >
            <CourseCardBody
              :course="course"
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
import CourseCardBody from '@/components/CourseCardBody.vue';


import { 
  gtmEventSelectCourse
} from '@/lib/gtm.js';

export default {
  components: {
    Section,
    ImageCard,
    CourseCardBody
  },
  data() {
    return {
      isLoading: false,
      initialTabIndex: 0
    };
  },
  computed:{
    courses(){
      let courses = this.$store.getters.getCourses;
      courses.sort((course1, course2) => { return course1.Difficulty < course2.Difficulty ? -1 : 1;} );
      return courses;
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
