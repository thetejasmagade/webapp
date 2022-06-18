<template>
  <div class="login-container flex flex-col h-screen">
    <div class="nav-container">
      <TopNav />
    </div>

    <div
      class="flex flex-col justify-start items-center h-full-minus-bar overflow-auto px-4"
    >
      <Section
        title="What if learning computer science was fun?"
        subtitle="Master CS principles by writing modern code in our gamified platform."
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
        :title="`What will I learn?`"
        :subtitle="`Practice computer science fundamentals by writing modern code`"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-4">
          <div
            class="flex flex-row justify-evenly p-4 bg-gray-900 rounded mb-4"
          >
            <img
              class="rounded md:w-36 w-16"
              src="https://richstone.github.io/assets/images/logos/python-logo-small.png"
            />
            <img
              class="rounded md:w-36 w-16"
              src="https://cdn.iconscout.com/icon/free/png-256/javascript-2752148-2284965.png"
            />
            <img
              class="rounded md:w-36 w-16"
              src="https://user-images.githubusercontent.com/19890545/150690287-d7a7a4c0-ce89-4c49-8043-5af0348e615e.png"
            />
          </div>

          <p class="mb-4">
            We have a variety of courses written in Python, Golang, and
            JavaScript, with more languages coming in the future. Each course
            emphasizes CS principles, not simply frameworks and technologies.
          </p>
          <p class="mb-4">
            Computer science concepts and engineering best practices rarely
            change. Popular languages and frameworks come and go.
          </p>
          <p class="mb-4">
            You can check out all of our
            <router-link
              class="underline cursor-pointer text-blue-400 hover:text-blue-300"
              to="/courses"
              >courses and tracks here.</router-link
            >
          </p>
        </div>
      </Section>

      <Section
        :title="`What students say about Boot.dev`"
        :subtitle="`Join over 12,000 developers learning on Boot.dev`"
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
      </Section>

      <Section
        :title="`We have strong beliefs about the best way to learn to code`"
        :subtitle="`Don't waste time, learn to code the right way`"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-4">
          <ul class="list-disc mb-4">
            <li>
              Finding information is easy. Finding the best information is hard.
            </li>
            <li>
              As programming becomes easier, differentiating yourself becomes
              harder.
            </li>
            <li>A mix of guided and unguided learning is essential.</li>
            <li>Boot camps are too fast, degrees are too slow.</li>
            <li>
              Learning the “soft lessons” from mentors is as important as
              grokking cold-hard facts.
            </li>
            <li>Mastery is important, grades are not.</li>
            <li>The future of learning is online.</li>
            <li>
              It’s only enjoyable to solve problems that you have the tools to
              solve.
            </li>
            <li>T-shaped developers are the most successful.</li>
            <li>You need to have the skills and be able to prove them too.</li>
            <li>
              If you don’t define your career goals, you’ll never know when
              you’re ready for your first job.
            </li>
            <li>The ideal first coding job is not freelancing.</li>
          </ul>
          <div class="text-center w-full">
            <a
              href="https://blog.boot.dev/about"
              class="underline text-blue-400 hover:text-blue-300"
            >
              Read more about the details on our guiding principles here.
            </a>
          </div>
        </div>
      </Section>

      <Section
        :title="`Community is key`"
        :subtitle="`Don't struggle due to a lack of social support`"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-4">
          <div class="flex justify-center mb-4">
            <img
              loading="lazy"
              src="/src/img/undraw_Community_re_cyrm-768x578.webp"
              width="400"
              class="rounded object-cover"
            />
          </div>
          <ul class="list-disc mb-4">
            <li>
              Participate in our weekly coding workshops to improve your
              interviewing skills and learn about interesting applications of
              computer science
            </li>
            <li>
              Share your career goals and get advice from mentors and peers
            </li>
            <li>
              Bring your resume to our resume review sessions and we’ll help you
              shine on paper
            </li>
            <li>
              Build projects and work on courses with other members to build an
              outstanding portfolio
            </li>
            <li>
              Leverage our community to find the jobs you want to apply for
            </li>
          </ul>
          <a
            href="https://discord.gg/EEkFwbv"
            target="_blank"
            class="underline text-blue-400 hover:text-blue-300"
          >
            Join the Discord community here
          </a>
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
