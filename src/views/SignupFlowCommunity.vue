<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Our Community"
        subtitle="We learn better together. Join our friendly community to receive and give help along the way"
        class="max-w-2xl"
      >
        <div class="text-center">
          <div class="flex flex-col items-center">
            <h3 class="text-xl text-gold-600 my-4">
              Ask questions and make friends on our Discord server
            </h3>

            <BlockButton
              :click="linkClick"
              class="my-4"
            >
              Join us on Discord
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

import TopNav from '@/components/TopNav.vue';
import Section from '@/components/Section.vue';
import BlockButton from '@/components/BlockButton.vue';

export default {
  components: {
    TopNav,
    Section,
    BlockButton
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
