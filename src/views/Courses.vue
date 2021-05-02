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
            :title="`Your next course: ${ $store.getters.getProgramCS.length > 0 ? $store.getters.getProgramCS[0].Title : null }`"
            subtitle="Take these courses in order to complete the full computer science program"
          >
            <div class="section-body">
              <ProfileSpeechBubble
                link="https://qvault.io/about#wagslane"
                class="speech-bubble"
                text="
                  I've found the #1 thing that sets developers apart in the job market is their understanding of computer science concepts.
                  That's why I wrote this hands-on program. There's just too much that educators leave out of boot
                  camps and crash courses."
                image-u-r-l="https://pbs.twimg.com/profile_images/1380974063959429120/ZcqTzuh7_400x400.jpg"
                bio="Lane, Author"
              />
              <div class="cards">
                <div
                  v-if="csProgramCourses.length > 0"
                >
                  <ImageCard
                    theme="light"
                    :img-src="csProgramCourses[0].ImageURL"
                    class="card large"
                  >
                    <CourseCardBodyDetailed
                      class="body"
                      :course="csProgramCourses[0]"
                      :click="() => { goToCourse(csProgramCourses[0]) }"
                    />
                  </ImageCard>
                </div>
              </div>
              <div class="cards">
                <div
                  v-for="(course, i) of csProgramCourses"
                  :key="i"
                >
                  <ImageCard
                    v-if="i > 0"
                    theme="light"
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
            </div>
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
                  theme="light"
                  :img-src="course.ImageURL"
                  class="card large"
                  :click="()=>() => { goToCourse(course) }"
                >
                  <CourseCardBodyDetailed
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
import Section from '@/components/Section.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import ImageCard from '@/components/ImageCard.vue';
import CourseCardBody from '@/components/CourseCardBody.vue';
import CourseCardBodyDetailed from '@/components/CourseCardBodyDetailed.vue';
import Tab from '@/components/Tab.vue';
import Tabs from '@/components/Tabs.vue';
import ProfileSpeechBubble from '@/components/ProfileSpeechBubble.vue';

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
    CourseCardBodyDetailed,
    Tab,
    Tabs,
    ProfileSpeechBubble
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
    if (this.$route.params.courseUUID){
      this.$router.push({name: 'Exercise', params: {courseUUID: this.$route.params.courseUUID}});
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

.section-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

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

.card {
  $margin: 30px;
  flex: 1 1 200px;
  margin: $margin;
  max-width: 350px;
  @media (min-width: $mobile-size) {
    min-width: 250px;
  }
  height: calc(100% - #{$margin});

  .body {
    height: 100%;
  }

  &.large {
    max-width: 500px;
  }
}

.speech-bubble {
  border: 1px solid $gray-light;
  border-radius: 5px;
  max-width: 1000px;
  background-color: $white;
  margin: 1em 0 0 0;
}
</style>
