<template>
  <div class="login-container flex flex-col h-screen">
    <LoginModal ref="loginModal" />
    <div class="nav-container">
      <TopNav />
    </div>

    <div
      class="flex flex-col justify-start items-center h-full-minus-bar overflow-auto px-4"
    >
      <Section
        title="Learn Backend Development the Right Way"
        subtitle="Computer science skills will get you interviews. A portfolio of projects will get you hired."
        class="max-w-4xl w-full mb-5 mt-4"
        h1
      >
        <div class="p-4">
          <div class="text-lg">
            <p class="mb-2">
              Employers want backend developers who have mastered CS
              fundamentals so they can solve problems like:
            </p>

            <blockquote
              class="bg-gray-700 border-l-4 border-l-gray-50 p-2 rounded mb-2"
            >
              * How can we store 3 million status updates efficiently?
            </blockquote>

            <blockquote
              class="bg-gray-700 border-l-4 border-l-gray-50 p-2 rounded mb-4"
            >
              * How can we stream video content across a weak internet
              connection?
            </blockquote>

            <p class="mb-8">
              Follow our simple backend learning path and you'll come out the
              other side with a professional portfolio of projects that will get
              you hired.
            </p>
          </div>

          <div class="flex justify-center">
            <BlockButton :click="onLoginClick" class="text-xl">
              Start the Backend Path for Free
            </BlockButton>
          </div>
        </div>
      </Section>

      <Section
        title="Write real code, get immediate feedback"
        subtitle="Our students can't tear themselves away from these addictive lessons"
        class="max-w-4xl w-full mb-5 mt-4"
        h1
      >
        <div class="p-8">
          <FreezeFrame
            class="rounded border border-white overflow-hidden"
            src="https://i.imgur.com/8JdrNCj.gif"
          />
        </div>
      </Section>

      <Section
        title="Join 15,000+ students learning modern backend skills"
        subtitle="Find them in our Discord community and on the leaderboard"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-4">
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

          <div class="flex justify-center mt-8">
            <BlockButton :click="onLoginClick" class="text-xl">
              Start the Backend Path for Free
            </BlockButton>
          </div>
        </div>
      </Section>

      <Section
        title="A proven way to start your backend career"
        subtitle="Being founded by a hiring manager, we understand what employers want to see in entry-level programming candidates"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-8 text-xl">
          <ul class="list-disc mb-8 ml-4">
            <li>
              An understanding of computer science will set you apart in the job
              market
            </li>
            <li>You can't learn to code if you aren't writing code</li>
            <li>A straight learning path makes progress easy</li>
            <li>
              It's not hard to find coding courses online, but it is hard to
              find good ones
            </li>
            <li>
              A portfolio of published projects is your best tool on the job
              search
            </li>
          </ul>
          <div class="text-center w-full">
            <a
              href="https://blog.boot.dev/about"
              class="underline text-blue-400 hover:text-blue-300"
            >
              Read more about our guiding beliefs here
            </a>
          </div>
        </div>
      </Section>

      <Section
        title="Backend developers in the US earn a median salary of $150,000, while
            front-end developers earn $133,000."
        subtitle="Join a rapidly growing job market"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-4">
          <p class="mb-4">
            Source:
            <a
              href="https://survey.stackoverflow.co/2022/#salary-united-states"
              target="_blank"
              class="underline text-blue-400 hover:text-blue-300"
              >Stack Overflow survey for 2022</a
            >
          </p>
          <p class="mb-4">
            Some might look at that data and assume that front-end positions are
            better for entry-level devs because the salaries are lower. On the
            contrary! There is higher demand and lower supply for backend
            positions. With the right preparation a backend position can
            actually be easier to land.
          </p>
          <p class="mb-4">
            With all that in mind, a computer science education is actually
            useful for all types of developers, we've just found that it's
            disproportionately useful to backend engineers.
          </p>
          <div class="flex justify-center mt-8">
            <BlockButton :click="onLoginClick" class="text-xl">
              Start the Backend Path for Free
            </BlockButton>
          </div>
        </div>
      </Section>

      <Section
        title="You don't need to take financial risks to upgrade your life"
        subtitle="The highest quality CS education at 1% of the price of a university degree"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-4">
          <div class="flex justify-center mb-4"></div>
          <ul class="list-disc mb-4 text-xl">
            <li>Try for free - no credit card required</li>
            <li>Pay less than 1% of what you'd spend at college</li>
            <li>If you don't like Boot.dev, we'll refund you completely</li>
          </ul>
        </div>
      </Section>

      <div class="max-w-4xl mb-4">
        <FAQ />
      </div>

      <footer>
        <div class="py-4">
          <div class="border-t-2 border-blue-500 w-full"></div>
        </div>

        <main class="mb-4 flex justify-center flex-wrap">
          <span>© Boot.dev 2022</span>
          <span class="mx-2">|</span>
          <a
            class="text-blue-400 hover:text-blue-300 underline"
            href="/sitemap.xml"
            ><span>Sitemap</span></a
          >
          <span class="mx-2">|</span>
          <a
            class="text-blue-400 hover:text-blue-300 underline"
            href="https://blog.boot.dev/affiliates"
            ><span>Affiliates</span></a
          >
          <span class="mx-2">|</span>
          <a
            class="text-blue-400 hover:text-blue-300 underline"
            href="/playground/go"
            ><span>Playground</span></a
          >
          <span class="mx-2">|</span>
          <a
            class="text-blue-400 hover:text-blue-300 underline"
            href="https://blog.boot.dev/terms"
            ><span>TOS</span></a
          >
          <span class="mx-2">|</span>
          <a
            class="text-blue-400 hover:text-blue-300 underline"
            href="https://blog.boot.dev/privacy"
            ><span>Privacy</span></a
          >
          <span class="mx-2">|</span>
          <a
            class="text-blue-400 hover:text-blue-300 underline"
            href="https://blog.boot.dev/contact"
            ><span>Contact</span></a
          >
        </main>
      </footer>
    </div>
  </div>
