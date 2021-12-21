<template>
  <div
    class="
      flex
      flex-col
      justify-start
      h-full
    "
  >
    <TopNav />

    <div
      class="
        flex
        flex-1
        justify-center
        items-center
      "
    >
      <Section
        :title="`Verify your email`"
        :subtitle="`Check '${email}' for a verification code`"
      >
        <form
          class="
            flex
            flex-col
            justify-space-evenly
            w-full
            items-center
          "
          @submit.prevent="submitVerificationCode"
        >
          <TextInput
            v-model="validationCode"
            placeholder="6 digit code"
            type="text"
            class="
              mt-4
            "
          />
          <BlockButton
            class="
              mt-4
            "
          >
            Submit
          </BlockButton>
          <span
            class="
              mt-4
            "
          >
            <a @click="resendVerification">Resend Code</a>
          </span>
        </form>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue';
import Section from '@/components/Section.vue';
import TextInput from '@/components/TextInput.vue';
import BlockButton from '@/components/BlockButton.vue';

import {
  sendEmailVerification, 
  verifyEmail
} from '@/lib/cloudClient.js';

import {
  loadLoggedIn,
  loadUser
} from '@/lib/cloudStore.js';
import { notify } from '@/lib/notification.js';

export default {
  components: {
    BlockButton,
    TextInput,
    Section,
    TopNav
  },
  data(){
    return {
      validationCode: null,
      email: null
    };
  },
  async mounted(){
    await loadUser(this);
    this.email = this.$store.getters.getUser.Email;
  },
  methods: {
    async submitVerificationCode(){
      try {
        await verifyEmail(Number(this.validationCode));
        loadLoggedIn(this);
        this.$router.push({name: 'SignupFlowUsername', query: {redirect: this.$route.query.redirect}});
      } catch (err){
        notify({
          type: 'danger',
          text: err
        });
      }
    },
    async resendVerification(){
      try {
        await sendEmailVerification(this.email);
      } catch (err){
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
