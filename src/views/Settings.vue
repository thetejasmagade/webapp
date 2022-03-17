<template>
  <ViewNavWrapper>
    <div class="flex-wrap flex p-4">
      <ConfirmModal
        ref="deleteUserModal"
        heading="Are you absolutely sure you want to permanently delete your account?"
        text="
        All your user data will be permanently erased!
        If you want to cancel your subscription please do so first using the billing section.
        Deleting your account will NOT automatically cancel your subscription.
      "
        :on-confirm="deleteUser"
      />
      <div class="w-full md:w-72">
        <Section :title="`${firstName} ${lastName}`" :subtitle="email">
          <div class="flex flex-col items-center">
            <div class="w-3/4 mt-8 flex flex-col">
              <BlockButton
                :click="() => (currentTab = 'settings')"
                :color="currentTab === 'settings' ? 'blue-light' : 'gray-light'"
                class="m-2"
              >
                Profile
              </BlockButton>
              <BlockButton
                :click="() => (currentTab = 'security')"
                :color="currentTab === 'security' ? 'blue-light' : 'gray-light'"
                class="m-2"
              >
                Security
              </BlockButton>
              <BlockButton
                :click="
                  () => {
                    openCustomerPortal();
                  }
                "
                color="gray-light"
                class="m-2"
              >
                Billing
              </BlockButton>
            </div>
          </div>
        </Section>
      </div>

      <div class="flex-1 pt-4 md:pl-4 md:pt-0">
        <div v-if="currentTab === 'settings'">
          <Section
            title="Edit Your Profile"
            subtitle="Changes will be reflected on your public dev portfolio"
            class="mb-4"
          >
            <div class="p-4">
              <form
                class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4"
                @submit.prevent="updateUser"
              >
                <div
                  class="lg:col-span-3 md:col-span-2 col-span-1 flex justify-evenly items-center"
                >
                  <div>
                    <span>Get notified of job relevant job offers</span>
                    <ToggleSwitch
                      v-model="user.recruitersCanContact"
                      class="inline-block leading-3 ml-4"
                    />
                  </div>
                  <div>
                    <span>Notify me via email about updates and events</span>
                    <ToggleSwitch
                      v-model="user.isSubscribedNews"
                      class="inline-block leading-3 ml-4"
                    />
                  </div>
                </div>

                <div>
                  <span>
                    <TextInput
                      v-model="user.handle"
                      class="w-full"
                      :placeholder="handle"
                      type="text"
                    />
                    <label class="text-gold-600 text-xs">Qvault Handle</label>
                  </span>
                </div>
                <div>
                  <span>
                    <TextInput
                      v-model="user.firstName"
                      class="w-full"
                      :placeholder="firstName"
                      type="text"
                    />
                    <label class="text-gold-600 text-xs">First Name</label>
                  </span>
                </div>
                <div>
                  <span>
                    <TextInput
                      v-model="user.lastName"
                      class="w-full"
                      :placeholder="lastName"
                      type="text"
                    />
                    <label class="text-gold-600 text-xs">Last Name</label>
                  </span>
                </div>

                <div>
                  <span>
                    <TextInput
                      v-model="user.jobTitle"
                      class="w-full"
                      :placeholder="jobTitle"
                      type="text"
                    />
                    <label class="text-gold-600 text-xs">Job Title</label>
                  </span>
                </div>
                <div>
                  <span>
                    <TextInput
                      v-model="user.location"
                      class="w-full"
                      :placeholder="location"
                      type="text"
                    />
                    <label class="text-gold-600 text-xs"
                      >Location (City, Country)</label
                    >
                  </span>
                </div>
                <div>
                  <span>
                    <TextInput
                      v-model="user.websiteURL"
                      class="w-full"
                      :placeholder="websiteURL"
                      type="text"
                    />
                    <label class="text-gold-600 text-xs">Website</label>
                  </span>
                </div>

                <div>
                  <span>
                    <TextInput
                      v-model="user.twitterHandle"
                      class="w-full"
                      :placeholder="twitterHandle"
                      type="text"
                    />
                    <label class="text-gold-600 text-xs">Twitter Handle</label>
                  </span>
                </div>
                <div>
                  <span>
                    <TextInput
                      v-model="user.linkedinURL"
                      class="w-full"
                      :placeholder="linkedinURL"
                      type="text"
                    />
                    <label class="text-gold-600 text-xs">Linkedin URL</label>
                  </span>
                </div>
                <div>
                  <span>
                    <TextInput
                      v-model="user.githubHandle"
                      class="w-full"
                      :placeholder="githubHandle"
                      type="text"
                    />
                    <label class="text-gold-600 text-xs">Github Username</label>
                  </span>
                </div>

                <div class="flex items-center">
                  <ResumeUploader class="mb-4" />
                </div>

                <div class="md:col-span-2 col-span-1">
                  <textarea
                    v-model="user.bio"
                    :placeholder="bio"
                    class="autoexpand tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full border rounded focus:outline-none border-gray-300"
                    rows="4"
                  />
                  <label class="text-gold-600 text-xs">Bio</label>
                </div>

                <div class="lg:col-span-3 md:col-span-2 col-span-1 text-center">
                  <BlockButton> Update </BlockButton>
                </div>
              </form>
            </div>
          </Section>
          <Section
            title="API Key"
            subtitle="Sync your Discord and Qvault accounts"
          >
            <div class="p-4">
              <p>
                To sync or re-sync your account, type the "/sync" command in the
                <a
                  class="text-gold-600 underline"
                  href="https://discord.com/channels/551921866173054977/921896108853178398"
                  target="_blank"
                  >#bot-cli</a
                >
                channel, then to paste in your API key from below.
              </p>
              <div class="flex flex-col justify-center items-center p-4">
                <span>
                  <code class="p-1 rounded bg-gray-800 text-gray-200">
                    {{ $store.getters.getUser?.APIKey }}
                  </code>
                </span>
                <BlockButton
                  class="mt-4"
                  color="red"
                  :click="() => updateUserAPIKey()"
                >
                  Regenerate key
                </BlockButton>
              </div>
            </div>
          </Section>
        </div>

        <div v-if="currentTab === 'security'">
          <Section title="Permanent account deletion">
            <div class="p-4 flex flex-col items-center">
              <BlockButton
                color="red"
                :click="() => $refs.deleteUserModal.show()"
              >
                Delete Account Forever
              </BlockButton>
              <hr />
            </div>
          </Section>
        </div>
      </div>
    </div>
  </ViewNavWrapper>
