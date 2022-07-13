<template>
  <div class="text-lg">
    <h1 class="text-3xl text-blue-400 mb-4 font-bold">
      {{ headingText }}
    </h1>

    <p class="mb-2">As a Patron you will unlock:</p>

    <div class="p-2">
      <h3 class="text-xl text-blue-400 font-bold">
        Complete access to the CS career path
      </h3>
      <p class="mb-4">
        A single payment plan gets you access to everything you need
      </p>

      <h3 class="text-xl text-blue-400 font-bold">
        A simple path to your first developer job
      </h3>
      <p class="mb-4">
        As you complete lessons you'll be developing a portfolio of projects and
        certificates that qualify you for entry-level programming jobs
      </p>

      <h3 class="text-xl text-blue-400 font-bold">
        Extra support from our creators and community
      </h3>
      <p class="mb-4">
        You'll get access to our patron-only priority Discord chat
      </p>

      <h3 class="text-xl text-blue-400 font-bold">A no-risk education</h3>
      <p class="mb-4">
        Our curriculum costs less than 5% of a typical Bootcamp or college
        degree. If you don't like our program, we'll even refund you!
      </p>

      <h3 class="text-xl text-blue-400 font-bold">A warm, fuzzy feeling</h3>
      <p class="mb-4">
        We're a small team of 2 creators - we appreciate your support!
      </p>
    </div>
    <div class="flex justify-center">
      <BlockButton :click="btnClick">
        {{ buttonText }}
      </BlockButton>
    </div>
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
import { useRouter } from "vue-router";

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
    const router = useRouter();

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
        return "Become a Patron to keep going!";
      }
      return "Login to keep track of your progress!";
    });

    const buttonText = computed(() => {
      if (store.getters.getIsLoggedIn) {
        return "Become a patron";
      }
      return "Login";
    });

    const btnClick = () => {
      onDone.value();
      if (store.getters.getIsLoggedIn) {
        router.push({ name: "Pricing" });
        return;
      }
      router.push({ name: "Login" });
      return;
    };
    return {
      headingText,
      buttonText,
      btnClick,
    };
  },
};
</script>

<style scoped></style>
