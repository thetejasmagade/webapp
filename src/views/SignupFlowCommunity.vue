<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Join our Discord community"
        subtitle="This is where you'll find mentors, workshops, job opportunities and more"
        class="max-w-2xl"
      >
        <div>
          <div class="flex flex-col">
            <ul class="list-disc ml-5 my-4 text-left">
              <li>Get personalized help with your resume and portfolio</li>
              <li>
                Get advice on what you should be learning and building next
              </li>
              <li>Attend online workshops and coding events</li>
              <li>Get help with your courses and projects</li>
            </ul>

            <div class="flex justify-center mb-4">
              <BlockButton :click="discordClick">
                <FontAwesomeIcon :icon="['fab', 'discord']" class="icon" />
                Join the Discord community
              </BlockButton>
            </div>

            <p>
              After joining, send this direct message to the Qvault bot to sync
              your account.
            </p>

            <div class="flex justify-center">
              <code
                class="text-gray-200 bg-gray-800 py-1 px-2 rounded overflow-auto my-4"
              >
                qvault sync {{ $store.getters.getUser?.APIKey }}
              </code>
            </div>

            <div class="flex justify-center">
              <BlockButton
                color="blue"
                class="max-w-xs mb-4"
                :click="continueClick"
              >
                I've joined and synced my account
              </BlockButton>
            </div>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import TopNav from "@/components/TopNav.vue";
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";
import { loadUser } from "@/lib/cloudStore.js";

export default {
  components: {
    TopNav,
    Section,
    BlockButton,
    FontAwesomeIcon,
  },
  async mounted() {
    await loadUser(this);
  },
  methods: {
    discordClick() {
      window.open("https://discord.gg/EEkFwbv", "_blank");
    },
    continueClick() {
      this.$router.push({
        name: "SignupFlowRecruiters",
        query: { redirect: this.$route.query.redirect },
      });
    },
  },
};
</script>

<style scoped></style>
