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
            title="Your path to a successful coding career"
            subtitle="Take the following courses in order to complete our computer science program"
            class="margin-bottom-1"
          >
            <div class="program">
              <div
                v-for="(course, i) of $store.getters.getProgramCS"
                :key="i"
                class="item"
              >
                <h3>
                  #{{ i+1 }}
                </h3>
                <ImageCard
                  :img-src="course.ImageURL"
                  class="card"
                  :click="() => { goToCourse(course) }"
                >
                  <CourseCardBody
                    v-if="course"
                    class="body"
                    :course="course"
                  />
                </ImageCard>
              </div>
            </div>
            <h2> Notes </h2>
            <p class="max-width">
              <i>
                This curriculum is a work-in-progress
                while we build towards an unaccredited university-level CS degree.
                <a
                  href="https://github.com/qvault/curriculum"
                  target="_blank"
                >You can find the roadmap here.</a>
                Buying courses,
                being part of our
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
            subtitle="Browse all of our content, we release new courses frequently"
          >
            <div class="cards">
              <div
                v-for="(course, i) of courses"
                :key="i"
              >
                <ImageCard
                  :img-src="course.ImageURL"
                  class="card"
                  :click="() => { goToCourse(course) }"
                >
                  <CourseCardBody
                    class="body"
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
            class="margin-bottom-1"
          >
            <div class="cards">
              <div
                v-for="(course, i) of recommendedCourses"
                :key="i"
              >
                <ImageCard
                  :img-src="course.ImageURL"
                  class="card"
                  :click="()=>() => { goToCourse(course) }"
                >
                  <CourseCardBody
                    class="body"
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
import Section from '@/components/Section';
import LoadingOverlay from '@/components/LoadingOverlay';
import ImageCard from '@/components/ImageCard';
import CourseCardBody from '@/components/CourseCardBody';
import Tab from '@/components/Tab';
import Tabs from '@/components/Tabs';

import { 
  getCourseRecommendations
} from '@/lib/cloudClient.js';

import { 
  gtmEventSelectCourse
} from '@/lib/gtm.js';

export default {
  metaInfo() {
    const title = 'Qvault - Courses';
    return {
      title: title,
      meta: [
        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'twitter:title', name: 'twitter:title', content: title }
      ]
    };
  },
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
    courses(){
      return this.$store.getters.getCourses;
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
      this.$notify({
        type: 'error',
        text: err
      });
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

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.courses-page {
  display: block;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow: auto;
  min-height: calc(100vh - #{$bar-height});
}

.cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.program {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: auto;
  margin: 1em;
  padding: 1em;
  background-color: $gray-dark;
  border-radius: 6px;

  scrollbar-width: thin;
  scrollbar-color: $gray-dark $gray-light;
  &::-webkit-scrollbar {
    width: 11px;
  }
  &::-webkit-scrollbar-track {
    background: $gray-dark;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $gray-light;
    border-radius: 6px;
    border: 3px solid $gray-light;
    &:hover{
      background-color: $gray-lighter;
      border: 3px solid $gray-lighter;
    }
  }

  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 2em;

    h3 {
      font-size: 1.5em;
      margin: 0;
    }
  }
}

.card {
  $margin: 20px;
  flex: 1 1 200px;
  margin: $margin;
  max-width: 300px;
  @media (min-width: $mobile-size) {
    min-width: 250px;
  }
  height: calc(100% - #{$margin});

  .body {
    height: 100%;
  }
}
</style>
