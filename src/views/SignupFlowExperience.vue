<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Developer Experience"
        subtitle="Let us know where you're at as a programmer so we can recommend the best courses for you"
        class="max-w-2xl"
      >
        <div class="text-center">
          <h3 class="text-xl text-gold-600 my-4">
            Roughly how much coding experience do you have?
          </h3>
          <Slider
            v-model="experienceLevel"
            :min="0"
            :max="99"
            class="mb-4"
          />

          <p class="mb-4 text-gray-500">
            {{ devExperienceDescription }}
          </p>

          <BlockButton
            :click="submitDeveloperExperience"
          >
            Submit
          </BlockButton>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import { experienceLevelToObj } from '@/lib/experienceLevels.js';

import TopNav from '@/components/TopNav.vue';
import Slider from '@/components/Slider.vue';
import Section from '@/components/Section.vue';
import BlockButton from '@/components/BlockButton.vue';
import { notify } from '@/lib/notification.js';

import { 
  eventTutorialBegin
} from '@/lib/analytics.js';

import { 
  updateUser
} from '@/lib/cloudClient.js';

export default {
  components: {
    Slider,
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
  mounted(){
    eventTutorialBegin();
  },
  methods:{
    async submitDeveloperExperience(){
      try {
        await updateUser({
          experienceLevel: this.experienceLevel
        });
        this.$router.push({name: 'SignupFlowCommunity', query: {redirect: this.$route.query.redirect}});
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    }
  }
};
</script>

<style scoped>

</style>
