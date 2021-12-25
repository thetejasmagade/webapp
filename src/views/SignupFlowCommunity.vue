<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Join the Qvault Discord Community"
        subtitle="Integrating your Discord account powers our gems and achievements systems"
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

            <div class="flex justify-center mb-4">
              <BlockButton
                :click="discordClick"
              >
                <FontAwesomeIcon
                  :icon="['fab', 'discord']"
                  class="icon"
                />
                Join the Discord community
              </BlockButton>
            </div>

            <p>
              Click the button above to join our Discord community.
              <b>It's free forever.</b>
              The majority of the value of Qvault comes from the
              motivation, help, and mentoring our community provides.
            </p>

            <div class="flex justify-center my-4">
              <div class="w-3/5 border-b border-gray-300" />
            </div>

            <div class="flex justify-center">
              <BlockButton
                color="blue"
                class="max-w-xs mb-4"
                :click="continueClick"
              >
                Done! I'm in the Discord
              </BlockButton>
            </div>
            <div
              class="flex justify-center underline cursor-pointer text-gold-600 hover:text-gold-800"
              @click="skipClick"
            >
              I'll skip, I don't want the full experience
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
    discordClick() {
      window.open('https://discord.gg/k4rVEWt', '_blank');
    },
    continueClick(){
      this.$router.push({name: 'SignupFlowSync', query: {redirect: this.$route.query.redirect}});
    },
    skipClick(){
      this.$router.push({name: 'SignupFlowRecruiters', query: {redirect: this.$route.query.redirect}});
    }
  }
};
</script>

<style scoped>

</style>
