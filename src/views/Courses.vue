<template>
  <div
    id="container"
  >
    <LoadingOverlay
      :is-loading="isLoading" 
    />
    <ConfirmOverlay
      ref="confirmPurchase"
    />
    <div id="title">
      <span>
        Courses
      </span>
    </div>

    <div id="sub-title">
      <span>
        Learn to code. Earn bonus gems by completing exercises and unlocking achievements
      </span>
    </div>

    <div id="cards">
      <ImageCard
        v-for="(course, i) of courses"
        :key="i"
        :img-src="course.ImageURL"
        class="card"
        :click="() => {clickOnCourse(course.UUID, course.GemCost, course.IsPurchased,course.product.ID) }"
      >
        <div
          :ref="`cardbody${i}`"
          class="body"
        >
          <DifficultyBar 
            :difficulty="course.Difficulty"
          />
            
          <p class="title item">
            {{ course.Title }}
          </p>

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
            :cost="course.GemCost"
          />

          <BlockButton
            class="item"
            :click="() => {clickOnCourse(course.UUID, course.GemCost, course.IsPurchased,course.product.ID) }"
            color="purple"
          >
            Unlock
          </BlockButton>

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
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LoadingOverlay from '@/components/LoadingOverlay';

import ImageCard from '@/components/ImageCard';
import ConfirmOverlay from '@/components/ConfirmOverlay';
import GemDisplay from '@/components/GemDisplay';
import DifficultyBar from '@/components/DifficultyBar';
import BlockButton from '@/components/BlockButton';
import { publicKey } from '@/lib/stripeConsts';

import { 
  getCourses,
  purchaseCourse,
  getLastGemTransaction,
  startProductCheckout
} from '@/lib/cloudClient.js';

import { gtmEventPurchaseCourse } from '@/lib/gtm.js';

import { loadStripe } from '@stripe/stripe-js';

export default {
  components: {
    LoadingOverlay,
    BlockButton,
    FontAwesomeIcon,
    ImageCard,
    ConfirmOverlay,
    GemDisplay,
    DifficultyBar
  },
  data() {
    return {
      isLoading: false
    };
  },
  computed:{
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
        courses[i].product = products[0];
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
  methods: {
    linkClick(url) {
      window.open(url, '_blank');
    },
    clickOnCourse(courseUUID, gemAmount, isPurchased, productID){
      if (isPurchased) {
        this.$router.push({name: 'Exercise', params: {courseUUID}});
        return;
      }
      if (this.$store.getters.getBalance < gemAmount){
        this.checkout(productID);
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
    async checkout(productID){
      this.isLoading = true;
      const checkoutSession = await startProductCheckout(productID);
      const stripe = await loadStripe(publicKey);
      await stripe.redirectToCheckout({
        sessionId: checkoutSession.id
      });
      this.isLoading = false;
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

#container {
  display: block;
  flex-direction: column;
  text-align: center;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow: auto;
  background-image: linear-gradient(135deg, transparent 0%, transparent 6%,rgba(71, 71, 71,0.04) 6%, rgba(71, 71, 71,0.04) 22%,transparent 22%, transparent 100%),linear-gradient(45deg, transparent 0%, transparent 20%,rgba(71, 71, 71,0.04) 20%, rgba(71, 71, 71,0.04) 47%,transparent 47%, transparent 100%),linear-gradient(135deg, transparent 0%, transparent 24%,rgba(71, 71, 71,0.04) 24%, rgba(71, 71, 71,0.04) 62%,transparent 62%, transparent 100%),linear-gradient(45deg, transparent 0%, transparent 73%,rgba(71, 71, 71,0.04) 73%, rgba(71, 71, 71,0.04) 75%,transparent 75%, transparent 100%),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255));
}

#title{
  padding: 20px;
  position: relative;
  color: $gray-dark;
  font-size: 3em;
}

#sub-title {
  text-align: center;
  color: $gray-mid;
  font-size: 1.5em;
  margin-bottom: 20px;
}

#cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;

  .card {
    flex: 1 1 calc(22% - 1em);
    margin: 20px;
    max-width: 400px;
    min-width: 300px;

    .body {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .links {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
      }

      .info-circle{
        color: white;
        font-size: 1em;
      }

      .item{
        margin: 0em 1em 1em 1em;
      }

      .title {
        color: $gold-dark;
        font-size: 1.5em;
        margin: 0em;
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
    }
  }
}

</style>
