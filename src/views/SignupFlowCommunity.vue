<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Join our free Discord community"
        subtitle="Weekly live workshops, mentors, job opportunities and more"
        class="max-w-2xl"
      >
        <div>
          <div class="flex flex-col p-4">
            <h3 class="text-xl font-bold">1. Install Discord</h3>
            <p>
              <a
                class="underline text-gold-600"
                href="https://discord.com/download"
                target="_blank"
                >Download the free Discord desktop client.</a
              >
              Keep the Discord chat and the Qvault website open in separate
              windows for the best experience.
            </p>

            <h3 class="text-xl font-bold mt-4">2. Join our community server</h3>
            <div class="flex justify-center my-4">
              <BlockButton :click="discordClick">
                <FontAwesomeIcon :icon="['fab', 'discord']" class="icon" />
                Join Qvault on Discord
              </BlockButton>
            </div>

            <h3 class="text-xl font-bold">3. Sync your accounts</h3>
            <p>
              Once you're in, read the
              <a
                class="text-gold-600 underline"
                href="https://discord.com/channels/551921866173054977/920160977788502036"
                target="_blank"
                >#start-here channel.</a
              >
              You'll be asked to send the following message to the Qvault bot to
              sync your account.
            </p>

            <div class="flex justify-center">
              <code
                class="text-gray-200 bg-gray-700 py-1 px-2 rounded overflow-auto my-2"
              >
                qvault sync {{ $store.getters.getUser?.APIKey }}
              </code>
            </div>

            <router-link
              class="flex justify-center text-gold-600 underline my-2"
              :to="{
                name: 'SignupFlowRecruiters',
                query: { redirect: $route.query.redirect },
              }"
            >
              Done! I've joined and synced my account
            </router-link>
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
  },
};
</script>

<style scoped></style>
