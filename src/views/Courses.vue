<template>
  <div
    class="root"
  >
    <LoadingOverlay
      :is-loading="isLoading" 
    />
    <ConfirmOverlay
      ref="confirmPurchase"
    />

    <div class="subcontainer">
      <Section
        v-if="recommendedCourse"
        title="#1 Recommended Course"
        subtitle="Based on your profile, we suggest starting here"
        class="recommended-section margin-bottom-1"
      >
        <div class="cards">
          <CourseCheckoutModal
            ref="modalRecommended"
            :course="recommendedCourse"
            :user-has-already-bought-courses="userHasAlreadyBoughtCourses"
          />
          <ImageCard
            direction="row"
            :img-src="recommendedCourse.ImageURL"
            class="recommended-card"
          >
            <CourseCardBody
              v-if="recommendedCourse"
              class="body"
              :course="recommendedCourse"
              :click-buy-demo-course="() => {clickBuyCourse(recommendedCourse.UUID, recommendedCourse.GemDemoCost, recommendedCourse.IsDemoPurchased, true) }"
              :click-buy-course="()=> {clickBuyCourse(recommendedCourse.UUID, recommendedCourse.GemCost, recommendedCourse.IsPurchased, false) }"
            />
          </ImageCard>
        </div>
      </Section>

      <Section
        title="All Courses"
        subtitle="Browse all of our content, we release new courses frequently"
      >
        <div class="cards">
          <div
            v-for="(course, i) of courses"
            :key="i"
          >
            <CourseCheckoutModal
              :ref="`modal`"
              :course="course"
              :user-has-already-bought-courses="userHasAlreadyBoughtCourses"
            />
            <ImageCard
              :img-src="course.ImageURL"
              class="card"
            >
              <CourseCardBody
                class="body"
                :course="course"
                :click-buy-demo-course="() => {clickBuyCourse(course.UUID, course.GemDemoCost, course.IsDemoPurchased, true, i) }"
                :click-buy-course="()=> {clickBuyCourse(course.UUID, course.GemCost, course.IsPurchased, false, i) }"
              />
            </ImageCard>
          </div>
        </div>
      </Section>
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
  gtmEventPurchaseCourse,
  gtmEventPurchaseCourseDemo
} from '@/lib/gtm.js';

export default {
  components: {
    Section,
    LoadingOverlay,
    ImageCard,
    ConfirmOverlay,
    CourseCheckoutModal,
    CourseCardBody
  },
  data() {
    return {
      isLoading: false,
      recommendedCourseUUID: null
    };
  },
  computed:{
    recommendedCourse(){
      for (const course of this.courses){
        if (course.UUID === this.recommendedCourseUUID){
          return course;
        }
      }
      return null;
    },
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

      if (this.$route.query.courseUUID){
        for (let i = 0; i < courses.length; i++){
          if (courses[i].UUID === this.$route.query.courseUUID){
            let temp = courses[0];
            courses[0] = courses[i];
            courses[i] = temp;
            break;
          }
        }
      }
      console.log(courses);
      return courses;
    }
  },
  async mounted(){
    try{
      let recommendations = await getCourseRecommendations();
      if (recommendations.length > 0){
        this.recommendedCourseUUID = recommendations[0].UUID;
      }
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
      // selected course SHOULD be set as the first in the list
      this.clickBuyCourse(this.courses[0].UUID, this.courses[0].GemCost, this.courses[0].IsPurchased, false, 0);
    }
  },
  methods: {
    linkClick(url) {
      window.open(url, '_blank');
    },
    showModal(i){
      if (typeof i === 'undefined'){
        this.$refs['modalRecommended'].show();
        return;
      }
      this.$refs['modal'][i].show();
    },
    clickBuyCourse(courseUUID, gemAmount, isPurchased, isDemo, i){
      if (isPurchased) {
        this.$router.push({name: 'Exercise', params: {courseUUID}});
        return;
      }
      if (this.$store.getters.getBalance < gemAmount){
        this.showModal(i);
        return;
      }
      this.$refs['confirmPurchase'].openNav(
        `Would you like to purchase this ${isDemo ? 'demo' : 'course'} for ${gemAmount} gems?`,
        async () => {
          try {
            if (isDemo) {
              await purchaseDemoCourse(courseUUID);
              gtmEventPurchaseCourseDemo(gemAmount);
            } else {
              await purchaseCourse(courseUUID);
              gtmEventPurchaseCourse(gemAmount);
            }
            await loadCourses(this);
            const lastGemTransaction = await getLastGemTransaction();
            this.$store.commit('setBalance', lastGemTransaction.Balance);
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

.flex-1 {
  flex: 1;
}

.root {
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

.recommended-card {
  max-width: 600px;
  margin: 20px 0 0 0;

  @media (max-width: $mobile-size) {
    min-width: 200px;
    flex: 1 1 200px;
  }

  .body {
    height: 100%;
    @media (min-width: $mobile-size) {
      border-left: 1px solid $gray-lightest;
    }
  }
}

.card {
  $margin: 20px;
  flex: 1 1 200px;
  margin: $margin;
  max-width: 300px;
  min-width: 200px;
  height: calc(100% - #{$margin});

  .body {
    height: 100%;
  }
}
</style>
