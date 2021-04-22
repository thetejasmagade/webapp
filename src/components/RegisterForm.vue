<template>
  <div
    class="active-form"
  >
    <form
      class="active-form"
      @submit.prevent="submitRegister"
    >
      <TextInput
        v-model="email"
        placeholder="Email"
        type="email"
        name="email"
        required
        class="item input"
      />
      <div class="item">
        <TextInput
          v-model="firstName"
          class="sub-item"
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
          class="sub-item right"
        />
      </div>
      <TextInput
        v-model="password"
        placeholder="Password"
        type="password"
        class="item"
        required
      />
      <TextInput
        v-model="passwordConfirm"
        placeholder="Confirm Password"
        type="password"
        class="item"
        required
      />

      <div class="item switch">
        <ToggleSwitch
          v-model="subscribeNews"
        />
        <span class="sub-item right">Get coding articles and news</span>
      </div>

      <div class="item switch">
        <ToggleSwitch
          v-model="tosAccepted"
        />
        <span class="sub-item right">I've read and agree to the 
          <a href="https://qvault.io/terms-of-service/">terms</a>
        </span>
      </div>

      <BlockButton class="btn">
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
        this.$notify({
          type: 'error',
          text: 'You need to accept the terms of service'
        });
        return;
      }
      if (this.registerPassword !== this.registerPasswordConfirm){
        this.$notify({
          type: 'error',
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
        this.$router.push({name: 'VerifyEmail', params: { courseUUID: this.$route.query.course_uuid}});
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

.active-form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;

  .item {
    margin-bottom: 2em;
    width: 100%;
    display: flex;
    flex-direction: row;
    
    &.switch{
      align-items: center;
      justify-content: center;
      color: $gray-mid;
      font-size: .75em;
      line-height: .75em;
    }

    .sub-item {
      flex: 1;
    }

    .right {
      margin-left: 1em;
    }
  }

  .btn {
    margin-bottom: 2em;
    width: 50%;
    min-width: 250px;
  }
}
</style>
