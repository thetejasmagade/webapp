<template>
  <div class="flex flex-col justify-evenly w-full items-center">
    <form
      v-if="!sent"
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

      <div
        class="mb-2 w-full flex flex-row justify-center items-center text-gray-400 text-sm leading-none"
      >
        <ToggleSwitch v-model="subscribeNews" />
        <span class="ml-2">Get coding articles and news</span>
      </div>

      <div
        class="mb-8 w-full flex flex-row justify-center items-center text-gray-400 text-sm leading-none"
      >
        <ToggleSwitch v-model="tosAccepted" />
        <span class="ml-2">
          I've read and agree to the
          <a href="https://qvault.io/terms-of-service/">terms</a>
        </span>
      </div>

      <BlockButton class="mb-4"> Email me a login link </BlockButton>
    </form>
    <div v-else>
      <h2 class="my-8 text-xl text-gray-600">
        Click the link in your email to sign in
      </h2>
    </div>
  </div>
</template>

<script>
import BlockButton from "@/components/BlockButton.vue";
import TextInput from "@/components/TextInput.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";

import { createUserManual, sendMagicLink } from "@/lib/cloudClient.js";

import { eventRegister, singupMethodEmail } from "@/lib/analytics.js";
import { notify } from "@/lib/notification.js";

export default {
  components: {
    BlockButton,
    TextInput,
    ToggleSwitch,
  },
  data() {
    return {
      email: null,
      firstName: null,
      lastName: null,
      subscribeNews: true,
      tosAccepted: true,
      validationCode: null,
      sent: false,
    };
  },
  methods: {
    async submitRegister() {
      if (!this.tosAccepted) {
        notify({
          type: "danger",
          text: "You need to accept the terms of service",
        });
        return;
      }
      try {
        await createUserManual(
          this.email,
          this.firstName,
          this.lastName,
          this.subscribeNews,
          this.$route.query.ruid
        );
        await sendMagicLink(this.email);
        eventRegister(singupMethodEmail);
        this.sent = true;
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
