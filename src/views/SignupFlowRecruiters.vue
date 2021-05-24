<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Landing your dream job"
        subtitle="We not only educate, but also help you find you a job you love"
        class="section"
      >
        <div class="max-w-xl p-4">
          <p class="mb-2">
            We have exclusive partnerships with organizations that are dedicated
            to finding great tech jobs for our students. If you're interested in
            <b class="text-gold-700"> getting hired now or in the future </b> then opt-in below. You can also update your settings
            any time, your privacy is a priority to us.
          </p>

          <p class="mb-2">
            Make sure to update your Qvault profile with a picture, LinkedIn account, location,
            etc, to increase your chances of getting contacted!
          </p>

          <h2 class="text-xl text-gold-600 mt-4 mb-4">
            If we find a coding job that seems like a great match, can our partners reach out?
          </h2>

          <div class="text-center">
            <BlockButton
              class="mr-4"
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
        gtmEventTutorialComplete();
        this.$router.push({name: 'Settings', query: {redirect: this.$route.query.redirect}});
      } catch (err) {
        notify({
          type: 'danger',
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

<style scoped>

</style>
