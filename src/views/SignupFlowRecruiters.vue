<template>
  <div class="signup-flow-recruiters">
    <TopNav title="Getting Started" />

    <div class="subcontainer">
      <Section
        title="Landing your dream job"
        subtitle="It's our goal at Qvault not just to educate, but to help you find a tech job you love"
        class="section"
      >
        <div class="body">
          <h3>Would you like our recruiting partners to contact you for job oppurtunities?</h3>
          <ToggleSwitch
            v-model="canContact"
          />
          <BlockButton
            class="btn"
            color="purple"
            :click="submit"
          >
            Submit
          </BlockButton>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue';
import Section from '@/components/Section.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import BlockButton from '@/components/BlockButton.vue';

import { 
  updateUser
} from '@/lib/cloudClient.js';

export default {
  components: {
    TopNav,
    Section,
    ToggleSwitch,
    BlockButton
  },
  data(){
    return {
      canContact: true
    };
  },
  methods:{
    async submit(){
      try {
        await updateUser(
          { recruitersCanContact: this.canContact }
        );
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

.signup-flow-recruiters {
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

  .btn {
    margin: 1em;
  }
}
</style>
