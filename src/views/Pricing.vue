<template>
  <ViewNavWrapper>
    <LoadingOverlay :is-loading="isLoading" />

    <div class="md:p-4 sm:p-0 h-full-minus-bar overflow-auto">
      <Section
        class="mb-5"
        title="Enjoy premium perks and support Boot.dev by becoming a patron"
        subtitle="Love it or your money back! Enjoy a 30-day money-back guarantee, and feel free to cancel anytime."
      >
        <header class="flex flex-col items-center my-8">
          <h2
            v-if="$store.getters.getUserIsSubscribed"
            class="text-2xl text-primary-normal font-bold"
          >
            You are already a patron. Go take some courses!
          </h2>
        </header>
        <PricingSkeleton v-if="!subscriptionPlan" />
        <section
          v-if="priceYearly && priceMonthly && priceLifetime"
          class="grid md:grid-cols-3 sm:grid-cols-1 gap-4 md:p-4 sm:p-0 w-full"
        >
          <div class="flex items-center justify-center">
            <article
              class="text-center items-center flex flex-col w-full rounded border border-gray-600 overflow-hidden"
            >
              <table class="table-auto border-collapse w-full">
                <thead>
                  <tr class="text-xl bg-gray-700">
                    <th class="px-4 py-2 font-semibold">Basic</th>
                    <th class="px-4 py-2 font-bold">Patron</th>
                  </tr>
                </thead>
                <tbody class="text-sm font-normal">
                  <tr class="border-b border-gray-500 py-10">
                    <td class="px-4 py-2">Read all content</td>
                    <td class="px-4 py-2 font-bold">Read all content</td>
                  </tr>
                  <tr class="border-b border-gray-500 py-4">
                    <td class="px-4 py-2">Code sandbox</td>
                    <td class="px-4 py-2 font-bold">Code sandbox</td>
                  </tr>
                  <tr class="border-b border-gray-500">
                    <td class="px-4 py-2">-</td>
                    <td class="px-4 py-2 font-bold">Code verification</td>
                  </tr>
                  <tr class="border-b border-gray-500">
                    <td class="px-4 py-2">-</td>
                    <td class="px-4 py-2 font-bold">Patron-only chat</td>
                  </tr>
                  <tr class="border-b border-gray-500">
                    <td class="px-4 py-2">-</td>
                    <td class="px-4 py-2 font-bold">Multiple choice quizzes</td>
                  </tr>
                  <tr class="border-b border-gray-500">
                    <td class="px-4 py-2">-</td>
                    <td class="px-4 py-2 font-bold">
                      Certificates of completion
                    </td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2">-</td>
                    <td class="px-4 py-2 font-bold">View full solutions</td>
                  </tr>
                </tbody>
              </table>
            </article>
          </div>
          <div class="flex items-center justify-center md:col-span-2">
            <article
              class="px-6 text-center rounded items-center flex flex-col w-full"
            >
              <div class="grid xl:grid-cols-3 lg:grid-cols-1 gap-4 w-full">
                <div>
                  <div
                    class="px-6 py-8 text-center rounded bg-gray-700 items-center flex flex-col h-full w-full"
                  >
                    <h3 class="text-4xl font-bold">
                      {{ getCurrencySymbol(priceMonthly.CurrencyCode)
                      }}{{ priceMonthly.UnitAmountPerMonth / 100 }} / mo
                    </h3>
                    <p class="mb-4 text-gray-400">monthly</p>
                    <p class="mb-4">Small monthly payments</p>
                    <BlockButton
                      v-if="
                        $store.getters.getIsLoggedIn &&
                        !$store.getters.getUserIsSubscribed
                      "
                      class="mb-4 py-2 w-full"
                      :click="
                        () => {
                          checkout(priceMonthly);
                        }
                      "
                    >
                      Monthly Plan
                    </BlockButton>
                  </div>
                </div>
                <div
                  class="px-6 py-8 text-center rounded bg-blue-500 text-white items-center flex flex-col h-full w-full"
                >
                  <h3 class="text-4xl font-bold">
                    {{ getCurrencySymbol(priceYearly.CurrencyCode)
                    }}{{ priceYearly.UnitAmountPerMonth / 100 }} / mo
                  </h3>
                  <p class="mb-4 text-blue-300">yearly</p>
                  <p class="mb-4">
                    Full access at a
                    {{
                      Math.round(
                        ((priceMonthly.UnitAmountPerMonth -
                          priceYearly.UnitAmountPerMonth) *
                          100) /
                          priceMonthly.UnitAmountPerMonth
                      )
                    }}% discount
                  </p>
                  <BlockButton
                    v-if="
                      $store.getters.getIsLoggedIn &&
                      !$store.getters.getUserIsSubscribed
                    "
                    color="white"
                    class="mb-4 py-2 w-full"
                    :click="
                      () => {
                        checkout(priceYearly);
                      }
                    "
                  >
                    Yearly Plan
                  </BlockButton>
                  <span class="rounded-lg border-white border-2 text-white px-2"
                    >Most Popular</span
                  >
                </div>
                <div
                  class="px-6 py-8 text-center rounded bg-gray-700 items-center flex flex-col h-full w-full"
                >
                  <h3 class="text-4xl font-bold">
                    {{ getCurrencySymbol(priceLifetime.CurrencyCode)
                    }}{{ priceLifetime.UnitAmount / 100 }}
                  </h3>
                  <p class="mb-4 text-gray-400">once</p>
                  <p class="mb-4">Never be charged again</p>
                  <BlockButton
                    v-if="
                      $store.getters.getIsLoggedIn &&
                      !$store.getters.getUserIsSubscribed
                    "
                    class="mb-4 py-2 w-full"
                    :click="
                      () => {
                        checkout(priceLifetime);
                      }
                    "
                  >
                    Lifetime
                  </BlockButton>
                </div>
              </div>
              <div v-if="!$store.getters.getIsLoggedIn" class="mt-8">
                <BlockButton
                  class="w-72 py-2"
                  :click="
                    () => {
                      $router.push({
                        name: 'Login',
                        query: { redirect: '/pricing' },
                      });
                    }
                  "
                >
                  Login to Start
                </BlockButton>
              </div>
            </article>
          </div>
        </section>
      </Section>

      <Section
        title="Join our network of over 400 patrons"
        subtitle="We can't wait to see you in the Discord"
        class="mb-5"
      >
        <div class="flex justify-center">
          <div class="max-w-4xl flex flex-col py-8">
            <Testimonial
              class="mb-10"
              :profile-image-u-r-l="meganImage"
              title="Megan Astraus from Arizona, USA"
              description="My first interaction with Boot.dev was through a resume event where Lane and the community spent a great deal of time combing through my resume and helping me make updates. The wealth of knowledge from the hungry programmers in the Discord helped me land my first software developer job just a month after that resume event!"
            />
            <Testimonial
              class="mb-5"
              :profile-image-u-r-l="danielImage"
              title="Daniel Gerep from Cássia, Brazil"
              description="I’m a senior engineer learning Go, and the pace of Boot.dev courses has been perfect for me. The diverse community in Discord is a blast, and the members are quick to help out with detailed answers and explanations."
            />
            <Testimonial
              class="mb-5"
              :profile-image-u-r-l="ozyImage"
              title="Özgür Yildirim from Esslingen, Germany"
              description="I’m a field service engineer in the biomedical industry. I wanted to learn to code, but boot camp and school weren’t an option because of work and wanting time with my kid! I came across Boot.dev after trying other online courses, and liked that their “Intro to Coding” course got me up and running with JavaScript immediately. They have a simple curriculum and knowing the steps are in place for me to reach my goal is huge for me. As soon as I joined the community on Discord, I knew I’d made the right decision going with Boot.dev."
            />
            <Testimonial
              :profile-image-u-r-l="ignacioImage"
              title="Ignacio Contreras from Guanajuato, Mexico"
              description="I love how simple it is to find relevant content on Boot.dev. As soon as I logged in, I connected with real developers and was recommended an interview prep course that was perfect for my situation."
            />
          </div>
        </div>
      </Section>

      <FAQ />
    </div>
  </ViewNavWrapper>
