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
        <div class="body">
          <CourseCheckoutModal
            ref="modalRecommended"
            :course="recommendedCourse"
            :user-has-already-bought-courses="userHasAlreadyBoughtCourses"
          />
          <ImageCard
            direction="row"
            :img-src="recommendedCourse.ImageURL"
            class="recommended-card"
            :click="() => {clickOnCourse(recommendedCourse.UUID, recommendedCourse.GemCost, recommendedCourse.IsPurchased) }"
          >
            <div
              class="body"
            >
              <DifficultyBar 
                class="margin-top-2"
                :difficulty="recommendedCourse.Difficulty"
              />
            
              <span class="title item">
                {{ recommendedCourse.Title }}
              </span>

              <div
                v-if="recommendedCourse.IsComplete"
                class="completed item"
              >
                <FontAwesomeIcon
                  icon="check"
                />
                <span>Complete</span>
              </div>
              <div
                v-else-if="recommendedCourse.IsPurchased"
                class="purchased item"
              >
                <FontAwesomeIcon
                  icon="check"
                />
                <span>Purchased</span>
              </div>
              <GemDisplay
                v-else
                :size="2"
                class="item"
                :text="`${recommendedCourse.GemCost}`"
              />

              <div class="item links">
                <span
                  class="link"
                  @click.stop="() => {$router.push({name: 'Demo', params: {courseUUID: recommendedCourse.UUID}});}"
                >Start Demo</span>
                <span
                  class="gray link"
                  target="_blank"
                  @click.stop="() => {linkClick(recommendedCourse.LandingPage)}"
                >More Info</span>
              </div>
            </div>
          </ImageCard>
        </div>
      </Section>

      <Section
        title="All Courses"
        subtitle="Browse all of our content, new courses are released frequently"
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
              :click="() => {clickOnCourse(course.UUID, course.GemCost, course.IsPurchased, i) }"
            >
              <div
                class="body"
              >
                <DifficultyBar 
                  :difficulty="course.Difficulty"
                />
            
                <span class="title item">
                  {{ course.Title }}
                </span>

                <div
                  v-if="course.IsComplete"
                  class="completed item"
                >
                  <FontAwesomeIcon
                    icon="check"
                  />
                  <span>Complete</span>
                </div>
                <div
                  v-else-if="course.IsPurchased"
                  class="purchased item"
                >
                  <FontAwesomeIcon
                    icon="check"
                  />
                  <span>Purchased</span>
                </div>
                <GemDisplay
                  v-else
                  :size="2"
                  class="item"
                  :text="`${course.GemCost}`"
                />

                <div class="item links">
                  <span
                    class="link"
                    @click.stop="() => {$router.push({name: 'Demo', params: {courseUUID: course.UUID}});}"
                  >Start Demo</span>
                  <span
                    class="gray link"
                    target="_blank"
                    @click.stop="() => {linkClick(course.LandingPage)}"
                  >More Info</span>
                </div>
              </div>
            </ImageCard>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Section from '@/components/Section';
import LoadingOverlay from '@/components/LoadingOverlay';
import ImageCard from '@/components/ImageCard';
import ConfirmOverlay from '@/components/ConfirmOverlay';
import GemDisplay from '@/components/GemDisplay';
import DifficultyBar from '@/components/DifficultyBar';
import CourseCheckoutModal from '@/components/CourseCheckoutModal';

import { 
  getCourses,
  purchaseCourse,
  getLastGemTransaction,
  getCourseRecommendations
} from '@/lib/cloudClient.js';

import { gtmEventPurchaseCourse } from '@/lib/gtm.js';

export default {
  components: {
    Section,
    LoadingOverlay,
    FontAwesomeIcon,
    ImageCard,
    ConfirmOverlay,
    GemDisplay,
    DifficultyBar,
    CourseCheckoutModal
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
      // selected course SHOULD be set as the first in the list
      this.clickOnCourse(this.courses[0].UUID, this.courses[0].GemCost, this.courses[0].IsPurchased, 0);
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
    clickOnCourse(courseUUID, gemAmount, isPurchased, i){
      if (isPurchased) {
        this.$router.push({name: 'Exercise', params: {courseUUID}});
        return;
      }
      if (this.$store.getters.getBalance < gemAmount){
        this.showModal(i);
        return;
      }
      this.$refs['confirmPurchase'].openNav(
        `Would you like to purchase this course for ${gemAmount} gems?`,
        async () => {
          try {
            await purchaseCourse(courseUUID);
            gtmEventPurchaseCourse(gemAmount);
            this.loadCourses();
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
    },
    readMore(url) {
      window.open(url, '_blank');
    },
    async loadCourses() {
      try {
        const courses = await getCourses();
        this.$store.commit('setCourses', courses);
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

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

.recommended-section {
  .body {
    display: flex;
    justify-content: center;
  }
}

.recommended-card {
  margin-top: 1em;
  max-width: 600px;

  .body {
    height: 100%;
    padding: 0 1em 0 1em;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.links {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.item{
  margin: 0em 1em 1em 1em;
}

.title {
  color: $gold-dark;
  font-size: 1.5em;
}

.description {
  color: $white;
  font-weight: 400;
  line-height: 1.3em;
  font-size: 1em;
}

.completed {
  color: $green-light;

  span {
    margin-left: 10px;
  }
}

.purchased {
  color: $gold-lighter;

  span {
    margin-left: 10px;
  }
}

</style>
