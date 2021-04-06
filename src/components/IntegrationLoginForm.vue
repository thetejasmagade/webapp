<template>
  <div>
    <div class="container">
      <GoogleButton
        class="btn"
        :on-success="onGoogleSuccess"
        text="Sign up with Google"
      />

      <GithubButton 
        class="btn"
        :is-subscribed-news="subscribeNews"
      />

      <TwitterButton 
        class="btn"
        :is-subscribed-news="subscribeNews"
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
    </div>
  </div>
</template>

<script>
import GoogleButton from '@/components/GoogleButton';
import TwitterButton from '@/components/TwitterButton';
import GithubButton from '@/components/GithubButton';
import ToggleSwitch from '@/components/ToggleSwitch';

import {
  loginGoogle
} from '@/lib/cloudClient.js';
import { gtmEventRegister } from '@/lib/gtm.js';

import {
  loadLoggedIn
} from '@/lib/cloudStore.js';

export default {
  components: {
    GoogleButton,
    TwitterButton,
    GithubButton,
    ToggleSwitch
  },
  data(){
    return {
      state: 'register',
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
    beforeIntegration(){
      if (!this.tosAccepted){
        this.$notify({
          type: 'error',
          text: 'You need to accept the terms of service'
        });
        return;
      }
    },
    async onGoogleSuccess(googleUser){
      try {
        const resp = await loginGoogle(
          googleUser.getAuthResponse().id_token,
          this.subscribeNews,
          this.$route.query.ruid
        );
        loadLoggedIn(this);
        if (resp.registered){
          gtmEventRegister('google');
          this.$router.push({name: 'SignupFlowExperience', params: { courseUUID: this.$route.query.course_uuid}});
          return;
        }
        this.$router.push({name: 'Courses', params: { courseUUID: this.$route.query.course_uuid}});
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

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;

  .item {
    margin-bottom: 2em;
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
  }
}
</style>
