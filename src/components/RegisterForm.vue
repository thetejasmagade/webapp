<template>
  <div
    class="flex flex-col justify-evenly w-full items-center"
  >
    <form
      class="flex flex-col justify-evenly w-full items-center"
      @submit.prevent="submitRegister"
    >
      <TextInput
        v-model="email"
        placeholder="Email"
        type="email"
        name="email"
        required
        class="mb-4 w-full"
      />
      <div class="mb-4 w-full flex flex-row">
        <TextInput
          v-model="firstName"
          class="flex-1"
          placeholder="First Name"
          name="fname"
          required
          type="text"
        />
        <TextInput
          v-model="lastName"
          placeholder="Last Name"
          type="text"
          name="lname"
          required
          class="flex-1 ml-4"
        />
      </div>
      <TextInput
        v-model="password"
        placeholder="Password"
        type="password"
        class="mb-4 w-full"
        required
      />
      <TextInput
        v-model="passwordConfirm"
        placeholder="Confirm Password"
        type="password"
        class="mb-8 w-full"
        required
      />

      <div
        class="
          mb-2
          w-full 
          flex
          flex-row
          justify-center
          items-center
          text-gray-400
          text-sm
          leading-none
        "
      >
        <ToggleSwitch
          v-model="subscribeNews"
        />
        <span class="ml-2">Get coding articles and news</span>
      </div>

      <div
        class="
          mb-8
          w-full 
          flex
          flex-row
          justify-center
          items-center
          text-gray-400
          text-sm
          leading-none
        "
      >
        <ToggleSwitch
          v-model="tosAccepted"
        />
        <span class="ml-2">
          I've read and agree to the 
          <a href="https://qvault.io/terms-of-service/">terms</a>
        </span>
      </div>

      <BlockButton class="mb-4">
        Sign Up Free
      </BlockButton>
    </form>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue';
import TextInput from '@/components/TextInput.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';

import {
  loginManual, 
  createUserManual, 
  sendEmailVerification
} from '@/lib/cloudClient.js';

import { gtmEventRegister } from '@/lib/gtm.js';
import { notify } from '@/lib/notification.js';

export default {
  components: {
    BlockButton,
    TextInput,
    ToggleSwitch
  },
  data(){
    return {
      email: null,
      firstName: null,
      lastName: null,
      password: null,
      passwordConfirm: null,
      subscribeNews: true,
      tosAccepted: true,
      validationCode: null
    };
  },
  methods: {
    async submitRegister(){
      if (!this.tosAccepted){
        notify({
          type: 'danger',
          text: 'You need to accept the terms of service'
        });
        return;
      }
      if (this.registerPassword !== this.registerPasswordConfirm){
        notify({
          type: 'danger',
          text: 'Passwords don\'t match'
        });
        return;
      }
      try {
        await createUserManual(
          this.email, 
          this.password,
          this.firstName,
          this.lastName,
          this.subscribeNews,
          this.$route.query.ruid
        );
        await loginManual(this.email, this.password);
        await sendEmailVerification(this.email);
        gtmEventRegister('email');
        this.$router.push({name: 'VerifyEmail', query: { redirect: this.$route.query.redirect, recruiter:this.$route.query.recruiter}});
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
