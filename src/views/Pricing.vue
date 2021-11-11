<template>
  <div>
    <TopNav title="Qvault Pricing" />
    <LoadingOverlay :is-loading="isLoading" />

    <div class="md:p-4 sm:p-0">
      <Section
        class="mb-5"
        title="Pricing"
        subtitle="Love it or your money back! Enjoy a free trial, 30-day money-back guarantee, and feel free to cancel anytime."
      >
        <header class="flex flex-col items-center my-8">
          <h2
            v-if="$store.getters.getUserIsSubscribed"
            class="text-2xl text-primary-normal font-bold"
          >
            You're already subscribed. Go take some courses!
          </h2>
        </header>
        <section
          v-if="priceYearly && priceMonthly && priceLifetime"
          class="
            grid
            md:grid-cols-2 sm:grid-cols-1
            gap-4
            md:p-4 sm:p-0
            w-full
          "
        >
          <div class="flex items-center justify-center">
            <article
              class="
              shadow-lg
              px-6
              py-8
              text-white
              text-center
              rounded-lg
              bg-blue-800
              items-center
              flex
              flex-col
              max-w-xl
              h-full
              w-full
            "
            >
              <h2 class="flex justify-center pb-4 font-bold border-gray-200">
                <span class="text-6xl ">Professional</span>
              </h2>
              <h3 class="font-bold text-xl mb-4">
                Learn, practice & get certified on job-ready skills.
              </h3>
              <ul class="text-sm font-bold w-64 mb-4">
                <li
                  v-for="(feature, k) of subscriptionPlan.Features"
                  :key="k"
                  :class="{'border-t': k=== 0}"
                  class="py-1 border-b border-gray-200"
                >
                  {{ feature }}
                </li>
              </ul>
              <div v-if="!$store.getters.getUserIsSubscribed">
                <div v-if="$store.getters.getIsLoggedIn">
                  <BlockButton
                    color="white"
                    class="mb-4 py-2 w-72"
                    :click="() => {checkout(priceLifetime)}"
                  >
                    Lock-in Lifetime Price - {{ getCurrencySymbol(priceLifetime.CurrencyCode) }}{{ priceLifetime.UnitAmount / 100 }}
                  </BlockButton>
                  <BlockButton
                    color="blue"
                    class="mb-4 w-72 py-2"
                    :click="() => {checkout(priceYearly)}"
                  >
                    7-day Free Trial, then {{ getCurrencySymbol(priceYearly.CurrencyCode) }}{{ (priceYearly.UnitAmountPerMonth * 12) / 100 }}/year
                  </BlockButton>
                  <BlockButton
                    color="blue"
                    class="w-72 py-2"
                    :click="() => {checkout(priceMonthly)}"
                  >
                    7-day Free Trial, then {{ getCurrencySymbol(priceMonthly.CurrencyCode) }}{{ priceMonthly.UnitAmountPerMonth / 100 }}/month
                  </BlockButton>
                </div>
                <div v-else>
                  <BlockButton
                    color="white"
                    class="w-72 py-2"
                    :click="() => {$router.push({name: 'Login', query: {redirect: '/pricing'}})}"
                  >
                    Login to Start
                  </BlockButton>
                </div>
              </div>
            </article>
          </div>
          <div class="flex items-center justify-center">
            <article
              class="
              shadow-lg
              px-6
              py-8
              text-center
              rounded-lg
              bg-white
              items-center
              flex
              flex-col
              max-w-xl
              h-full
              w-full
            "
            >
              <h2 class="flex justify-center pb-4 font-bold border-gray-200">
                <span class="text-6xl">Basic</span>
              </h2>
              <h3 class="font-bold text-xl mb-4">
                Interactive lessons & daily practice.
              </h3>
              <ul class="text-sm font-bold w-64">
                <li class="py-1 border-b border-t border-gray-300">
                  Read-only access to courses
                </li>
                <li class="py-1 border-b border-gray-300">
                  Limited coding sandbox
                </li>
                <li class="py-1 border-b border-gray-300">
                  -
                </li>
                <li class="py-1 border-b border-gray-300">
                  -
                </li>
                <li class="py-1 border-b border-gray-300">
                  -
                </li>
                <li class="py-1 border-b border-gray-300">
                  -
                </li>
              </ul>
            </article>
          </div>
        </section>
      </Section>

      <Section
        title="Frequently Asked Questions"
        subtitle="Interested in upgrading but unsure what that entails?"
      >
        <div class="px-4">
          <h2 class="text-xl my-4 text-gold-700">
            What's the difference between Basic and Pro?
          </h2>
          <p class="mb-4">
            A basic account is, well, basic. You can demo Pro features on the first 6 exercises of each course, but after that if you're on
            a basic plan, you'll only be able to read the course material and play in the code sandbox. You won't pass off assignments or know if you
            got the right answers.
          </p>
          <p class="mb-4">
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
          <p class="mb-4">
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

          <h2 class="text-xl my-4 text-gold-700">
            What if I don't enjoy my Pro account?
          </h2>
          <p>
            Hopefully you can figure out if you're enjoying the content within your 7-day free trial,
            because you can always cancel before you're charged for the first time. That said, if you wait too long,
            you can take advantage of our <a href="https://qvault.io/return-policy/">return policy.</a>
            If you contact us within 30 days of your purchase you're entitled to a full refund.
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
import { useMeta } from 'vue-meta';

export default {
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
    priceYearly(){
      if (!this.subscriptionPlan){
        return null;
      }
      for (const price of this.subscriptionPlan.Prices){
        if (price.Interval === 'year'){
          return price;
        } 
      }
      return null;
    },
    priceMonthly(){
      if (!this.subscriptionPlan){
        return null;
      }
      for (const price of this.subscriptionPlan.Prices){
        if (price.Interval === 'month'){
          return price;
        } 
      }
      return null;
    },
    priceLifetime(){
      if (!this.subscriptionPlan){
        return null;
      }
      for (const price of this.subscriptionPlan.Prices){
        if (price.Interval === 'once'){
          return price;
        }
      }
      return null;
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

    const title = 'Pricing';
    const featuredImage = 'https://qvault.io/wp-content/uploads/2021/04/qvault-social-banner-1024x576.jpg';
    const description = 'Anyone can get a discount on Qvault Pro! Take our feedback survey and we\'ll hook you up with a lower-cost monthly subscribtion.';
    useMeta({
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
    });
  },
  methods: {
    getCurrencySymbol(code){
      if (code === 'inr'){
        return '₹';
      }
      return '$';
    },
    async checkout(price) {
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