</template>

<script>
import { loginToken, getUser, updateUser } from "@/lib/cloudClient.js";
import { eventRegister, singupMethodGithub } from "@/lib/analytics.js";

import { loadLoggedIn } from "@/lib/cloudStore.js";
import { notify } from "@/lib/notification.js";

import BlockButton from "@/components/BlockButton.vue";
import Section from "@/components/Section.vue";
import LoginModal from "@/components/modals/LoginModal.vue";
import TopNav from "@/components/navs/TopNav.vue";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";
import Testimonial from "@/components/Testimonial.vue";
import FAQ from "@/components/FAQ.vue";

import meganImg from "@/img/megan_astraus-300x300.webp";
import danielImg from "@/img/daniel-gerep-300x300.webp";
import ozyImg from "@/img/ozy-300x300.webp";
import ignacioImg from "@/img/0-150x150-1.webp";

import { loadRegisterIsSubscribedNews } from "@/lib/localStorageLib.js";
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import FreezeFrame from "@/components/FreezeFrame.vue";

export default {
  components: {
    LoginModal,
    TopNav,
    Section,
    Testimonial,
    FAQ,
    BlockButton,
    FreezeFrame,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const loginModal = ref(null);

    const meganImage = computed(() => {
      return meganImg;
    });
    const danielImage = computed(() => {
      return danielImg;
    });
    const ozyImage = computed(() => {
      return ozyImg;
    });
    const ignacioImage = computed(() => {
      return ignacioImg;
    });

    const onLoginClick = () => {
      loginModal.value?.show();
    };

    onMounted(async () => {
      if (route.query.error) {
        notify({
          type: "danger",
          text: route.query.error,
        });
      }

      if (route.query.auth_token) {
        try {
          loginToken(route.query.auth_token);
          // just make sure token works
          await getUser();
          if (route.query.new_user === "true") {
            try {
              if (loadRegisterIsSubscribedNews()) {
                await updateUser({
                  isSubscribedNews: true,
                });
              }
              eventRegister(singupMethodGithub);
              loadLoggedIn(store.commit);
              router.push({
                name: "SignupFlow",
                query: { redirect: route.query.redirect },
              });
              return;
            } catch (err) {
              console.log(err);
            }
          }
        } catch (err) {
          notify({
            type: "danger",
            text: err,
          });
        }
      }

      loadLoggedIn(store.commit);
      if (store.getters.getIsLoggedIn && store.getters.getIsEmailVerified) {
        router.push({
          name: "Tracks",
          query: { redirect: route.query.redirect },
        });
      }
    });

    const computedMeta = getComputedMeta({
      title: "Learn Backend Development",
      description:
        "Take a straight path to your career in backend development. Complete computer science courses, publish real backend projects, and build your professional portfolio.",
      featuredImageURL: "https://i.imgur.com/DsK1de9.png",
    });
    useMeta(computedMeta);

    return {
      meganImage,
      danielImage,
      ozyImage,
      ignacioImage,
      onLoginClick,
      loginModal,
    };
  },
};
</script>

<style scoped></style>
