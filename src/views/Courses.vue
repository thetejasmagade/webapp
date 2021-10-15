<template>
  <div
    class="courses-page"
  >
    <LoadingOverlay
      :is-loading="isLoading" 
    />
    <div
      v-if="!isLoading"
      class="subcontainer"
    >
      <Tabs
        class="tabs"
        :initial-index="initialTabIndex"
      >
        <Tab
          title="Computer Science Track"
          icon="graduation-cap"
        >
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
        </Tab>
        <Tab
          title="Algorithms Track"
          icon="puzzle-piece"
        >
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
        </Tab>
        <Tab
          title="Gopher Gang Track"
          icon="server"
        >
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
        </Tab>
        <Tab
          title="Browse"
          icon="search"
        >
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
import CourseTimeline from '@/components/CourseTimeline.vue';
import Tab from '@/components/Tab.vue';
import Tabs from '@/components/Tabs.vue';

import {
  loadUser
} from '@/lib/cloudStore.js';

import { 
  gtmEventSelectCourse
} from '@/lib/gtm.js';

export default {
  components: {
    CourseTimeline,
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
      initialTabIndex: 0
    };
  },
  computed:{
    csProgramCourses(){
      return this.$store.getters.getProgramCS;
    },
    trackDSAlgosCourses(){
      return this.$store.getters.getTrackDSAlgos;
    },
    trackGopherGangCourses(){
      return this.$store.getters.getTrackGopherGang;
    },
    courses(){
      let courses = this.$store.getters.getCourses;
      courses.sort((course1, course2) => { return course1.Difficulty < course2.Difficulty ? -1 : 1;} );
      return courses;
    }
  },
  async mounted(){
    this.isLoading = true;
    if (!this.$store.getters.getUser){
      await loadUser(this);
    }
    this.isLoading = false;
    const user = this.$store.getters.getUser;
    if (user.ExperienceLevel > 10){
      this.initialTabIndex = 1;
      return;
    }
    if (user.ExperienceLevel > 20){
      this.initialTabIndex = 2;
      return;
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
