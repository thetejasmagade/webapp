<template>
  <div>
    <div class="integration-container">
      <BlockButton
        :click="clickGoogle"
        color="gold"
        class="my-5"
      >
        <FontAwesomeIcon
          :icon="['fab', 'google']"
          class="mr-3"
        />
        Sign in with Google
      </BlockButton>

      <BlockButton
        :click="clickGithub"
        color="gray"
        class="mb-5"
      >
        <FontAwesomeIcon
          :icon="['fab', 'github']"
          class="mr-3"
        />
        Sign in with Github
      </BlockButton>

      <BlockButton
        :click="clickTwitter"
        color="purple"
        class="mb-5"
      >
        <FontAwesomeIcon
          :icon="['fab', 'twitter']"
          class="mr-3"
        />
        Sign in with Twitter
      </BlockButton>

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
        <span class="sub-item right">
          I've read and agree to the 
          <a
            class="link"
            href="https://qvault.io/terms-of-service/"
          >
            terms
          </a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
  loginGoogle,
  updateUser
} from '@/lib/cloudClient.js';
import { gtmEventRegister } from '@/lib/gtm.js';
import { notify } from '@/lib/notification.js';

import {
  loadLoggedIn
} from '@/lib/cloudStore.js';

import {
  getLoginWithGithubURL
} from '@/lib/cloudClient.js';

import {
  getLoginWithTwitterURL
} from '@/lib/cloudClient.js';


export default {
  components: {
    BlockButton,
    ToggleSwitch,
    FontAwesomeIcon
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
        notify({
          type: 'danger',
          text: 'You need to accept the terms of service'
        });
        return;
      }
    },
    async clickGoogle(){
      try {
        this.$gAuth.signIn(this.onGoogleSuccess, this.onGoogleFailure);
      } catch (err){
        notify({
          type: 'danger',
          text: err
        });
      }
    },
    async clickTwitter(){
      window.location.replace(getLoginWithTwitterURL(this.isSubscribedNews, this.$route.query.ruid));
    },
    async clickGithub(){
      window.location.replace(getLoginWithGithubURL(this.isSubscribedNews, this.$route.query.ruid));
    },
    async onGoogleFailure(){
      notify({
        type: 'danger',
        text: 'Couldn\'t log in with Google'
      });
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
          if (this.$route.query.recruiter){
            await updateUser({isRecruiter: true});
            this.$router.push({name: 'Recruiters'});
            return;
          }
          this.$router.push({name: 'SignupFlowExperience', query: { redirect: this.$route.query.redirect}});
          return;
        }
        this.$router.push({name: 'Courses', query: { redirect: this.$route.query.redirect}});
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

.integration-container {
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
