<template>
  <div class="settings-root">
    <div class="sidebar">
      <Section
        :title="`${firstName} ${lastName }`"
        :subtitle="email"
      >
        <div class="body">
          <div class="tab">
            <BlockButton
              :click="() => currentTab='settings'"
              :color="currentTab==='settings' ? 'purple-light':'gray-light'"
              class="btn tabItems"
            >
              Profile
            </BlockButton>
            <BlockButton
              :click="() => currentTab='updatePass'"
              :color="currentTab==='updatePass' ? 'purple-light':'gray-light'"
              class="btn tabItems"
            >
              Security
            </BlockButton>
            <BlockButton
              :click="() => {openCustomerPortal()}"
              color="gray-light"
              class="btn tabItems"
            >
              Billing
            </BlockButton>
          </div>
        </div>
      </Section>
    </div>

    <div class="profileContent">
      <div
        v-if="currentTab === 'settings'"
        class="visualItems"
      >
        <Section
          title="Edit Your Profile"
          subtitle="Changes will be reflected on your public dev portfolio"
        >
          <div class="innerProfile">
            <form @submit.prevent="updateUser">
              <div class="row">
                <div class="col">
                  <span>
                    <TextInput
                      v-model="user.handle"
                      class="inputItems"
                      :placeholder="handle"
                      type="text"
                    />
                    <label>Qvault Handle</label>
                  </span>
                </div>
                <div class="col">
                  <span>
                    <TextInput
                      v-model="user.firstName"
                      class="inputItems"
                      :placeholder="firstName"
                      type="text"
                    />
                    <label>First Name</label>
                  </span>
                </div>
                <div class="col">
                  <span>
                    <TextInput
                      v-model="user.lastName"
                      class="inputItems"
                      :placeholder="lastName"
                      type="text"
                    />
                    <label>Last Name</label>
                  </span>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <span>
                    <TextInput
                      v-model="user.jobTitle"
                      class="inputItems"
                      :placeholder="jobTitle"
                      type="text"
                    />
                    <label>Job Title</label>
                  </span>
                </div>
                <div class="col">
                  <span>
                    <TextInput
                      v-model="user.location"
                      class="inputItems"
                      :placeholder="location"
                      type="text"
                    />
                    <label>Location</label>
                  </span>
                </div>
                <div class="col">
                  <span>
                    <TextInput
                      v-model="user.websiteURL"
                      class="inputItems"
                      :placeholder="websiteURL"
                      type="text"
                    />
                    <label>Website</label>
                  </span>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <span>
                    <TextInput
                      v-model="user.twitterHandle"
                      class="inputItems"
                      :placeholder="twitterHandle"
                      type="text"
                    />
                    <label>Twitter Handle</label>
                  </span>
                </div>
                <div class="col">
                  <span>
                    <TextInput
                      v-model="user.linkedinURL"
                      class="inputItems"
                      :placeholder="linkedinURL"
                      type="text"
                    />
                    <label>Linkedin URL</label>
                  </span>
                </div>
                <div class="col">
                  <span>
                    <TextInput
                      v-model="user.githubHandle"
                      class="inputItems"
                      :placeholder="githubHandle"
                      type="text"
                    />
                    <label>Github Username</label>
                  </span>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <textarea
                    v-model="user.bio"
                    :placeholder="bio"
                    class="inputItems textarea"
                    rows="4"
                  />
                  <label>Bio</label>
                </div>
              </div>
              <div class="text-center">
                <BlockButton class="btn">
                  Update
                </BlockButton>
              </div>
            </form>
          </div>
        </Section>
      </div>

      <div
        v-if="currentTab === 'updatePass'"
        class="visualItems"
      >
        <Section
          title="Security Preferences"
        >
          <div class="security-body">
            <form
              @submit.prevent="updatePassword"
            >
              <p class="title">
                Change Password
              </p>
              <TextInput
                v-model="oldPassword"
                placeholder="Old Password"
                type="password"
                class="inputItems vertical"
              />
              <TextInput
                v-model="newPassword"
                class="inputItems vertical"
                placeholder="New Password"
                type="password"
              />
              <TextInput
                v-model="confirmPassword"
                class="inputItems vertical"
                placeholder="Confirm Password"
                type="password"
              />
              <BlockButton class="btn">
                Submit
              </BlockButton>
            </form>
          </div>
        </Section>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  updateUserPassword, 
  updateUser, 
  updateUserHandle,
  openCustomerPortal
} from '@/lib/cloudClient.js';
import { loadUser } from '@/lib/cloudStore.js';
import BlockButton from '@/components/BlockButton.vue';
import TextInput from '@/components/TextInput.vue';
import Section from '@/components/Section.vue';

