<template>
  <ViewNavWrapper>
    <LoadingOverlay :is-loading="isLoading" />
    <div
      class="md:p-4 sm:p-0 h-full-minus-bar overflow-auto flex flex-col justify-start items-center"
    >
      <Section
        class="mb-5 max-w-6xl w-full"
        title="Unlock full access to the lessons and projects that build a strong portfolio"
        subtitle="There is no risk to you! If you don't like the program, we have a 30-day money-back guarantee and it's easy to cancel."
      >
        <div class="p-8">
          <header
            v-if="$store.getters.getUserIsSubscribed"
            class="flex flex-col items-center my-8"
          >
            <h2 class="text-2xl text-primary-normal font-bold">
              You are already a patron. Go take some courses!
            </h2>
          </header>

          <PricingSkeleton v-if="!subscriptionPlan" />

          <section
            v-if="priceYearly && priceMonthly && priceLifetime"
            class="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 w-full"
          >
            <div
              class="px-6 py-8 text-center rounded bg-gray-750 text-white items-center flex flex-col h-full w-full"
            >
              <h3 class="text-4xl font-bold">
                {{ getCurrencySymbol(priceMonthly.CurrencyCode)
                }}{{ priceMonthly.UnitAmountPerMonth / 100 }} / mo
              </h3>
              <p class="mb-4 text-gray-400">paid monthly</p>
              <p class="mb-4">Small monthly payments.</p>
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

            <div
              class="px-6 py-8 text-center rounded bg-blue-600 items-center flex flex-col h-full w-full"
            >
              <h3 class="text-4xl font-bold">
                {{ getCurrencySymbol(priceYearly.CurrencyCode)
                }}{{ priceYearly.UnitAmountPerMonth / 100 }} / mo
              </h3>
              <p class="mb-4 text-blue-300">paid yearly</p>
              <p class="mb-4">
                A whole year for
                {{
                  Math.round(
                    ((priceMonthly.UnitAmountPerMonth -
                      priceYearly.UnitAmountPerMonth) *
                      100) /
                      priceMonthly.UnitAmountPerMonth
                  )
                }}% less.
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
              <span class="rounded-lg border-white border-2 text-white px-2">
                Best Value
              </span>
            </div>

            <div
              class="px-6 py-8 text-center rounded bg-gray-750 items-center flex flex-col h-full w-full"
            >
              <h3 class="text-4xl font-bold">
                {{ getCurrencySymbol(priceLifetime.CurrencyCode)
                }}{{ priceLifetime.UnitAmount / 100 }}
              </h3>
              <p class="mb-4 text-gray-400">once</p>
              <p class="mb-4">Never be charged again.</p>
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
          </section>
          <div
            v-if="!$store.getters.getIsLoggedIn"
            class="mt-8 flex justify-center"
          >
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
        </div>
      </Section>

      <Section
        class="mb-5 max-w-6xl w-full"
        title="As a patron you will unlock:"
      >
        <div class="p-8 text-lg">
          <h3 class="text-2xl text-blue-400 font-bold">
            Complete access to the computer science career path
          </h3>
          <p class="mb-4">
            A single payment plan gets you access to everything you need. The CS
            concepts our lessons focus on are designed to set you apart in the
            job market.
          </p>

          <h3 class="text-2xl text-blue-400 font-bold">
            A simple path to your first developer job
          </h3>
          <p class="mb-4">
            As you complete lessons you'll be developing a portfolio of projects
            and certificates that qualify you for entry-level programming jobs.
          </p>

          <h3 class="text-2xl text-blue-400 font-bold">
            Extra support from our creators and community
          </h3>
          <p class="mb-4">
            You'll get access to our patron-only priority Discord chat.
          </p>

          <h3 class="text-2xl text-blue-400 font-bold">A no-risk education</h3>
          <p class="mb-4">
            Our curriculum costs less than 5% of a typical Bootcamp or college
            degree. If you don't like our program, we'll even refund you!
          </p>

          <h3 class="text-2xl text-blue-400 font-bold">
            A warm, fuzzy feeling
          </h3>
          <p class="mb-4">
            We're a small team of 2 creators - we appreciate your support!
          </p>
        </div>
      </Section>

      <Section
        title="Join our network of over 400 patrons"
        subtitle="We can't wait to see you in the Discord"
        class="mb-5 max-w-6xl w-full"
      >
        <div class="flex justify-center">
          <div class="max-w-4xl flex flex-col py-8">
            <Testimonial
              class="mb-5"
              :profile-image-u-r-l="ozyImage"
              title="Özgür Yildirim from Esslingen, Germany"
              description="I wanted to learn to code, but boot camp and university weren't an option because of work and family. I came across Boot.dev, and the simple path to a new career was huge for me. I now have a job-offer in hand!"
            />
            <Testimonial
              class="mb-5"
              :profile-image-u-r-l="meganImage"
              title="Megan Astraus from Arizona, USA"
              description="The wealth of knowledge from the hungry programmers in the Boot.dev Discord helped me land my first software developer job just a month after joining!"
            />
            <Testimonial
              class="mb-5"
              :profile-image-u-r-l="danielImage"
              title="Daniel Gerep from Cássia, Brazil"
              description="I'm a senior engineer learning Go, and the pace of Boot.dev courses has been perfect for me. The members of the Discord are quick to help out with detailed answers and explanations."
            />
            <Testimonial
              :profile-image-u-r-l="ignacioImage"
              title="Ignacio Contreras from Guanajuato, Mexico"
              description="I love how simple it is to get going with the learning path on Boot.dev. As soon as I logged in I connected with real developers and got started learning computer science."
            />
          </div>
        </div>
      </Section>

      <FAQ class="max-w-6xl w-full" />
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
