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
            subtitle="Take the following courses in order to complete the full CS program"
            class="margin-bottom-1"
          >
            <div class="program-body">
              <div
                v-for="(course, i) of $store.getters.getProgramCS"
                :key="i"
                class="program-item"
              >
                <ImageCard
                  v-if="!course.IsComplete"
                  theme="light"
                  direction="row"
                  :img-src="course.ImageURL"
                  class="card row"
                  :click="() => { goToCourse(course) }"
                >
                  <CourseCardBodyRow
                    class="body"
                    :course="course"
                    :i="i"
                  />
                </ImageCard>
              </div>
            </div>
            <h2> Notes </h2>
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
            <div class="cards">
              <div
                v-for="(course, i) of courses"
                :key="i"
              >
                <ImageCard
                  theme="light"
                  :img-src="course.ImageURL"
                  class="card col"
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
                  theme="light"
                  :img-src="course.ImageURL"
                  class="card col"
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
import CourseCardBodyRow from '@/components/CourseCardBodyRow';
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
    CourseCardBodyRow,
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

.program-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.program-item {
  flex-direction: row;
  display: flex;
  margin: 2em 0 0 0;
  max-width: 900px;
}

.card {
  &.col {
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

  &.row {
    flex: 1;
  }
}
</style>
