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
import TopNav from '@/components/TopNav';
import Slider from '@/components/Slider';
import Section from '@/components/Section';
import BlockButton from '@/components/BlockButton';

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
      if (this.experienceLevel < 10){
        return 'I\'ve never written a line of code';
      }
      if (this.experienceLevel < 20){
        return 'I\'ve taken courses or classes before but have never finished a project';
      }
      if (this.experienceLevel < 30){
        return 'I\'ve completed coding projects or classes but have never been payed to code';
      }
      if (this.experienceLevel < 40){
        return 'I have an entry-level programming job';
      }
      if (this.experienceLevel < 60){
        return 'I have a degree or have worked in the industry for at least 3 years';
      }
      return 'I\'ve been called a senior engineer';
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
        this.$router.push({name: 'SignupFlowInterests', params: { courseUUID: this.$route.params.courseUUID}});
      } catch (err) {
        this.$notify({
          type: 'error',
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
