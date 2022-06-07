<template>
  <div class="flex flex-row justify-start content-center ml-7">
    <BlockButton
      v-if="!didUserHint && isHintAvailable"
      :class="colors"
      :click="hintCallback"
    >
      <font-awesome-icon icon="eye" />
      {{ `View Hint` }}
    </BlockButton>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BlockButton from "@/components/BlockButton.vue";

export default {
  components: {
    FontAwesomeIcon,
    BlockButton,
  },
  props: {
    color: {
      type: String,
      required: false,
      default: "blue",
    },
    hintCallback: {
      type: Function,
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    didUserHint: {
      type: Boolean,
      required: false,
      default: false,
    },
    isHintAvailable: {
      type: Boolean,
      required: false,
      default: false,
    },
    colors: {
      type: String,
      required: false,
      default: "blue",
    },
  },
};
</script>

<style scoped></style>
