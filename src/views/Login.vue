<template>
  <div class="login-container flex flex-col h-screen">
    <div class="nav-container">
      <TopNav />
    </div>

    <div
      class="flex flex-col justify-start items-center h-full-minus-bar overflow-auto px-4"
    >
      <Section class="max-w-4xl w-full mb-5 mt-4">
        <div class="p-4">
          <h1 class="text-blue-400 font-bold text-4xl mb-2">
            Real code. Modern programming languages.
          </h1>
          <h2 class="text-xl mb-2">
            We teach computer science through hands-on coding projects. We’re
            built for developers who want to advance their careers.
          </h2>

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
        :title="`What students say about Boot.dev`"
        :subtitle="`Join over 12,000 developers learning on Boot.dev`"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-4">
          <Testimonial
            class="mb-10"
            profile-image-u-r-l="/src/img/megan_astraus-300x300.webp"
            title="Megan Astraus from Arizona, USA"
            description="My first interaction with Boot.dev was through a resume event where Lane and the community spent a great deal of time combing through my resume and helping me make updates. The wealth of knowledge from the hungry programmers in the Discord helped me land my first software developer job just a month after that resume event!"
          />
          <Testimonial
            class="mb-5"
            profile-image-u-r-l="/src/img/daniel-gerep-300x300.webp"
            title="Daniel Gerep from Cássia, Brazil"
            description="I’m a senior engineer learning Go, and the pace of Boot.dev’s courses has been perfect for me. The diverse community in Discord makes the weekly events a blast, and the members are quick to help out with detailed answers and explanations."
          />
          <Testimonial
            class="mb-5"
            profile-image-u-r-l="/src/img/ozy-300x300.webp"
            title="Özgür Yildirim from Esslingen, Germany"
            description="I’m a field service engineer in the biomedical industry. I wanted to learn to code, but boot camp and school weren’t an option because of work and wanting time with my kid! I came across Boot.dev after trying other online courses, and liked that their “Intro to Coding” course got me up and running with JavaScript immediately. They have a simple curriculum and knowing the steps are in place for me to reach my goal is huge for me. As soon as I joined the community on Discord, I knew I’d made the right decision going with Boot.dev."
          />
          <Testimonial
            profile-image-u-r-l="/src/img/0-150x150-1.webp"
            title="Ignacio Contreras from Guanajuato, Mexico"
            description="I love how simple it is to find relevant content on Boot.dev. As soon as I logged in, I connected with real developers and was recommended an interview prep course that was perfect for my situation."
          />
        </div>
      </Section>

      <Section
        :title="`Principles that guide our unique methodology`"
        :subtitle="`We have some strong opinions that will make your life easier`"
        class="max-w-4xl w-full mb-5 mt-4"
      >
        <div class="p-4"></div>
      </Section>
    </div>
  </div>
</template>

<script>
import { loginToken, getUser, updateUserCache } from "@/lib/cloudClient.js";
import { eventRegister, singupMethodGithub } from "@/lib/analytics.js";

import { loadLoggedIn } from "@/lib/cloudStore.js";
import { notify } from "@/lib/notification.js";

import Section from "@/components/Section.vue";
import MagicLinkLogin from "@/components/MagicLinkLogin.vue";
import MagicLinkRegister from "@/components/MagicLinkRegister.vue";
import IntegrationLoginForm from "@/components/IntegrationLoginForm.vue";
import TopNav from "@/components/TopNav.vue";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";
import Testimonial from "@/components/Testimonial.vue";

export default {
  components: {
    MagicLinkRegister,
    IntegrationLoginForm,
    MagicLinkLogin,
    TopNav,
    Section,
    Testimonial,
  },
  data() {
    return {
      state: "integration",
    };
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
            updateUserCache();
            eventRegister(singupMethodGithub);
            loadLoggedIn(this);
            this.$router.push({
              name: "SignupFlowCode",
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
        name: "Courses",
        query: { redirect: this.$route.query.redirect },
      });
    }

    const computedMeta = getComputedMeta({
      title: "Login",
      description:
        "Login or sign up for Boot.dev's computer science and coding courses. All my courses are free to audit, get started today.",
      image:
        "https://qvault.io/wp-content/uploads/2021/04/qvault-social-banner.jpg",
    });
    useMeta(computedMeta);
  },
};
</script>

<style scoped></style>
