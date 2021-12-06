<template>
  <div>
    <form
      v-if="state === 'get-code'"
      class="
        flex
        flex-col
        justify-evenly
        w-full
        items-center
        mt-8
      "
      @submit.prevent="submitForgotPasswordEmail"
    >
      <TextInput
        v-model="email"
        placeholder="email"
        type="email"
        class="mb-8 w-full"
      />
      <BlockButton class="mb-2 md:w-1/2 w-full">
        Get recovery code
      </BlockButton>
    </form>

    <form
      v-if="state === 'submit-code'"
      class="
        flex
        flex-col
        justify-evenly
        w-full
        items-center
        mt-8
      "
      @submit.prevent="submitRecoveryCode"
    >
      <TextInput
        v-model="code"
        placeholder="6 digit recover code"
        type="text"
        class="mb-4 w-full"
      />
      <TextInput
        v-model="newPassword"
        placeholder="new password"
        type="password"
        class="mb-8 w-full"
      />
      <BlockButton class="mb-2 md:w-1/2 w-full">
        Set new password
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

<style scoped>

</style>
