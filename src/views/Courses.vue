<template>
  <div
    class="courses-page"
  >
    <LoadingOverlay
      :is-loading="isLoading" 
    />
    <ConfirmOverlay
      ref="confirmPurchase"
    />
    <div>
      <div
        v-for="(course, i) of courses"
        :key="i"
      >
        <CourseCheckoutModal
          :ref="course.UUID"
          :course="course"
          :user-has-already-bought-courses="userHasAlreadyBoughtCourses"
        />
      </div>
    </div>

    <div class="subcontainer">
      <Tabs class="tabs">
        <Tab
          title="CS Program"
          icon="graduation-cap"
        >
          <Section
            title="Your path to a successful coding career"
            subtitle="Take the following courses in order"
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
                >
                  <CourseCardBody
                    v-if="course"
                    class="body"
                    :course="course"
                    :click-buy-demo-course="() => {clickBuyCourse(course, true) }"
                    :click-buy-course="()=> {clickBuyCourse(course, false) }"
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
          title="A La Carte"
          icon="cheese"
        >
          <Section
            v-if="recommendedCourses && recommendedCourses.length > 0"
            title="Recommended à la carte courses"
            subtitle="Based on your profile, take these courses to reach short-term goals"
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
                >
                  <CourseCardBody
                    class="body"
                    :course="course"
                    :click-buy-demo-course="() => { clickBuyCourse(course, true) }"
                    :click-buy-course="() => { clickBuyCourse(course, false) }"
                  />
                </ImageCard>
              </div>
            </div>
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
                >
                  <CourseCardBody
                    class="body"
                    :course="course"
                    :click-buy-demo-course="() => {clickBuyCourse(course, true) }"
                    :click-buy-course="()=> {clickBuyCourse(course, false) }"
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
import ConfirmOverlay from '@/components/ConfirmOverlay';
import CourseCheckoutModal from '@/components/CourseCheckoutModal';
import CourseCardBody from '@/components/CourseCardBody';
import Tab from '@/components/Tab';
import Tabs from '@/components/Tabs';

import { 
  purchaseCourse,
  purchaseDemoCourse,
  getLastGemTransaction,
  getCourseRecommendations
} from '@/lib/cloudClient.js';

import { 
  loadCourses
} from '@/lib/cloudStore.js';

import {
  gtmEventPurchaseCourseWithGems,
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
    ConfirmOverlay,
    CourseCheckoutModal,
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
    userHasAlreadyBoughtCourses(){
      let hasBought = false;
      for (const course of this.courses){
        if (course.IsPurchased){
          hasBought = true;
        }
      }
      return hasBought;
    },
    courses(){
      let courses = this.$store.getters.getCourses;
      const balance = this.$store.getters.getBalance;
      for (let i = 0; i < courses.length; i++){
        let products = this.$store.getters.getProducts;
        products = products.filter(product => product.GemAmount >= courses[i].GemCost - balance);
        if (products.length === 0){
          products = products.filter(product => product.GemAmount >= courses[i].GemCost);
        }
        if (products.length > 3){
          products = products.slice(0, 3);
        }
        products.sort((p1, p2) => p1.GemAmount > p2.GemAmount ? 1 : -1);
        courses[i].products = products;
      }
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
      this.$notify({
        type: 'error',
        text: err
      });
    }

    if (this.$route.query.courseUUID){
      if (this.courses.length === 0 ){
        await loadCourses(this);
      }
      for (let i = 0; i < this.courses.length; i++){
        if (this.courses[i].UUID === this.$route.query.courseUUID){
          this.clickBuyCourse(this.courses[i], false);
          break;
        }
      }
    }
  },
  methods: {
    showModal(courseUUID){
      this.$refs[courseUUID][0].show();
    },
    clickBuyCourse(course, isDemo){
      const alreadyPurchased = (isDemo && course.IsDemoPurchased) ||
        (!isDemo && course.IsPurchased);
      if (alreadyPurchased) {
        this.$router.push({name: 'Exercise', params: {courseUUID: course.UUID}});
        return;
      }
      gtmEventSelectCourse(course.UUID, course.Title);
      const enoughGems = (isDemo && this.$store.getters.getBalance >= course.GemDemoCost) || 
        (!isDemo && this.$store.getters.getBalance >= course.GemCost);
      if (!enoughGems){
        this.showModal(course.UUID);
        return;
      }
      this.$refs['confirmPurchase'].openNav(
        `Would you like to purchase this ${isDemo ? 'demo' : 'course'} for ${isDemo ? course.GemDemoCost : course.GemCost} gems?`,
        async () => {
          try {
            if (isDemo) {
              await purchaseDemoCourse(course.UUID);
              gtmEventPurchaseCourseWithGems(course.GemDemoCost, course.Title, true);
            } else {
              await purchaseCourse(course.UUID);
              gtmEventPurchaseCourseWithGems(course.GemCost, course.Title, false);
            }
            await loadCourses(this);
            const lastGemTransaction = await getLastGemTransaction();
            this.$store.commit('setBalance', lastGemTransaction.Balance);
            this.$router.push({name: 'Exercise', params: {courseUUID: course.UUID}});
          } catch (err) {
            this.$notify({
              type: 'error',
              text: err
            });
          }
        }
      );
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
