<template>
  <div>
    <form
      v-if="state === 'get-code'"
      id="forgot-form"
      @submit.prevent="submitForgotPasswordEmail"
    >
      <span class="title item">Recover Password</span>
      <TextInput
        v-model="email"
        placeholder="email"
        type="email"
        class="item"
      />
      <BlockButton class="btn">
        Submit
      </BlockButton>
    </form>

    <form
      v-if="state === 'submit-code'"
      id="forgot-form"
      @submit.prevent="submitRecoveryCode"
    >
      <span class="title">Enter Recovery Code</span>
      <TextInput
        v-model="code"
        placeholder="6 digit code"
        type="text"
      />
      <TextInput
        v-model="newPassword"
        placeholder="new password"
        type="password"
      />
      <BlockButton class="btn">
        Submit
      </BlockButton>
      <span><a @click="resendVerification">Resend Code</a></span>
    </form>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue';
import TextInput from '@/components/TextInput.vue';
import {
  loginManual,
  updateUserPasswordCode,
  sendEmailVerification
} from '@/lib/cloudClient.js';

import {
  loadLoggedIn
} from '@/lib/cloudStore.js';

import { notify } from '@/lib/notification.js';

export default {
  components: {
    BlockButton,
    TextInput
  },
  data(){
    return {
      state: 'get-code',
      email: null,
      newPassword: null,
      code: null
    };
  },
  methods: {
    async submitForgotPasswordEmail(){
      try {
        await sendEmailVerification(this.email);
        this.state='submit-code';
      } catch (err){
        notify({
          type: 'danger',
          text: err
        });
      }
    },
    async submitRecoveryCode(){
      try {
        await updateUserPasswordCode(
          this.email,
          this.newPassword,
          Number(this.code)
        );
        await loginManual(this.email, this.newPassword);
        loadLoggedIn(this);
        this.$router.push({name: 'Courses'});
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

<style scoped lang="scss">
@import '@/styles/colors.scss';

#forgot-form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;

  .title {
    font-size: 1em;
    color: $gray-darker;
    text-align: center;
  }

  .item {
    margin-bottom: 2em;
    width: 100%;
  }

  .btn {
    margin-bottom: 2em;
    width: 50%;
    min-width: 250px;
  }
}
</style>
