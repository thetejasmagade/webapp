<template>
  <div>
    <div class="flex flex-col justify-evenly w-full items-center">
      <form
        v-if="!sent"
        class="flex flex-col justify-evenly w-full items-center"
        @submit.prevent="submitLogin"
      >
        <TextInput
          v-model="email"
          placeholder="email"
          type="email"
          required
          name="email"
          class="mb-4 w-full"
        />
        <BlockButton class="mb-4 md:w-1/2 w-full">
          Send me a login link
        </BlockButton>
      </form>
      <div v-else>
        <h2 class="my-8 text-xl text-gray-600">
          Click the link in your email to sign in
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import BlockButton from "@/components/BlockButton.vue";
import TextInput from "@/components/TextInput.vue";

import { sendMagicLink } from "@/lib/cloudClient.js";

import { notify } from "@/lib/notification.js";

export default {
  components: {
    BlockButton,
    TextInput,
  },
  data() {
    return {
      email: null,
      sent: false,
    };
  },
  methods: {
    async submitLogin() {
      try {
        await sendMagicLink(this.email);
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
