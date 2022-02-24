<template>
  <div class="flex flex-row justify-start content-center ml-7">
    <Tooltip :text="hintTooltipText" position="bottom">
      <BlockButton
        v-if="!isHintPurchased && isHintAvailable"
        :class="colors"
        :click="hintCallback"
        :disabled="notEnoughGemsToHint"
      >
        <font-awesome-icon icon="eye" />
        {{ `Purchase Hint for ${hintCost} gems` }}
      </BlockButton>
    </Tooltip>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BlockButton from "@/components/BlockButton.vue";
import Tooltip from "@/components/Tooltip.vue";

export default {
  components: {
    FontAwesomeIcon,
    BlockButton,
    Tooltip,
  },
  props: {
    hintCost: {
      type: Number,
      required: false,
      default: null,
    },
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
    isHintPurchased: {
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
  computed: {
    hintTooltipText() {
      if (this.notEnoughGemsToHint) {
        return "You need more gems";
      } else if (!this.isHintPurchased) {
        return "Buy Hint";
      }
      return "Hint Purchased";
    },
    notEnoughGemsToHint() {
      return (
        this.hintCost > this.$store.getters.getBalance && !this.isHintPurchased
      );
    },
  },
};
</script>

<style scoped></style>