</template>

<script>
import {
  updateUser,
  updateUserHandle,
  openCustomerPortal,
  deleteUser,
  confirmOnetimePurchase,
  updateUserAPIKey,
} from "@/lib/cloudClient.js";
import { loadUser } from "@/lib/cloudStore.js";
import BlockButton from "@/components/BlockButton.vue";
import TextInput from "@/components/TextInput.vue";
import Section from "@/components/Section.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import ResumeUploader from "@/components/ResumeUploader.vue";
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";

import { setLogout } from "@/lib/cloudStore.js";

import { eventFinishCheckout } from "@/lib/analytics.js";
import { notify } from "@/lib/notification.js";

export default {
  components: {
    ViewNavWrapper,
    BlockButton,
    TextInput,
    Section,
    ToggleSwitch,
    ConfirmModal,
    ResumeUploader,
  },
  data() {
    return {
      currentTab: "settings",
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,
      user: {
        recruitersCanContact: false,
        isSubscribedNews: false,
      },
    };
  },
  computed: {
    handle() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.Handle
        : "Loading...";
    },
    firstName() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.FirstName
        : "Loading...";
    },
    lastName() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.LastName
        : "Loading...";
    },
    email() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.Email
        : "Loading...";
    },
    jobTitle() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.JobTitle
        : "Loading...";
    },
    location() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.Location
        : "Loading...";
    },
    websiteURL() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.WebsiteURL
        : "Loading...";
    },
    twitterHandle() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.TwitterHandle
        : "Loading...";
    },
    linkedinURL() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.LinkedinURL
        : "Loading...";
    },
    githubHandle() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.GithubHandle
        : "Loading...";
    },
    bio() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.Bio
        : "Loading...";
    },
    recruitersCanContact() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.RecruitersCanContact
        : false;
    },
    isSubscribedNews() {
      return this.$store.getters.getUser
        ? this.$store.getters.getUser.IsSubscribedNews
        : false;
    },
  },
  watch: {
    recruitersCanContact(newRecruitersCanContact) {
      this.user.recruitersCanContact = newRecruitersCanContact;
    },
    isSubscribedNews(newIsSubscribedNews) {
      this.user.isSubscribedNews = newIsSubscribedNews;
    },
  },
  async mounted() {
    if (this.$route.query.checkout === "success") {
      this.handleSuccess();
    }

    const computedMeta = getComputedMeta({
      title: "Settings",
      description: "Manage your Qvault settings",
    });
    useMeta(computedMeta);
  },
  methods: {
    async updateUserAPIKey() {
      try {
        await updateUserAPIKey();
        await loadUser(this);
      } catch (err) {
        notify({
          type: "danger",
          text: "Unable to regenerate api key",
        });
        return;
      }
    },
    async handleSuccess() {
      try {
        await loadUser(this);
        if (!this.$store.getters.getUserIsSubscribed) {
          await confirmOnetimePurchase();
          await loadUser(this);
        }
      } catch (err) {
        notify({
          type: "danger",
          text: "Unable to confirm patron account, please contact us",
        });
        return;
      }
      notify({
        type: "success",
        text: "Thanks for supporting us!",
      });
      eventFinishCheckout();
    },
    async deleteUser() {
      try {
        await deleteUser();
        setLogout(this);
        notify({
          type: "success",
          text: "Account deleted successfully",
        });
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
    openCustomerPortal() {
      openCustomerPortal();
    },
    async updateUser() {
      try {
        if (this.user.handle) {
          await updateUserHandle(this.user.handle);
        }
        await updateUser(this.user);
        await loadUser(this);
        notify({
          type: "success",
          text: "Profile updated successfully",
        });
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
  },
};
</script>

<style scoped></style>
