<template>
  <div class="flex flex-col justify-start h-full overflow-auto">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1 p-4">
      <Section
        title="1. Install Discord"
        subtitle="Free access to live workshops, mentors, job opportunities and more"
        class="max-w-2xl mb-4 w-full"
      >
        <div>
          <div class="flex flex-col p-4">
            <p>
              <a
                class="underline text-blue-400 hover:text-blue-300"
                href="https://discord.com/download"
                target="_blank"
                >Download the free Discord desktop client.</a
              >
              Keep the Discord chat and the Boot.dev website open in separate
              windows for the best experience.
            </p>
          </div>
        </div>
      </Section>
      <Section
        title="2. Join our community server"
        class="max-w-2xl mb-4 w-full"
      >
        <div class="flex flex-col pt-4">
          <div class="flex justify-center">
            <BlockButton :click="discordClick">
              <FontAwesomeIcon :icon="['fab', 'discord']" class="icon" />
              Join Boot.dev on Discord
            </BlockButton>
          </div>
        </div>
      </Section>
      <Section title="3. Sync your account" class="max-w-2xl w-full">
        <div>
          <div class="flex flex-col p-4">
            <p>
              Once you're in, read the
              <a
                class="text-blue-400 underline hover:text-blue-300"
                href="https://discord.com/channels/551921866173054977/920160977788502036"
                target="_blank"
                >#start-here</a
              >
              channel. You'll be asked to type the "/sync" command in the
              <a
                class="text-blue-400 underline hover:text-blue-300"
                href="https://discord.com/channels/551921866173054977/921896108853178398"
                target="_blank"
                >#bot-cli</a
              >
              channel, then to paste in your API key from below.
            </p>

            <div class="flex justify-center">
              <code
                class="text-gray-200 bg-gray-700 py-1 px-2 rounded overflow-auto my-2"
              >
                {{ $store.getters.getUser?.APIKey }}
              </code>
            </div>

            <div class="text-center mt-2">
              <BlockButton
                :link="{
                  name: 'SignupFlowRecruiters',
                  query: { redirect: $route.query.redirect },
                }"
              >
                Done, I'm connected!
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
    await loadUser(this.$store.commit);
  },
  methods: {
    discordClick() {
      window.open("https://discord.gg/EEkFwbv", "_blank");
    },
  },
};
</script>

<style scoped></style>
