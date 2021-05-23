<template>
  <div class="signup-flow-experience">
    <TopNav title="Getting Started" />

    <div class="subcontainer">
      <Section
        title="Developer Experience"
        subtitle="Let us know where you're at as a programmer so we can recommend the best courses for you"
        class="section"
      >
        <div class="body">
          <h3>Roughly how much coding experience do you have?</h3>
          <Slider
            v-model="experienceLevel"
            :min="0"
            :max="99"
            class="slider"
          />
          <p>{{ devExperienceDescription }}</p>
          <BlockButton
            class="btn"
            color="purple"
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
  gtmEventTutorialBegin
} from '@/lib/gtm.js';

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
    gtmEventTutorialBegin();
  },
  methods:{
    async submitDeveloperExperience(){
      try {
        await updateUser({
          experienceLevel: this.experienceLevel
        });
        this.$router.push({name: 'SignupFlowInterests', query: {redirect: this.$route.query.redirect}});
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

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.signup-flow-experience {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;

  .subcontainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;

    .section {
      max-width: 800px;

      .body {
        text-align: center;
      }
    }
  }

  .slider {
    margin-bottom: 1.5em;
  }
}
</style>
