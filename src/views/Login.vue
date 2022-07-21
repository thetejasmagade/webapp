<template>
  <div class="login-container flex flex-col h-screen">
    <div class="nav-container">
      <TopNav />
    </div>

    <div
      class="flex flex-col justify-start items-center h-full-minus-bar overflow-auto px-4"
    >
      <Section
        title="A simple path to your self-taught backend career"
        subtitle="Published projects will get you interviews. Computer science skills will land you the job."
        class="max-w-4xl w-full mb-5 mt-4"
        h1
      >
        <div class="p-4">
          <div v-if="state === 'integration'">
            <IntegrationLoginForm />
            <div class="text-center">
              <p>
                Don't like integrations?
                <a
                  class="underline cursor-pointer text-blue-400 hover:text-blue-300"
                  @click="state = 'register'"
                >
                  Use a magic link
                </a>
              </p>
            </div>
          </div>

          <div v-if="state === 'register'">
            <MagicLinkRegister />
            <div class="text-center">
              <p>
                Have an integration?
                <a
                  class="underline cursor-pointer text-blue-400 hover:text-blue-300"
                  @click="state = 'integration'"
                >
                  Sign in with a third party
                </a>
              </p>
              <p>
                Have an account?
                <a
                  class="underline cursor-pointer text-blue-400 hover:text-blue-300"
                  @click="state = 'login'"
                >
                  Login
                </a>
              </p>
            </div>
          </div>

          <div v-if="state === 'login'">
            <MagicLinkLogin />
            <div class="text-center">
              <p>
                Need an account?
                <a
                  class="underline cursor-pointer text-blue-400 hover:text-blue-300"
                  @click="state = 'register'"
                >
                  Sign up free
                </a>
              </p>
              <p>
                Have an integrated account?
                <a
                  class="underline cursor-pointer text-blue-400 hover:text-blue-300"
                  @click="state = 'integration'"
                >
                  Sign in with a third party
                </a>
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="A job-focused computer science education"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <ul class="p-8">
          <li class="text-2xl mb-2">
            1. Write real code in hands-on computer science courses
          </li>

          <li class="text-2xl mb-2">
            2. Build and publish real-world coding projects
          </li>

          <li class="text-2xl mb-2">
            3. Leverage your new portfolio to land an entry-level job
          </li>
        </ul>
      </Section>

      <Section
        title="Join over 15,000 students"
        subtitle="Find them on our Discord community and leaderboard"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-4">
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
            description="I'm a senior engineer learning Go, and the pace of Boot.dev courses has been perfect for me. The diverse community in Discord is a blast, and the members are quick to help out with detailed answers and explanations."
          />
          <Testimonial
            class="mb-5"
            :profile-image-u-r-l="ozyImage"
            title="Özgür Yildirim from Esslingen, Germany"
            description="I'm a field service engineer in the biomedical industry. I wanted to learn to code, but boot camp and school weren't an option because of work and wanting time with my kid! I came across Boot.dev after trying other online courses, and liked that their “Intro to Coding” course got me up and running with JavaScript immediately. They have a simple curriculum and knowing the steps are in place for me to reach my goal is huge for me. As soon as I joined the community on Discord, I knew I'd made the right decision going with Boot.dev."
          />
          <Testimonial
            :profile-image-u-r-l="ignacioImage"
            title="Ignacio Contreras from Guanajuato, Mexico"
            description="I love how simple it is to find relevant content on Boot.dev. As soon as I logged in, I connected with real developers and was recommended an interview prep course that was perfect for my situation."
          />
        </div>
      </Section>

      <Section
        title="A simple, proven way to start a career"
        subtitle="Boot.dev is founded by a backend hiring manager. Here are a few beliefs that guide our methodology."
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-4 text-xl">
          <ul class="list-disc mb-4 ml-4">
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

import Section from "@/components/Section.vue";
import MagicLinkLogin from "@/components/MagicLinkLogin.vue";
import MagicLinkRegister from "@/components/MagicLinkRegister.vue";
import IntegrationLoginForm from "@/components/IntegrationLoginForm.vue";
import TopNav from "@/components/navs/TopNav.vue";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";
import Testimonial from "@/components/Testimonial.vue";
import FAQ from "@/components/FAQ.vue";

import meganImage from "@/img/megan_astraus-300x300.webp";
import danielImage from "@/img/daniel-gerep-300x300.webp";
import ozyImage from "@/img/ozy-300x300.webp";
import ignacioImage from "@/img/0-150x150-1.webp";

import { loadRegisterIsSubscribedNews } from "@/lib/localStorageLib.js";

export default {
  components: {
    MagicLinkRegister,
    IntegrationLoginForm,
    MagicLinkLogin,
    TopNav,
    Section,
    Testimonial,
    FAQ,
  },
  data() {
    return {
      state: "integration",
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
  },
  async mounted() {
    if (this.$route.query.error) {
      notify({
        type: "danger",
        text: this.$route.query.error,
      });
    }
    if (this.$route.query.auth_token) {
      try {
        loginToken(this.$route.query.auth_token);
        // just make sure token works
        await getUser();
        if (this.$route.query.new_user === "true") {
          try {
            if (loadRegisterIsSubscribedNews()) {
              await updateUser({
                isSubscribedNews: true,
              });
            }
            eventRegister(singupMethodGithub);
            loadLoggedIn(this);
            this.$router.push({
              name: "SignupFlow",
              query: { redirect: this.$route.query.redirect },
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

    loadLoggedIn(this);
    if (
      this.$store.getters.getIsLoggedIn &&
      this.$store.getters.getIsEmailVerified
    ) {
      this.$router.push({
        name: "Tracks",
        query: { redirect: this.$route.query.redirect },
      });
    }

    const computedMeta = getComputedMeta({
      title: "Learn Computer Science",
      description:
        "Login or sign up for Boot.dev's computer science and coding courses. All my courses are free to audit, get started today.",
    });
    useMeta(computedMeta);
  },
};
</script>

<style scoped></style>