</template>

<script>
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import Section from "@/components/Section.vue";
import FAQ from "@/components/FAQ.vue";
import Testimonial from "@/components/Testimonial.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import BlockButton from "@/components/BlockButton.vue";
import PricingSkeleton from "@/components/skeletons/PricingSkeleton.vue";
import { checkout } from "@/lib/stripewrap.js";
import { loadUser, loadSubscriptionPlans } from "@/lib/cloudStore.js";
import { trackUserCancelCheckout } from "@/lib/cloudClient.js";
import { notify } from "@/lib/notification.js";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";

import meganImage from "@/img/megan_astraus-300x300.webp";
import danielImage from "@/img/daniel-gerep-300x300.webp";
import ozyImage from "@/img/ozy-300x300.webp";
import ignacioImage from "@/img/0-150x150-1.webp";

export default {
  components: {
    ViewNavWrapper,
    LoadingOverlay,
    Section,
    BlockButton,
    PricingSkeleton,
    Testimonial,
    FAQ,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    meganImage() {
      return meganImage;
    },
    danielImage() {
      return danielImage;
    },
    ozyImage() {
      return ozyImage;
    },
    ignacioImage() {
      return ignacioImage;
    },
    subscriptionPlan() {
      if (this.$store.getters.getSubscriptionPlans.length === 0) {
        return null;
      }
      return this.$store.getters.getSubscriptionPlans[0];
    },
    priceYearly() {
      if (!this.subscriptionPlan) {
        return null;
      }
      for (const price of this.subscriptionPlan.Prices) {
        if (price.Interval === "year") {
          return price;
        }
      }
      return null;
    },
    priceMonthly() {
      if (!this.subscriptionPlan) {
        return null;
      }
      for (const price of this.subscriptionPlan.Prices) {
        if (price.Interval === "month") {
          return price;
        }
      }
      return null;
    },
    priceLifetime() {
      if (!this.subscriptionPlan) {
        return null;
      }
      for (const price of this.subscriptionPlan.Prices) {
        if (price.Interval === "once") {
          return price;
        }
      }
      return null;
    },
  },
  async mounted() {
    loadSubscriptionPlans(this);
    if (this.$store.getters.getIsLoggedIn) {
      loadUser(this.$store.commit);
    }
    if (this.$route.query.cancel && this.$route.query.cancel === "true") {
      try {
        await trackUserCancelCheckout();
      } catch (err) {
        console.log(err);
      }
    }

    const computedMeta = getComputedMeta({
      title: "Pricing",
      description: "Become a patron to unlock all the courses on Boot.dev",
    });
    useMeta(computedMeta);
  },
  methods: {
    getCurrencySymbol(code) {
      if (code === "inr") {
        return "₹";
      }
      return "$";
    },
    async checkout(price) {
      this.isLoading = true;
      try {
        await checkout(price);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped></style>
