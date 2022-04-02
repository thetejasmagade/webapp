<template>
  <div class="flex flex-col items-center">
    <div class="rounded w-4/5 max-w-md bg-gray-900 text-gray-200 my-8">
      <h2 class="my-4 text-lg px-4 max-w-xl">
        {{ question }}
      </h2>
    </div>
    <BlockButton
      v-for="(answer, i) of answers"
      :key="i"
      class="text-lg w-4/5 mb-2 max-w-md"
      color="blue"
      :click="
        () => {
          callback(answer);
        }
      "
      :disabled="sandbox"
    >
      <span>{{ answer }}</span>
    </BlockButton>
    <BlockButton
      v-if="sandbox"
      class="text-lg w-4/5 m-4 max-w-md"
      :click="sandboxClick"
      color="blue"
    >
      <span>{{ buttonText }}</span>
    </BlockButton>
  </div>
</template>

<script>
import BlockButton from "@/components/BlockButton.vue";

export default {
  components: {
    BlockButton,
  },
  props: {
    callback: {
      type: Function,
      required: true,
    },
    question: {
      type: String,
      required: false,
      default: "",
    },
    sandbox: {
      type: Boolean,
      required: false,
      default: false,
    },
    answers: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    buttonText() {
      if (this.$store.getters.getIsLoggedIn) {
        return "Become a patron for quiz access";
      }
      return "Login for quiz access";
    },
  },
  methods: {
    sandboxClick() {
      if (this.$store.getters.getIsLoggedIn) {
        this.$router.push({ name: "Pricing" });
        return;
      }
      this.$router.push({ name: "Login" });
      return;
    },
  },
};
</script>

<style scoped></style>
