<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Sync your Discord and Qvault accounts"
        subtitle="Integrating your accounts unlocks Qvault's coolest features"
        class="max-w-2xl"
      >
        <div class="p-4">
          <p class="mb-2">
            Type <code class="text-red-400">
              qvault help
            </code> in the <code class="text-red-400">
              #qvault-bot-cli
            </code> channel to learn how the bot works.
            Send the following command in a DM to the Qvault bot.
            It's at top user in the user list on the right of the screen in Discord.
          </p>

          <div class="flex justify-center">
            <code
              class="
                text-gray-200
                bg-gray-800
                py-1
                px-2
                rounded
                overflow-auto
                my-4
              "
            >
              qvault sync {{ $store.getters.getUser?.APIKey }}
            </code>
          </div>

          <p class="mb-2">
            If you need help, type <code class="text-red-400">qvault help</code> in the <code class="text-red-400">#qvault-bot-cli</code> channel, or ask someone from the Qvault team.
          </p>

          <p class="mb-2">
            Once synced, be sure to introduce yourself, <a
              href="https://qvault.io/news/roles-qvault-discord-server/"
              target="_blank"
            >grab some roles</a>, and ask around if you have any questions.
          </p>

          <div class="flex justify-center">
            <BlockButton
              color="gray"
              class="max-w-xs"
              :click="continueClick"
            >
              Continue
            </BlockButton>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue';
import Section from '@/components/Section.vue';
import BlockButton from '@/components/BlockButton.vue';
import { loadUser } from '@/lib/cloudStore.js';

export default {
  components: {
    TopNav,
    Section,
    BlockButton
  },
  async mounted(){
    await loadUser(this);
  },
  methods:{
    linkClick() {
      window.open('https://discord.gg/k4rVEWt', '_blank');
    },
    continueClick(){
      this.$router.push({name: 'SignupFlowRecruiters', query: {redirect: this.$route.query.redirect}});
    }
  }
};
</script>

<style scoped>

</style>
