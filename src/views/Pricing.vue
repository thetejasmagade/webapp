<template>
  <div class="root">
    <TopNav title="Qvault Pricing" />
    <LoadingOverlay :is-loading="isLoading" />

    <div class="subcontainer">
      <Section
        class="mb-5"
        title="Pricing"
        subtitle="Love it or your money back! Enjoy a 7-day free trial, 30-day money-back guarantee, and cancel anytime."
      >
        <div class="p-4">
          <div class="flex justify-center items-center">
            <div class="">
              <div class="text-center font-semibold">
                <p
                  v-if="$store.getters.getUserIsSubscribed"
                  class="text-xl text-gray-400 font-normal w-full px-8 md:w-full"
                >
                  You're already subscribed. Go take some courses!
                </p>
                <p class="text-xl text-gray-500 font-normal w-full px-8 md:w-full">
                  Learn, practice, and apply career-building skills with a Pro account
                </p>
              </div>

              <div
                v-if="subscriptionPlan && subscriptionPlanPrices.length == 2"
                class="pt-24 flex flex-row mb-5"
              >
                <div class="w-96 p-8 bg-white text-center rounded-3xl pr-16 shadow-xl">
                  <h1 class="text-black font-semibold text-2xl">
                    {{ subscriptionPlanPrices[0].Title }}
                  </h1>
                  <p class="pt-2 tracking-wide">
                    <span class="text-gray-400 align-top">$ </span>
                    <span class="text-3xl font-semibold"> {{ subscriptionPlanPrices[0].UnitAmountPerMonth / 100 }}</span>
                    <span class="text-gray-400 font-medium"> / month</span>
                  </p>
                  <hr class="mt-4 border-1">
                  <div class="pt-8">
                    <ul class="ml-5 list-disc font-semibold text-gray-400 text-left">
                      <li
                        v-for="(feature, k) of subscriptionPlan.Features"
                        :key="k"
                      >
                        {{ feature }}
                      </li>
                    </ul>

                    <BlockButton
                      class="m-5"
                      :click="() => {checkout(subscriptionPlanPrices[0])}"
                    >
                      Start 7-day trial
                    </BlockButton>
                  </div>
                </div>

                <div class="w-80 p-10 bg-gray-900 text-center rounded-3xl text-white border-4 shadow-xl border-white transform scale-125">
                  <h1 class="text-white font-semibold text-2xl">
                    {{ subscriptionPlanPrices[1].Title }}
                  </h1>
                  <p class="pt-2 tracking-wide">
                    <span class="text-gray-400 align-top">$ </span>
                    <span class="text-3xl font-semibold">{{ subscriptionPlanPrices[1].UnitAmountPerMonth / 100 }}</span>
                    <span class="text-gray-400 font-medium"> / month</span>
                  </p>
                  <hr class="mt-4 border-1 border-gray-600">
                  <div class="pt-8">
                    <ul class="ml-5 list-disc font-semibold text-gray-300 text-left">
                      <li
                        v-for="(feature, k) of subscriptionPlan.Features"
                        :key="k"
                      >
                        {{ feature }}
                      </li>
                    </ul>

                    <BlockButton
                      class="m-5"
                      :click="() => {checkout(subscriptionPlanPrices[1])}"
                    >
                      Start 7-day trial
                    </BlockButton>
                  </div>
                  <div class="absolute top-4 right-4">
                    <p class="bg-gold-600 font-semibold px-4 py-1 rounded-full uppercase text-xs">
                      Popular
                    </p>
                  </div>
                </div>

                <div class="w-96 p-8 bg-white text-center rounded-3xl pl-16 shadow-xl">
                  <h1 class="text-black font-semibold text-2xl">
                    Basic
                  </h1>
                  <p class="pt-2 tracking-wide">
                    <span class="text-gray-400 align-top">$ </span>
                    <span class="text-3xl font-semibold">0</span>
                    <span class="text-gray-400 font-medium"> / month</span>
                  </p>
                  <hr class="mt-4 border-1">
                  <div class="pt-8">
                    <ul class="ml-5 list-disc font-semibold text-gray-400 text-left">
                      <li>Access to read all course material</li>
                      <li>Limited code sandbox for exercises</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Frequently Asked Questions"
        subtitle="Interested in upgrading but unsure what that entails?"
      >
        <div class="px-4">
          <h2 class="text-xl my-4 text-gold-700">
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

          <h2 class="text-xl my-4 text-gold-700">
            Do you offer any discounts?
          </h2>
          <p>
            We do promotions from time to time, and currently we're offering a <a
              target="_blank"
              href="https://forms.gle/ubTii5KXCMCg84u78"
            >25% discount to anyone who completes this feedback form.</a>
            Our top priority is improving the courses, the app, and your experience so your feedback is super valuable to us.
            When you're finished with the survey you'll be given a coupon code!
          </p>

          <h2 class="text-xl my-4 text-gold-700">
            Do I need to know how to code before signing up?
          </h2>
          <p>
            No, in fact many of our students have zero experience when they sign up.
            Our "Basic Intro to Coding" courses are built just for you.
          </p>

          <h2 class="text-xl my-4 text-gold-700">
            Why should I upgrade to Qvault Pro?
          </h2>
          <p>
            I built Qvault based on the lessons I've been learning as a technical hiring manager, so everything we do here is designed
            to lead you to a high-paying programming job. If you’re ready to accelerate your learning and apply the skills you learn to real-world scenarios,
            then Qvault Pro is for you.
          </p>
          <p>
            Aside from the direct benefits, if you like what we're building here at Qvault, your support helps us
            improve the platform. We're a small organization that's just starting out, so the more people subscribe, the better the product will be.
          </p>

          <h2 class="text-xl my-4 text-gold-700">
            How do I cancel my subscription?
          </h2>
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
import TopNav from '@/components/TopNav.vue';
import Section from '@/components/Section.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import BlockButton from '@/components/BlockButton.vue';
import { checkout } from '@/lib/stripewrap.js';
import { loadUser, loadSubscriptionPlans } from '@/lib/cloudStore.js';
import { trackUserCancelCheckout } from '@/lib/cloudClient.js';
import { notify } from '@/lib/notification.js';