import { 
  gtmEventFinishCheckout
} from '@/lib/gtm.js';

export default {
  metaInfo() {
    const title = 'Qvault - Settings';
    return {
      title: title,
      meta: [
        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'twitter:title', name: 'twitter:title', content: title }
      ]
    };
  },
  components: {
    BlockButton,
    TextInput,
    Section
  },
  data() {
    return {
      currentTab: 'settings',
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,
      user: {}
    };
  },
  computed: {
    handle(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.Handle : 'Loading...';
    },
    firstName(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.FirstName : 'Loading...';
    },
    lastName(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.LastName : 'Loading...';
    },
    email(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.Email : 'Loading...';
    },
    jobTitle(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.JobTitle : 'Loading...';
    },
    location(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.Location : 'Loading...';
    },
    websiteURL(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.WebsiteURL : 'Loading...';
    },
    twitterHandle(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.TwitterHandle : 'Loading...';
    },
    linkedinURL(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.LinkedinURL : 'Loading...';
    },
    githubHandle(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.GithubHandle : 'Loading...';
    },
    bio(){
      return this.$store.getters.getUser ? this.$store.getters.getUser.Bio : 'Loading...';
    }
  },
  mounted(){
    if (this.$route.query.checkout === 'success'){
      this.$notify({
        type: 'success',
        text: 'Welcome to Qvault Pro!'
      });
      gtmEventFinishCheckout('20', 'qvault-pro', 'Qvault Pro');
    }
  },
  methods: {
    openCustomerPortal() {
      openCustomerPortal();
    },
    async updateUser() {
      try {
        if (this.user.handle){
          await updateUserHandle(this.user.handle);
        }
        await updateUser(this.user);
        await loadUser(this);
        this.$notify({
          type: 'success',
          text: 'Profile updated successfully'
        });
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async updatePassword() {
      try {
        if (this.newPassword !== this.confirmPassword){
          this.$notify({
            type: 'error',
            text: 'Passwords don\'t match'
          });
          return;
        }
        await updateUserPassword(
          this.email,
          this.oldPassword,
          this.newPassword
        );
        this.$notify({
          type: 'success',
          text: 'Password changed successfully'
        });
        this.oldPassword = null;
        this.newPassword = null;
      } catch (err) {
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
@import "@/styles/colors.scss";

label {
  font-size: .75em;
  color: $gold-dark;
}

.profile-img {
  width: 175px;
}

.settings-root {
  color: $gray-darker;
  display: flex;
  flex-wrap: wrap;
  height: 100%;

  .sidebar {
    width: 300px;
    padding: 15px 0 15px 15px;

    .body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .profileContent {
    flex: 1;
    padding: 15px;
    overflow: auto;
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;

    .visualItems {

      .inputItems {
        line-height: 26px;
        width: 100%;
        font-family: 'Roboto', sans-serif;

        &.textarea {
          outline: none;
          resize: none;
          border-color: $gray-lighter;
          background: inherit;

          &:focus{
            border-color: $purple-dark;
          }
        }

        &.vertical{
          margin-bottom: 1em;
        }
      }

      .security-body {
        position: relative;
        display: flex;
        justify-content: center;
        @media (max-width: 768px) {
          width: 99%;
        }

        form {
          display: flex;
          justify-content: center;
          flex-direction: column;
          padding: 30px;
          align-items: center;
          margin: 35px 0;
          max-width: 400px;
          width: 100%;

          .title {
            text-align: center;
            font-size: 1.4rem;
            padding: 12px 27px;
            font-weight: bold;
            color: $gray-lightest;
          }
        }
      }

      .btn {
        width: 200px;
        margin: 10px;
      }
    }
  }
}

.innerProfile {
  padding: 25px;

  .row {
    display: flex;
    flex-wrap: wrap;
    @media (max-width: 768px) {
      flex-direction: column;
    }

    .col {
      flex: 1;
      padding: 15px;
    }
  }
}

.tab {
  width: 75%;
  margin: 50px 0;
  display: flex;
  flex-direction: column;

  .tabItems {
    margin: 0 .5em 1em .5em;
    font-weight: bold;
  }
}
</style>
