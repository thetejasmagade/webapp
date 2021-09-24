<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="One last thing"
        subtitle="Let recruiters know where you're at"
        class="section"
      >
        <div class="max-w-xl p-4">
          <h2 class="text-xl mt-4 mb-4">
            You're much more likely to be contacted for great
            jobs if you tell us a bit about yourself.
          </h2>

          <div class="text-center flex flex-col">
            <TextInput
              v-model="location"
              placeholder="city, country"
              type="text"
              class="mb-4"
            />
            <TextInput
              v-model="linkedinURL"
              placeholder="linkedin url"
              type="text"
              class="mb-4"
            />
            <ResumeUploader
              class="mb-4"
            />
          </div>

          <div class="text-center">
            <BlockButton
              class="mr-4"
              :click="success"
            >
              Save
            </BlockButton>
            <BlockButton
              class="btn"
              color="gray"
              :click="cancel"
            >
              Skip
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
import TextInput from '@/components/TextInput.vue';
import ResumeUploader from '@/components/ResumeUploader.vue';


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
    BlockButton,
    TextInput,
    ResumeUploader
  },
  data(){
    return {
      location: null,
      linkedinURL: null
    };
  },
  methods:{
    async success(){
      try {
        await updateUser(
          {
            location: this.location,
            linkedinURL: this.linkedinURL
          }
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
