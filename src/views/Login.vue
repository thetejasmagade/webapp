<template>
  <div
    class="login-container"
  >
    <div class="nav-container">
      <TopNav title="Qvault" />
    </div>

    <div class="panel-container">
      <div class="panel">
        <img
          alt="Qvault logo"
          src="../img/qvault-icon-250.png"
          class="logo"
        >

        <span class="title">
          We make computer science <span class="emphasis">simple.</span>
        </span>

        <span class="title sub">
          Demo courses available on signup. Certificates and portfolios free forever.
        </span>

        <div
          v-if="state === 'integration'"
          class="form"
        >
          <IntegrationLoginForm class="top" />
          <div class="bottom">
            <span>Don't like integrations? <a @click="state='register'">Create password</a></span>
            <span>Have a password? <a @click="state='login'">Login</a></span>
          </div>
        </div>

        <div
          v-if="state === 'register'"
          class="form"
        >
          <RegisterForm class="top" />
          <div class="bottom">
            <span>Have an integrated account? <a @click="state='integration'">Single Sign-On</a></span>
            <span>Have an account? <a @click="state='login'">Login</a></span>
          </div>
        </div>

        <div
          v-if="state === 'login'"
          class="form"
        >
          <LoginForm class="top" />
          <div class="bottom">
            <span>Need an account? <a @click="state='register'">Sign Up Free</a></span>
            <span>Have an integrated account? <a @click="state='integration'">Single Sign-On</a></span>
            <span><a @click="state='forgot-password'">Forgot Password?</a></span>
          </div>
        </div>
    
        <div
          v-if="state === 'forgot-password'"
        >
          <ForgotPasswordForm class="top" />
          <div class="bottom">
            <span><a @click="state='login'">Back</a></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  isLoggedIn,
  loginToken,
  getUser,
  updateUserCache
} from '@/lib/cloudClient.js';
import { gtmEventRegister } from '@/lib/gtm.js';

import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import IntegrationLoginForm from '@/components/IntegrationLoginForm';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import TopNav from '@/components/TopNav';

export default {
  components: {
    LoginForm,
    ForgotPasswordForm,
    IntegrationLoginForm,
    RegisterForm,
    TopNav
  },
  data() {
    return {
      state: 'integration'
    };
  },
  async mounted(){
    if (this.$route.query.error){
      this.$notify({
        type: 'error',
        text: this.$route.query.error
      });
    }
    if (this.$route.query.auth_token){
      try {
        loginToken(this.$route.query.auth_token);
        // just make sure token works
        await getUser();

        if (this.$route.query.new_user === 'true'){
          try {
            updateUserCache();
            gtmEventRegister();
            this.$store.commit('setIsLoggedIn', isLoggedIn());
            this.$router.push({name: 'SignupFlowExperience'});
            return;
          } catch (err){
            console.log(err);
          }
        }
      } catch (err){
        this.$notify({
          type: 'error',
          text: err
        });
      }
    }

    this.$store.commit('setIsLoggedIn', isLoggedIn());
    if (this.$store.getters.getIsLoggedIn){
      this.$router.push({name: 'Courses'});
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';
@import '@/styles/backgrounds.scss';

.emphasis {
  color: $purple-light;
}

.form {
  margin: 1em;
}

.login-container {
  background-color: $gray-darkest;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-image: $gray-lines;

  .nav-container {
    width: 100%;
  }

  .panel-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;

    @media (max-width: $mobile-size) {
      justify-content: flex-start;
    }
  }

  .panel {
    background-color: $gray-lightest;
    min-height: 600px;
    box-shadow: 0 0 5em $gray-mid;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding: 1em 2em 1em 2em;

    @media (max-width: $mobile-size) {
      height: 100%;
      padding: 1em;
    }

    .logo {
      width: 75px;
      height: 75px;
      margin-bottom: 1em;
      margin-top: 1em;
    }

    .title {
      color: $gray-dark;
      font-size: 1.4em;
      text-align: center;
      margin-bottom: 1em;

      &.sub {
        color: $gray-light;
        font-size: 1em;
      }
    }

    .top {
      flex: 1;
      display: flex;
      flex-direction: row;
    }

    .bottom {
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;

      span {
        margin-bottom: 10px;
        a {
          cursor: pointer;
        }
      }
    }
  }
}

</style>
