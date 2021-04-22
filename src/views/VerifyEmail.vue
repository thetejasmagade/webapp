<template>
  <div class="verify-email">
    <TopNav />

    <div class="subcontainer">
      <Section
        :title="`Verify your email`"
        :subtitle="`Check '${email}' for a verification code`"
        class="section"
      >
        <form
          class="active-form"
          @submit.prevent="submitVerificationCode"
        >
          <TextInput
            v-model="validationCode"
            placeholder="6 digit code"
            type="text"
            class="item"
          />
          <BlockButton class="btn">
            Submit
          </BlockButton>
          <span><a @click="resendVerification">Resend Code</a></span>
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
        this.$router.push({name: 'SignupFlowExperience', params: { courseUUID: this.$route.params.courseUUID}});
      } catch (err){
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async resendVerification(){
      try {
        await sendEmailVerification(this.email);
      } catch (err){
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

.verify-email {
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
      max-width: 800px;

      .body {
        text-align: center;
      }
    }
  }
}

.active-form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;

  .item {
    margin: 2em;
  }

  .btn {
    margin-bottom: 2em;
    width: 50%;
    min-width: 250px;
  }
}
</style>
