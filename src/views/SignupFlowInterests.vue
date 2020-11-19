<template>
  <div class="signup-flow-interests">
    <TopNav title="Getting Started" />

    <div class="subcontainer">
      <Section
        title="Technical Interests"
        subtitle="By knowing which technologies and subjects you like, we can suggest material that's perfect for you"
        class="section"
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
import Section from '@/components/Section';
import CheckboxForm from '@/components/CheckboxForm';

import { 
  getInterests,
  updateUserInterests
} from '@/lib/cloudClient.js';

export default {
  components: {
    TopNav,
    Section,
    CheckboxForm
  },
  data(){
    return {
      interestUUIDs: [],
      interestsMap: {}
    };
  },
  computed: {
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
    async submitInterests(answers){
      const interestUUIDs = [];
      for (const answer of answers){
        interestUUIDs.push(this.interestsMap[answer]);
      }
      try {
        await updateUserInterests(interestUUIDs);
        this.$router.push({name: 'SignupFlowGems'});
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

.signup-flow-interests {
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
