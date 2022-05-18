<template>
  <Modal ref="sandboxModeModal">
    <div>
      <h1 class="text-2xl text-blue-400 mb-4">
        {{ headingText }}
      </h1>
      <p class="mb-4">
        {{ descriptionText }}
      </p>
      <BlockButton :click="btnClick">
        {{ buttonText }}
      </BlockButton>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modals/Modal.vue";
import BlockButton from "@/components/BlockButton.vue";

import { eventOpenSandboxModeModal } from "@/lib/analytics.js";

import {
  seenSandboxModalLoginKey,
  seenSandboxModalPatronKey,
  markSeen,
  hasSeen,
} from "@/lib/localStorageLib";

export default {
  components: {
    Modal,
    BlockButton,
  },
  computed: {
    headingText() {
      if (this.$store.getters.getIsLoggedIn) {
        return "Become a patron for full access";
      }
      return "Login for full access";
    },
    buttonText() {
      if (this.$store.getters.getIsLoggedIn) {
        return "Become a patron";
      }
      return "Login";
    },
    descriptionText() {
      if (this.$store.getters.getIsLoggedIn) {
        return `You're in sandbox mode! You can read instructions and play with the code,
        but to check your answers, pass-off your assignments,
        and take quizzes you'll need to become a patron.`;
      }
      return `You're in sandbox mode! You can read instructions and play with the code,
        but to check your answers, pass-off your assignments,
        and take quizzes you'll need to login.`;
    },
  },
  methods: {
    show() {
      if (this.$store.getters.getIsLoggedIn) {
        markSeen(seenSandboxModalPatronKey);
      } else {
        markSeen(seenSandboxModalLoginKey);
      }
      eventOpenSandboxModeModal();
      this.$refs.sandboxModeModal?.show();
    },
    showWithCache() {
      if (
        this.$store.getters.getIsLoggedIn &&
        hasSeen(seenSandboxModalPatronKey)
      ) {
        return;
      }
      if (
        !this.$store.getters.getIsLoggedIn &&
        hasSeen(seenSandboxModalLoginKey)
      ) {
        return;
      }
      this.show();
    },
    hide() {
      this.$refs.sandboxModeModal?.hide();
    },
    btnClick() {
      if (this.$store.getters.getIsLoggedIn) {
        this.$router.push({ name: "Pricing" });
        this.hide();
        return;
      }
      this.$router.push({ name: "Login" });
      this.hide();
      return;
    },
  },
};
</script>

<style scoped></style>
