<template>
  <div
    id="container"
  >
    <div class="nav-container">
      <TopNav title="Qvault" />
    </div>

    <div class="panel-container">
      <div class="panel">
        <div id="left">
          <img
            alt="Qvault logo"
            src="../img/qvault-icon-250.png"
            class="logo"
          >

          <span class="title">
            We make learning to code <span class="gold">simple.</span>
          </span>

          <span class="title post">
            <span class="green">Free</span> courses available on signup. Certificates and portfolios free forever.
          </span>

          <div
            v-if="state === 'integration'"
          >
            <IntegrationLoginForm class="top" />
            <div class="bottom">
              <span>Don't like integrations? <a @click="state='register'">Create password</a></span>
              <span>Have a password? <a @click="state='login'">Login</a></span>
            </div>
          </div>

          <div
            v-if="state === 'register'"
          >
            <RegisterForm class="top" />
            <div class="bottom">
              <span>Have an integrated account? <a @click="state='integration'">Single Sign-On</a></span>
              <span>Have an account? <a @click="state='login'">Login</a></span>
            </div>
          </div>

          <div
            v-if="state === 'login'"
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

        <div id="right">
          <img
            id="side-image"
            alt="Transparent books in laptop"
            src="../img/laptop.png"
          >
          <div>
            <span class="title">
              Level-Up Your Career
            </span>
            <p>
              Other platforms barrage their users with endless content, 
              we curate a manageable list of courses that are perfect for you, our student.
            </p>
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
            this.$router.push({name: 'SignupFlow'});
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

#container {
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
  }

  .panel {
    background-color: $gray-lightest;
    min-height: 600px;

    @media (min-width: $mobile-size) {
      width: 60vw;
      margin-top: 1em;
    }

    @media (max-width: $mobile-size) {
      min-height: 0px;
    }

    display: flex;
    flex-flow: row wrap;
    align-items: stretch;
    box-shadow: 0 0 5em $gray-mid;

    #left {
      flex: 4;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      padding-top: 2em;
      background-color: inherit;
      padding: 0px 10px 0px 10px;

      @media (max-width: $mobile-size) {
        height: calc(100vh - #{$bar-height});
        background-image: $gray-lines;
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

        &.post {
          color: $gray-light;
          font-size: 1em;
        }

        .green {
          color: $green-mid;
        }

        .gold {
          color: $purple-light;
        }
      }
    }

    #right{
      padding: 2em;
      flex: 3;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      background-color: $gold-light;
      color: $white;
      text-align: center;

      #side-image {
        width: 300px;
        margin-bottom: 2em;
      }

      .title {
        font-size: 1.5em;
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
