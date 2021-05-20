<template>
  <div class="signup-flow-recruiters">
    <TopNav title="Getting Started" />

    <div class="subcontainer">
      <Section
        title="Landing your dream job"
        subtitle="We not only educate, but also help you find you a job you love"
        class="section"
      >
        <div class="body">
          <p>
            We have exclusive partnerships with organizations that are dedicated
            to finding great tech jobs for our students. If you're interested in
            <b> getting hired now or in the future </b> then opt-in below. You can also update your settings
            any time, your privacy is a priority to us.
          </p>
          <p>
            Make sure to update your Qvault profile with a picture, LinkedIn account, location,
            etc, to increase your chances of getting contacted!
          </p>
          <h2>If we find a coding job that could work for you, can our partners contact you?</h2>
          <BlockButton
            class="btn"
            color="purple"
            :click="success"
          >
            Yes! Contact me
          </BlockButton>
          <BlockButton
            class="btn"
            color="gray"
            :click="cancel"
          >
            No thanks
          </BlockButton>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue';
import Section from '@/components/Section.vue';
import BlockButton from '@/components/BlockButton.vue';

import { 
  updateUser
} from '@/lib/cloudClient.js';

import { 
  gtmEventTutorialComplete
} from '@/lib/gtm.js';

export default {
  components: {
    TopNav,
    Section,
    BlockButton
  },
  methods:{
    async success(){
      try {
        await updateUser(
          { recruitersCanContact: true }
        );
        gtmEventTutorialComplete();
        this.$router.push({name: 'Settings', query: {redirect: this.$route.query.redirect}});
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async cancel(){
      gtmEventTutorialComplete();
      this.$router.push({name: 'Courses', query: {redirect: this.$route.query.redirect}});
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
        padding: 1em;

        p {
          text-align: left;
        }
      }
    }
  }

  .btn {
    margin: 1em;
  }
}
</style>
