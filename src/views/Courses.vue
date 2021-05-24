<template>
  <div
    class="courses-page"
  >
    <LoadingOverlay
      :is-loading="isLoading" 
    />

    <div class="subcontainer">
      <Tabs class="tabs">
        <Tab
          title="CS Program"
          icon="graduation-cap"
        >
          <Section
            :title="$store.getters.getProgramCS.length > 0 ? `Your next course: ${$store.getters.getProgramCS[0].Title}` : 'Loading...'"
            subtitle="Take these courses in order. You're on your way to a high-paying coding job"
          >
            <div class="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4 p-4">
              <div
                v-for="(course, i) of csProgramCourses"
                :key="i"
              >
                <ImageCard
                  :img-src="course.ImageURL"
                >
                  <CourseCardBody
                    :course="course"
                  />
                </ImageCard>
              </div>
            </div>
            <h2 class="text-gold-600 text-xl">
              Notes
            </h2>
            <p class="max-width">
              <i>
                This curriculum is a work-in-progress
                while I build towards an unaccredited university-level CS degree.
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
        </Tab>
        <Tab
          title="Browse"
          icon="search"
        >
          <Section
            title="All Courses"
            subtitle="Browse all my content, I release new courses as often as I can"
          >
            <div class="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4 p-4">
              <div
                v-for="(course, i) of courses"
                :key="i"
              >
                <ImageCard
                  :img-src="course.ImageURL"
                >
                  <CourseCardBody
                    :course="course"
                  />
                </ImageCard>
              </div>
            </div>
          </Section>
        </Tab>
        <Tab
          v-if="recommendedCourses && recommendedCourses.length > 0"
          title="Recommended"
          icon="star"
        >
          <Section
            v-if="recommendedCourses && recommendedCourses.length > 0"
            title="Recommended à la carte courses"
            subtitle="Based on your profile, take these courses to reach your short-term goals"
          >
            <div class="grid grid-cols-2 xs:grid-cols-1 gap-4 p-4">
              <div
                v-for="(course, i) of recommendedCourses"
                :key="i"
              >
                <ImageCard
                  :img-src="course.ImageURL"
                  class="max-w-sm"
                >
                  <CourseCardBody
                    :course="course"
                  />
                </ImageCard>
              </div>
            </div>
          </Section>
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script>
import Section from '@/components/Section.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import ImageCard from '@/components/ImageCard.vue';
import CourseCardBody from '@/components/CourseCardBody.vue';
import Tab from '@/components/Tab.vue';
import Tabs from '@/components/Tabs.vue';

import { 
  getCourseRecommendations
} from '@/lib/cloudClient.js';
import { notify } from '@/lib/notification.js';

export default {
  components: {
    Section,
    LoadingOverlay,
    ImageCard,
    CourseCardBody,
    Tab,
    Tabs
  },
  data() {
    return {
      isLoading: false,
      recommendedCourses: []
    };
  },
  computed:{
    csProgramCourses(){
      return this.$store.getters.getProgramCS.filter(course => !course.IsComplete);
    },
    courses(){
      let courses = this.$store.getters.getCourses;
      courses.sort((course1, course2) => { return course1.Difficulty < course2.Difficulty ? -1 : 1;} );
      return courses;
    }
  },
  async mounted(){
    try{
      let recommendedCourses = await getCourseRecommendations();
      const maxRecommended = 2;
      let final = [];
      for (const course of recommendedCourses){
        if (final.length >= maxRecommended){
          continue;
        }
        final.push(course);
      }
      this.recommendedCourses = final;
    } catch (err) {
      notify({
        type: 'danger',
        text: err
      });
    }
  }
};
</script>

<style scoped>

</style>
