<template>
  <div class="root">
    <TopNav title="Getting Started" />

    <div class="subcontainer">
      <Section
        v-if="page === 0"
        title="Developer Experience"
        subtitle="Let us know where you're at as a programmer so we can recommend the best courses for you"
      >
        <MultipleChoice
          :callback="submitDeveloperExperience"
          :answers="devExperienceAnswers"
          question="Which answer best describes you?"
        />
      </Section>

      <Section
        v-else-if="page === 1"
        title="Technical Interests"
        subtitle="By knowing which technologies and subjects you like, we can suggest material that's perfect for you"
      >
        <CheckboxForm
          :callback="submitInterests"
          :answers="interestsAnswers"
          question="Which do you find most interesting? Select up to 5"
          :min-checked="1"
          :max-checked="5"
        />
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav';
import MultipleChoice from '@/components/MultipleChoice';
import Section from '@/components/Section';
import CheckboxForm from '@/components/CheckboxForm';

import { 
  updateUser,
  getInterests,
  updateUserInterests
} from '@/lib/cloudClient.js';

export default {
  components: {
    MultipleChoice,
    TopNav,
    Section,
    CheckboxForm
  },
  beforeRouteUpdate (to, from, next) {
    this.lang = to.params.lang;
    this.setCode();
    next();
  },
  data(){
    return {
      page: 0,
      experienceLevel: 0,
      interestUUIDs: [],
      // answer -> exerienceLevel
      devExperienceAnswersMap: {
        'I\'ve never written a line of code': 0,
        'I\'ve taken courses or classes before but have never finished a project': 10,
        'I\'ve completed coding projects or classes but have never been payed to code': 20,
        'I have an entry-level programming job': 30,
        'I have a degree or have worked in the industry for at least 3 years': 40,
        'I\'ve been called a senior engineer': 60
      },
      interestsMap: {}
    };
  },
  computed: {
    devExperienceAnswers(){
      return Object.keys(this.devExperienceAnswersMap);
    },
    interestsAnswers(){
      return Object.keys(this.interestsMap);
    }
  },
  async mounted(){
    const interests = await getInterests();
    let interestsMap = {};
    for (const interest of interests){
      interestsMap[interest.Title] = interest.UUID;
    }
    this.interestsMap = interestsMap;
  },
  methods:{
    async submitDeveloperExperience(answer){
      const experienceLevel = this.devExperienceAnswersMap[answer];
      try {
        await updateUser({
          experienceLevel
        });
        this.page = 1;
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async submitInterests(answers){
      const interestUUIDs = [];
      for (const answer of answers){
        interestUUIDs.push(this.interestsMap[answer]);
      }
      try {
        await updateUserInterests(interestUUIDs);
        this.$router.push({name: 'Courses'});
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

.root {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-image: $gray-lines;

  .langs{
    display: flex;
    flex-direction: row;
    padding: 1em;
    
    a {
      padding-left: 10px;
    }
  }

  #editor {
    flex: 1;
    background-color: $white;
    max-height: 100%;
    overflow: auto;
  }

  .select-container{
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    margin: 1em;

    @media screen and (max-width: $mobile-size) {
      justify-content: center;
    }
  }

  .select {
    max-width: 300px;

    @media screen and (max-width: $mobile-size) {
      max-width: 100%;
    }
  }
}
</style>
