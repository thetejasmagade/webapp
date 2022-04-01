<template>
  <ViewNavWrapper>
    <LoadingOverlay :is-loading="isLoading" />

    <div class="md:p-4 sm:p-0 h-full-minus-bar overflow-auto">
      <Section
        class="mb-5"
        title="Support Qvault and enjoy premium features by becoming a patron"
        subtitle="Love it or your money back! Enjoy a 30-day money-back guarantee, and feel free to cancel anytime."
      >
        <header class="flex flex-col items-center my-8">
          <h2
            v-if="$store.getters.getUserIsSubscribed"
            class="text-2xl text-primary-normal font-bold"
          >
            You're already a patron. Go take some courses!
          </h2>
        </header>
        <PricingSkeleton v-if="!subscriptionPlan" />
        <section
          v-if="priceYearly && priceMonthly && priceLifetime"
          class="grid md:grid-cols-3 sm:grid-cols-1 gap-4 md:p-4 sm:p-0 w-full"
        >
          <div class="flex items-center justify-center">
            <article
              class="px-6 py-8 text-center rounded-lg bg-white items-center flex flex-col h-full w-full"
            >
              <h2 class="flex justify-center pb-4 border-gray-200 font-bold">
                <span class="text-2xl">Patron Rewards</span>
              </h2>
              <table class="table-auto border-collapse w-full">
                <thead>
                  <tr class="rounded-sm text-lg text-gray-700">
                    <th class="px-4 py-2 bg-gray-200 font-semibold">Basic</th>
                    <th class="px-4 py-2 bg-gray-200 font-bold">Patron</th>
                  </tr>
                </thead>
                <tbody class="text-sm font-normal text-gray-700">
                  <tr class="hover:bg-gray-100 border-b border-gray-200 py-10">
                    <td class="px-4 py-2">Read all content</td>
                    <td class="px-4 py-2 font-bold">Read all content</td>
                  </tr>
                  <tr class="hover:bg-gray-100 border-b border-gray-200 py-4">
                    <td class="px-4 py-2">Code sandbox</td>
                    <td class="px-4 py-2 font-bold">Code sandbox</td>
                  </tr>
                  <tr class="hover:bg-gray-100 border-b border-gray-200">
                    <td class="px-4 py-2">-</td>
                    <td class="px-4 py-2 font-bold">Code verification</td>
                  </tr>
                  <tr class="hover:bg-gray-100 border-b border-gray-200">
                    <td class="px-4 py-2">-</td>
                    <td class="px-4 py-2 font-bold">Patron-only chat</td>
                  </tr>
                  <tr class="hover:bg-gray-100 border-b border-gray-200">
                    <td class="px-4 py-2">-</td>
                    <td class="px-4 py-2 font-bold">Multiple choice quizzes</td>
                  </tr>
                  <tr class="hover:bg-gray-100 border-b border-gray-200">
                    <td class="px-4 py-2">-</td>
                    <td class="px-4 py-2 font-bold">
                      Certificates of completion
                    </td>
                  </tr>
                  <tr class="hover:bg-gray-100 border-b border-gray-200">
                    <td class="px-4 py-2">-</td>
                    <td class="px-4 py-2 font-bold">View full solutions</td>
                  </tr>
                </tbody>
              </table>
            </article>
          </div>
          <div class="flex items-center justify-center md:col-span-2">
            <article
              class="px-6 py-8 text-center rounded-lg items-center flex flex-col h-full w-full"
            >
              <h2 class="flex justify-center pb-4 border-gray-200 font-bold">
                <span class="text-2xl">Patronage payment options</span>
              </h2>
              <div
                class="grid xl:grid-cols-3 lg:grid-cols-1 gap-4 xl:p-4 md:p-0 w-full"
              >
                <div>
                  <div
                    class="shadow-lg px-6 py-8 text-center rounded-lg bg-white items-center flex flex-col h-full w-full"
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
                  class="shadow-lg px-6 py-8 text-center rounded-lg bg-blue-800 text-white items-center flex flex-col h-full w-full"
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
                  <span
                    class="rounded-lg border-gold-200 border text-gold-200 px-2"
                    >Most Popular</span
                  >
                </div>
                <div
                  class="shadow-lg px-6 py-8 text-center rounded-lg bg-white items-center flex flex-col h-full w-full"
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
              profile-image-u-r-l="https://qvault.io/wp-content/uploads/2022/02/megan_astraus-300x300.jpeg"
              title="Megan Astraus from Arizona, USA"
              description="My first interaction with Qvault was through a resume event where Lane and the community spent a great deal of time combing through my resume and helping me make updates. The wealth of knowledge from the hungry programmers in the Discord helped me land my first software developer job just a month after that resume event!"
            />
            <Testimonial
              class="mb-5"
              profile-image-u-r-l="https://qvault.io/wp-content/uploads/2022/01/daniel-gerep-300x300.jpeg"
              title="Daniel Gerep from Cássia, Brazil"
              description="I’m a senior engineer learning Go, and the pace of Qvault’s courses has been perfect for me. The diverse community in Discord makes the weekly events a blast, and the members are quick to help out with detailed answers and explanations."
            />
            <Testimonial
              class="mb-5"
              profile-image-u-r-l="https://qvault.io/wp-content/uploads/2021/12/O%CC%88zgu%CC%88r-Yildirim-1-300x300.jpeg"
              title="Özgür Yildirim from Esslingen, Germany"
              description="I’m a field service engineer in the biomedical industry. I wanted to learn to code, but boot camp and school weren’t an option because of work and wanting time with my kid! I came across Qvault after trying other online courses, and liked that their “Intro to Coding” course got me up and running with JavaScript immediately. They have a simple curriculum and knowing the steps are in place for me to reach my goal is huge for me. As soon as I joined the community on Discord, I knew I’d made the right decision going with Qvault."
            />
            <Testimonial
              profile-image-u-r-l="https://qvault.io/wp-content/uploads/2021/12/0-150x150-1.jpeg"
              title="Ignacio Contreras from Guanajuato, Mexico"
              description="I love how simple it is to find relevant content on Qvault. As soon as I logged in, I connected with real developers and was recommended an interview prep course that was perfect for my situation."
            />
          </div>
        </div>
      </Section>

      <Section
        title="Frequently Asked Questions"
        subtitle="Interested in becoming a patron but unsure what that entails?"
      >
        <div class="flex justify-center p-4">
          <div class="px-4 max-w-4xl">
            <h2 class="text-xl my-4 text-gold-700">
              What's the difference between a basic account and a patron
              account?
            </h2>
            <p class="mb-4">
              You can demo patron-only features at the beginning of each course,
              but after that you'll be in read-only mode. You won't pass off
              assignments or know if you got the correct answers. You also won't
              earn achievements and certifications without a patron account.
            </p>
            <p class="mb-4">
              Patrons enjoy all the features in the basic plan, plus the ability
              to pass off exercises, view solutions, complete quizzes, earn
              certifications, and chat in the patron-only lounge.
            </p>

            <h2 class="text-xl my-4 text-gold-700">
              Why aren't all the features on Qvault free?
            </h2>
            <p class="mb-4">
              Free options use ads to pay for ongoing development, or don't have
              the resources to offer an amazing experience. We're a small team
              that would love to quit our full-time jobs and work exclusively on
              Qvault. The only way for us to do that is if our fans to support
              us directly. We don't want to make our students the product by
              running ads.
            </p>
            <p class="mb-4">
              That said, we make all of our content free to read, and open our
              community to everyone so that those who are unable to support us
              can still find a lot of value.
            </p>

            <h2 class="text-xl my-4 text-gold-700">
              What makes Qvault different?
            </h2>
            <p class="mb-4">
              I built Qvault based on the lessons I've been learning as an
              engineering hiring manager. You can read about
              <a
                class="underline cursor-pointer text-gold-600 hover:text-gold-800"
                href="https://qvault.io/method"
                target="_blank"
                >our methodology here</a
              >, but in a nutshell I've learned that entry-level developers
              don't learn enough computer science, and that is the biggest
              obstacle on their way to a successful coding career.
            </p>

            <h2 class="text-xl my-4 text-gold-700">
              Do you offer any discounts?
            </h2>
            <p>
              Currently we're offering a
              <a
                target="_blank"
                class="underline cursor-pointer text-gold-600 hover:text-gold-800"
                href="https://forms.gle/poQckVBir9XZA7L39"
                >25% discount to anyone who completes this feedback form.</a
              >
              Our top priority is improving the courses and the community so
              your feedback is super valuable to us. When you're finished with
              the survey you'll be given a coupon code!
            </p>

            <h2 class="text-xl my-4 text-gold-700">
              Do I need to know how to code before signing up?
            </h2>
            <p>
              No, in fact many of our students have zero experience when they
              sign up. Our "Basic Intro to Coding" courses are built just for
              you.
            </p>

            <h2 class="text-xl my-4 text-gold-700">
              How do I cancel my patronage?
            </h2>
            <p>
              We do our best to be transparent about pricing, and never want you
              to feel obligated to keep supporting us if you don't want to. You
              can cancel your patron account any time from your
              <a
                class="underline cursor-pointer text-gold-600 hover:text-gold-800"
                href="/settings"
                >settings page</a
              >
              and you won't be billed again.
            </p>

            <h2 class="text-xl my-4 text-gold-700">
              What if I don't like being a Patron?
            </h2>
            <p>
              Hopefully you can figure out if you're enjoying the platform
              within the first several free exercises of each course. That said,
              if you become a patron and no longer want to support us you can
              take advantage of our
              <a
                class="underline cursor-pointer text-gold-600 hover:text-gold-800"
                href="https://qvault.io/return-policy/"
                >return policy.</a
              >
              If you contact us within 30 days of your purchase you're entitled
              to a full refund.
            </p>
          </div>
        </div>
      </Section>
    </div>
  </ViewNavWrapper>
</template>

<script>
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import Section from "@/components/Section.vue";
import Testimonial from "@/components/Testimonial.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import BlockButton from "@/components/BlockButton.vue";
import PricingSkeleton from "@/components/PricingSkeleton.vue";
import { checkout } from "@/lib/stripewrap.js";
import { loadUser, loadSubscriptionPlans } from "@/lib/cloudStore.js";
import { trackUserCancelCheckout } from "@/lib/cloudClient.js";
import { notify } from "@/lib/notification.js";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";

export default {
  components: {
    ViewNavWrapper,
    LoadingOverlay,
    Section,
    BlockButton,
    PricingSkeleton,
    Testimonial,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
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
      description:
        "Become a patron to unlock all the courses on content on Qvault",
      image:
        "https://qvault.io/wp-content/uploads/2021/04/qvault-social-banner-1024x576.jpg",
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