export default {
  metaInfo() {
    const title = 'Qvault - Pricing';
    const featuredImage = 'https://qvault.io/wp-content/uploads/2021/04/qvault-social-banner-1024x576.jpg';
    const description = 'Anyone can get a discount on Qvault Pro! Take our feedback survey and we\'ll hook you up with a lower-cost monthly subscribtion.';
    return {
      title: title,
      meta: [
        { vmid:'description', name: 'description', content: description },

        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'og:description', property: 'og:description', content: description },
        { vmid:'og:image', property: 'og:image', content: featuredImage },

        { vmid:'twitter:title', name: 'twitter:title', content: title },
        { vmid:'twitter:description', property: 'twitter:description', content: description },
        { vmid:'twitter:image', name: 'twitter:image', content: featuredImage }
      ]
    };
  },
  components: {
    TopNav,
    LoadingOverlay,
    Section,
    BlockButton
  },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    subscriptionPlan() {
      if (this.$store.getters.getSubscriptionPlans.length === 0){
        return null;
      }
      return this.$store.getters.getSubscriptionPlans[0];
    },
    subscriptionPlanPrices(){
      if (!this.subscriptionPlan){
        return null;
      }
      return this.subscriptionPlan.Prices;
    }
  },
  async mounted() {
    loadSubscriptionPlans(this);
    if (this.$store.getters.getIsLoggedIn){
      loadUser(this);
    }
    if (this.$route.query.cancel && this.$route.query.cancel === 'true'){
      try {
        await trackUserCancelCheckout();
      } catch (err){
        console.log(err);
      }
    }
  },
  methods: {
    async checkout(price) {
      if (!this.$store.getters.getIsLoggedIn){
        this.$router.push({name: 'Login'});
        return;
      }

      this.isLoading = true;
      try {
        await checkout(price);
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>

</style>
