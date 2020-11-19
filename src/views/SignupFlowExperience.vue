<template>
  <div class="signup-flow-experience">
    <TopNav title="Getting Started" />

    <div class="subcontainer">
      <Section
        title="Developer Experience"
        subtitle="Let us know where you're at as a programmer so we can recommend the best courses for you"
        class="section"
      >
        <MultipleChoice
          :callback="submitDeveloperExperience"
          :answers="devExperienceAnswers"
          question="Which answer best describes you?"
        />
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav';
import MultipleChoice from '@/components/MultipleChoice';
import Section from '@/components/Section';

import { 
  updateUser
} from '@/lib/cloudClient.js';

export default {
  components: {
    MultipleChoice,
    TopNav,
    Section
  },
  data(){
    return {
      experienceLevel: 0,
      // answer -> exerienceLevel
      devExperienceAnswersMap: {
        'I\'ve never written a line of code': 0,
        'I\'ve taken courses or classes before but have never finished a project': 10,
        'I\'ve completed coding projects or classes but have never been payed to code': 20,
        'I have an entry-level programming job': 30,
        'I have a degree or have worked in the industry for at least 3 years': 40,
        'I\'ve been called a senior engineer': 60
      }
    };
  },
  computed: {
    devExperienceAnswers(){
      return Object.keys(this.devExperienceAnswersMap);
    }
  },
  methods:{
    async submitDeveloperExperience(answer){
      const experienceLevel = this.devExperienceAnswersMap[answer];
      try {
        await updateUser({
          experienceLevel
        });
        this.$router.push({name: 'SignupFlowInterests' });
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
@import '@/styles/backgrounds.scss';

.signup-flow-experience {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-image: $gray-lines;

  .subcontainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;

    .section {
      max-width: 800px;
    }
  }
}
</style>
