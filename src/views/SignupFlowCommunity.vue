<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Join the Qvault Discord Community"
        subtitle="Qvault is 100% better with Discord"
        class="max-w-2xl"
      >
        <div>
          <div class="flex flex-col">
            <ul class="list-disc ml-5 my-4 text-left">
              <li>You will get personalized help with your resume</li>
              <li>You will get advice on what you should be learning next</li>
              <li>You can attend free online workshops and networking events</li>
              <li>You can get help with your courses and projects</li>
            </ul>

            <h3 class="text-xl text-gray-500 mb-4">
              1. Use the following link to open Discord in a new window
            </h3>

            <div class="flex justify-center">
              <BlockButton
                :click="linkClick"
              >
                <FontAwesomeIcon
                  :icon="['fab', 'discord']"
                  class="icon"
                />
                Join Qvault on Discord
              </BlockButton>
            </div>

            <h3 class="text-xl text-gray-500 my-4">
              2. Link your Discord and Qvault accounts
            </h3>

            <p class="mb-2">
              Type <code class="text-red-400">
                qvault help
              </code> in the <code class="text-red-400">
                #qvault-bot-cli
              </code> channel to open communication with the Qvault bot, then type the following command into that DM:
            </p>

            <code
              class="
                text-gray-200
                bg-gray-800
                py-1
                px-2
                rounded
                overflow-auto
              "
            >
              qvault sync {{ $store.getters.getUser?.APIKey }}
            </code>

            <h3 class="text-xl text-gray-500 my-4">
              3. You are connected!
            </h3>

            <p class="mb-2">
              Your achievements, membership, progress and more are now deeply integrated with your Discord account.
              Be sure to introduce yourself, <a
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
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import TopNav from '@/components/TopNav.vue';
import Section from '@/components/Section.vue';
import BlockButton from '@/components/BlockButton.vue';
import { loadUser } from '@/lib/cloudStore.js';

export default {
  components: {
    TopNav,
    Section,
    BlockButton,
    FontAwesomeIcon
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
