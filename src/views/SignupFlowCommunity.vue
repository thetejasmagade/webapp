<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Join our Discord Community"
        subtitle="Connect with our community and founders directly for personal advice and help"
        class="max-w-2xl"
      >
        <div class="text-center">
          <div class="flex flex-col items-center">
            <h3 class="text-xl text-gold-600 my-4">
              Why should I join?
            </h3>
            <ul class="list-disc ml-5 mb-4 text-left">
              <li>Get instant personalized help with your resume and portfolio</li>
              <li>Get personal advice on what you should be learning and building</li>
              <li>Attend free digital learning events</li>
              <li>Get help with courses and projects</li>
            </ul>

            <BlockButton
              :click="linkClick"
              class="my-4"
            >
              <FontAwesomeIcon
                :icon="['fab', 'discord']"
                class="icon"
              />
              Join the Discord Free
            </BlockButton>

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
import { experienceLevelToObj } from '@/lib/experienceLevels.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import TopNav from '@/components/TopNav.vue';
import Section from '@/components/Section.vue';
import BlockButton from '@/components/BlockButton.vue';

export default {
  components: {
    TopNav,
    Section,
    BlockButton,
    FontAwesomeIcon
  },
  data(){
    return {
      experienceLevel: 0
    };
  },
  computed: {
    devExperienceDescription(){
      return experienceLevelToObj(this.experienceLevel).description;
    }
  },
  methods:{
    linkClick() {
      window.open('https://discord.gg/k4rVEWt', '_blank');
    },
    continueClick(){
      this.$router.push({name: 'SignupFlowInterests', query: {redirect: this.$route.query.redirect}});
    }
  }
};
</script>

<style scoped>

</style>
