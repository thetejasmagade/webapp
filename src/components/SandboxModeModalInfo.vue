<template>
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
</template>

<script>
import BlockButton from "@/components/BlockButton.vue";

import { eventOpenSandboxModeModal } from "@/lib/analytics.js";

import { computed, toRefs, onMounted } from "vue";
import { useStore } from "vuex";

import {
  seenSandboxModalLoginKey,
  seenSandboxModalPatronKey,
  markSeen,
} from "@/lib/localStorageLib";

export default {
  components: {
    BlockButton,
  },
  props: {
    onDone: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const { onDone } = toRefs(props);

    onMounted(async () => {
      if (store.getters.getIsLoggedIn) {
        markSeen(seenSandboxModalPatronKey);
      } else {
        markSeen(seenSandboxModalLoginKey);
      }
      eventOpenSandboxModeModal();
    });

    const headingText = computed(() => {
      if (store.getters.getIsLoggedIn) {
        return "Become a patron for full access";
      }
      return "Login for full access";
    });

    const buttonText = computed(() => {
      if (store.getters.getIsLoggedIn) {
        return "Become a patron";
      }
      return "Login";
    });

    const descriptionText = computed(() => {
      if (store.getters.getIsLoggedIn) {
        return `You're in sandbox mode! You can read instructions and play with the code,
        but to check your answers, pass-off your assignments,
        and take quizzes you'll need to become a patron.`;
      }
      return `You're in sandbox mode! You can read instructions and play with the code,
        but to check your answers, pass-off your assignments,
        and take quizzes you'll need to login.`;
    });

    const btnClick = () => {
      onDone.value();
      if (store.getters.getIsLoggedIn) {
        this.$router.push({ name: "Pricing" });
        this.hide();
        return;
      }
      this.$router.push({ name: "Login" });
      this.hide();
      return;
    };
    return {
      headingText,
      buttonText,
      descriptionText,
      btnClick,
    };
  },
};
</script>

<style scoped></style>
