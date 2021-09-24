<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Technical Interests"
        subtitle="By knowing which technologies and subjects you like, we can suggest material that's perfect for you"
        class="max-w-2xl"
      >
        <div class="mx-5">
          <h3 class="text-xl text-gold-600 mt-4 text-center">
            Which do you find most interesting? Select up to 5
          </h3>
          <CheckboxForm
            v-model="checkedAnswers"
            class="mb-4"
            :options="interestsAnswers"
          />
          <div class="text-center">
            <BlockButton
              :click="submitInterests"
              :disabled="checkedAnswers.length < 1 || checkedAnswers.length > 5"
            >
              <span>Submit</span>
            </BlockButton>
          </div>
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
  loadAllInterests
} from '@/lib/cloudStore.js';
import { notify } from '@/lib/notification.js';

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
        this.$router.push({name: 'SignupFlowRecruiters', query: {redirect: this.$route.query.redirect}});
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
