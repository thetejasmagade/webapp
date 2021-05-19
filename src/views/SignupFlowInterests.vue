<template>
  <div class="signup-flow-interests">
    <TopNav title="Getting Started" />

    <div class="subcontainer">
      <Section
        title="Technical Interests"
        subtitle="By knowing which technologies and subjects you like, we can suggest material that's perfect for you"
        class="section"
      >
        <div class="body">
          <h3>Which do you find most interesting? Select up to 5</h3>
          <CheckboxForm
            v-model="checkedAnswers"
            :options="interestsAnswers"
          />
          <BlockButton
            class="btn"
            color="purple"
            :click="submitInterests"
            :disabled="checkedAnswers.length < 1 || checkedAnswers.length > 5"
          >
            <span>Submit</span>
          </BlockButton>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue';
import Section from '@/components/Section.vue';
import CheckboxForm from '@/components/CheckboxForm.vue';
import BlockButton from '@/components/BlockButton.vue';

import { 
  updateUserInterests
} from '@/lib/cloudClient.js';

import { 
  gtmEventTutorialComplete
} from '@/lib/gtm.js';


import { 
  loadAllInterests
} from '@/lib/cloudStore.js';

export default {
  components: {
    TopNav,
    Section,
    CheckboxForm,
    BlockButton
  },
  data(){
    return {
      interestUUIDs: [],
      checkedAnswers: [],
      interestsMap: {}
    };
  },
  computed: {
    interestsAnswers(){
      return Object.keys(this.interestsMap);
    }
  },
  async mounted(){
    await loadAllInterests(this);
    let interestsMap = {};
    for (const interest of this.$store.getters.getAllInterests){
      interestsMap[interest.Title] = interest.UUID;
    }
    this.interestsMap = interestsMap;
  },
  methods:{
    async submitInterests(){
      const interestUUIDs = [];
      for (const answer of this.checkedAnswers){
        interestUUIDs.push(this.interestsMap[answer]);
      }
      try {
        await updateUserInterests(interestUUIDs);
        gtmEventTutorialComplete();
        this.$router.push({name: 'Courses', query: {redirect: this.$route.query.redirect}});
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

.signup-flow-interests {
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
      max-width: 700px;
      
      .body {
        text-align: center;
      }
    }
  }
}
</style>
