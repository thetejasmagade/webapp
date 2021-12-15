<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Qvault is about achieving career goals"
        subtitle="Do you want help finding your next dev job?"
        class="section"
      >
        <div class="max-w-xl p-4">
          <p class="mb-2">
            We have partnerships with organizations that are dedicated
            to finding great coding jobs for our community. If you're interested in
            <b class="text-gold-700"> getting hired now or in the future </b> then opt-in below. You can also update your settings
            any time, your privacy is an absolute priority to us.
          </p>

          <h2 class="text-xl text-gold-600 mt-4 mb-4">
            If a partner finds a coding job that seems like a great match, can they reach out to you via email?
          </h2>

          <div class="text-center">
            <BlockButton
              class="mr-4"
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
  eventTutorialComplete
} from '@/lib/analytics.js';
import { notify } from '@/lib/notification.js';

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
        this.$router.push({name: 'SignupFlowRecruitersEnrich', query: {redirect: this.$route.query.redirect}});
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    },
    async cancel(){
      eventTutorialComplete();
      this.$router.push({name: 'Courses', query: {redirect: this.$route.query.redirect}});
    }
  }
};
</script>

<style scoped>

</style>
