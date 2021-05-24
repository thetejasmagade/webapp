<template>
  <div
    class="login-container flex flex-col h-screen bg-gray-100"
  >
    <div class="nav-container">
      <TopNav title="Qvault" />
    </div>

    <div class="grid place-items-center mx-2 my-20 sm:my-auto">
      <div
        class="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
            px-6 py-10 sm:px-10 sm:py-6
            bg-white rounded-lg shadow-md lg:shadow-lg"
      >
        <img
          alt="Qvault logo"
          src="../img/qvault-icon-250.png"
          class="mx-auto w-24 mb-3"
        >

        <h2 class="text-center font-semibold mb-3 text-2xl text-gray-800">
          Mastering computer science can be <span class="font-bold text-blue-400">simple.</span>
        </h2>

        <h3 class="text-center text-gray-500 mb-3">
          All coding courses are free to audit.
        </h3>

        <div
          v-if="state === 'integration'"
        >
          <IntegrationLoginForm />
          <div class="text-center">
            <p>
              Don't like integrations? <a
                class="link"
                @click="state='register'"
              >
                Create password
              </a>
            </p>
            <p>
              Have a password? <a
                class="link"
                @click="state='login'"
              >
                Login
              </a>
            </p>
          </div>
        </div>

        <div
          v-if="state === 'register'"
        >
          <RegisterForm />
          <div class="text-center">
            <p>
              Have an integrated account? <a
                class="link"
                @click="state='integration'"
              >
                Single Sign-On
              </a>
            </p>
            <p>
              Have an account? <a
                class="link"
                @click="state='login'"
              >
                Login
              </a>
            </p>
          </div>
        </div>

        <div
          v-if="state === 'login'"
        >
          <LoginForm />
          <div class="text-center">
            <p>
              Need an account? <a
                class="link"
                @click="state='register'"
              >
                Sign Up Free
              </a>
            </p>
            <p>
              Have an integrated account? <a
                class="link"
                @click="state='integration'"
              >
                Single Sign-On
              </a>
            </p>
            <p>
              <a
                class="link"
                @click="state='forgot-password'"
              >
                Forgot Password?
              </a>
            </p>
          </div>
        </div>
    
        <div
          v-if="state === 'forgot-password'"
        >
          <ForgotPasswordForm />
          <div class="text-center">
            <span><a @click="state='login'">Back</a></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  loginToken,
  getUser,
  updateUserCache,
  updateUser
} from '@/lib/cloudClient.js';
import { gtmEventRegister } from '@/lib/gtm.js';

import {
  loadLoggedIn
} from '@/lib/cloudStore.js';
import { notify } from '@/lib/notification.js';

import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import IntegrationLoginForm from '@/components/IntegrationLoginForm.vue';
import ForgotPasswordForm from '@/components/ForgotPasswordForm.vue';
import TopNav from '@/components/TopNav.vue';

export default {
  metaInfo() {
    const description = 'Login or sign up for Qvault\'s computer science and coding courses. All my courses are free to audit, get started today.';
    const featuredImage = 'https://qvault.io/wp-content/uploads/2021/04/qvault-social-banner.jpg';
    const title = 'Login - Qvault';
    return {
      title: title,
      meta: [
        { vmid:'description', name: 'description', content: description },

        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'og:description', property: 'og:description', content: description },
        { vmid:'og:image', property: 'og:image', content: featuredImage },

        { vmid:'twitter:title', name: 'twitter:title', content: title },
        { vmid:'twitter:description', property: 'twitter:description', content: description },
        { vmid:'twitter:image', name: 'twitter:image', content: featuredImage }
      ]
    };
  },
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
      notify({
        type: 'danger',
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
            gtmEventRegister('twitter/github');
            loadLoggedIn(this);
            if (this.$route.query.recruiter){
              await updateUser({isRecruiter: true});
              this.$router.push({name: 'Recruiters'});
              return;
            }
            this.$router.push({name: 'SignupFlowExperience', query: { redirect: this.$route.query.redirect}});
            return;
          } catch (err){
            console.log(err);
          }
        }
      } catch (err){
        notify({
          type: 'danger',
          text: err
        });
      }
    }

    loadLoggedIn(this);
    if (this.$store.getters.getIsLoggedIn &&
      this.$store.getters.getIsEmailVerified){

      this.$router.push({name: 'Courses', query: {redirect: this.$route.query.redirect}});
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

</style>
