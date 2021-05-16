<template>
  <div class="root">
    <LoadingOverlay :is-loading="isLoading" />

    <div class="subcontainer">
      <Section
        class="section"
        title="Pro Pricing"
        subtitle="Thanks for supporting the project! All purchases have a 7-day free trial and a 30-day money-back guarantee"
      >
        <div class="section-body">
          <h2
            v-if="$store.getters.getUserIsSubscribed"
          >
            You're already subscribed. Go take some courses!
          </h2>
          <h2
            v-else
          >
            Learn, practice, and apply career-building skills with a Pro account
          </h2>
          <div
            v-for="(subscriptionPlan, i) of subscriptionPlans"
            :key="i"
            class="cards"
          >
            <ImageCard
              v-for="(price, j) of subscriptionPlan.Prices"
              :key="j"
              class="card"
              :class="{'popular': price.MostPopular}"
              theme="light"
              :img-src="price.ImageURL"
              :click=" $store.getters.getUserIsSubscribed ? null :
                () => {
                  checkout(price);
                }
              "
            >
              <div class="body">
                <div class="title">
                  <span> {{ price.Title }}</span>
                </div>

                <div class="price">
                  <span>${{ price.UnitAmountPerMonth / 100 }} / month </span>
                </div>

                <ul>
                  <li
                    v-for="(feature, k) of subscriptionPlan.Features"
                    :key="k"
                  >
                    {{ feature }}
                  </li>
                </ul>

                <div
                  v-if="price.MostPopular"
                  class="pill"
                >
                  <span class="gold"> Most Popular </span>
                </div>
              </div>
            </ImageCard>
            <ImageCard
              class="card"
              theme="light"
              img-src="https://qvault.io/wp-content/uploads/2021/03/promonthly-300x169.jpg"
            >
              <div class="body">
                <div class="title">
                  <span> Basic </span>
                </div>

                <div class="price gray">
                  <span> $0 </span>
                </div>

                <ul>
                  <li>Access to read all course material</li>
                  <li>Limited code sandbox for exercises</li>
                </ul>
              </div>
            </ImageCard>
          </div>
        </div>
      </Section>

      <Section
        class="section"
        title="Frequently Asked Questions"
        subtitle="Interested in upgrading but unsure what that entails?"
      >
        <div class="section-body">
          <h2>
            What's the difference between Basic and Pro?
          </h2>
          <p>
            A basic account is, well, basic. You can demo Pro features on the first 6 exercises of each course, but after that if you're on
            a basic plan, you'll only be able to read the course material and play in the code sandbox. You won't pass off assignments or know if you
            got the right answers.
          </p>
            
          <p>
            Qvault Pro has everything in Basic,
            plus all the advanced tools, content, solutions and certifications that you
            need to make your learning faster.
          </p>
          <p>
            A Pro account lets you practice much more efficiently by getting instant verification of all your code
            solutions. If you get stuck, you can use the "cheat" feature to take a look at the solution
            and quickly see what's holding you up. Additionally, one of the biggest benefits our Pro subscribers get is access to free certificates
            of completion when they finish a course. Showing off your work to employers is a quick way to get that high-paying tech job.
          </p>

          <h2> Do you offer any discounts? </h2>
          <p>
            We do promotions from time to time, and currently we're offering a <a
              target="_blank"
              href="https://forms.gle/ubTii5KXCMCg84u78"
            >25% discount to anyone who completes this feedback form.</a>
            Our top priority is improving the courses, the app, and your experience so your feedback is super valuable to us.
            When you're finished with the survey you'll be given a coupon code!
          </p>

          <h2> Do I need to know how to code before signing up? </h2>
          <p>
            No, in fact many of our students have zero experience when they sign up.
            Our "Basic Intro to Coding" courses are built just for you.
          </p>

          <h2> Why should I upgrade to Qvault Pro? </h2>
          <p>
            I built Qvault based on the lessons I've been learning as a technical hiring manager, so everything we do here is designed
            to lead you to a high-paying programming job. If you’re ready to accelerate your learning and apply the skills you learn to real-world scenarios,
            then Qvault Pro is for you.
          </p>
          <p>
            Aside from the direct benefits, if you like what we're building here at Qvault, your support helps us
            improve the platform. We're a small organization that's just starting out, so the more people subscribe, the better the product will be.
          </p>

          <h2> How do I cancel my subscription? </h2>
          <p>
            We do our best to be transparent about pricing, and never want anyone keeping
            a subscription they don't use. You can cancel your subscription any time from your <a href="/dashboard/settings">settings page</a>
            and you won't be billed again.
          </p>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import Section from '@/components/Section.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import ImageCard from '@/components/ImageCard.vue';
import { checkout } from '@/lib/stripewrap.js';
import { loadUser } from '@/lib/cloudStore.js';
import { trackUserCancelCheckout } from '@/lib/cloudClient.js';

export default {
  metaInfo() {
    const title = 'Qvault - Pro Pricing';
    return {
      title: title,
      meta: [
        { vmid: 'og:title', property: 'og:title', content: title },
        { vmid: 'twitter:title', name: 'twitter:title', content: title }
      ]
    };
  },
  components: {
    ImageCard,
    LoadingOverlay,
    Section
  },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    subscriptionPlans() {
      return this.$store.getters.getSubscriptionPlans;
    }
  },
  async mounted() {
    loadUser(this);
    if (this.$route.query.cancel && this.$route.query.cancel === 'true'){
      try{
        await trackUserCancelCheckout();
      } catch (err){
        console.log(err);
      }

    }
  },
  methods: {
    async checkout(price) {
      this.isLoading = true;
      try {
        await checkout(price);
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/consts.scss";

.root {
  display: block;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow: auto;
  min-height: calc(100vh - #{$bar-height});

  a {
    text-decoration: none;
  }
}

.cards {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  padding: 1em;

  .card {
    flex: 1;
    margin: 0.5em;
    max-width: 300px;
    min-width: 200px;
    
    &.popular{
      box-shadow: 0 10px 20px 5px $purple-darker;
      border: none;
    }

    .body {
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 1em;

      ul {
        text-align: left;

        li {
          margin-top: 5px;
        }
      }
    }

    .pill {
      span {
        padding: 5px 20px 5px 20px;
        color: $white;
        font-size: 1em;
        border-radius: 16px;

        &.gold {
          background-color: $gold-mid;
        }
      }
      margin-bottom: 1em;
    }

    .title {
      color: $purple-mid;
      font-size: 1.5em;
      margin-bottom: 0.5em;

      span {
        margin-left: 10px;
      }
    }

    .price {
      font-size: 1.25em;
      color: $green-mid;
      margin-bottom: 0.5em;

      &.gray {
        color: $gray-mid;
      }
    }
  }
}

.section {
  margin: 0 0 1em 0;
}

.section-body {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    max-width: 600px;
  }

  h2 {
    color: $gold-dark;
  }
}
</style>
