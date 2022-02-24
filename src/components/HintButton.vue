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
    colors() {
      return {
        "text-white": this.color !== "white",

        "bg-gray-500": this.color === "gray",
        "hover:bg-gray-700": this.color === "gray",
        "disabled:bg-gray-500": this.color === "gray",

        "bg-gray-400": this.color === "gray-light",
        "hover:bg-gray-300": this.color === "gray-light",
        "disabled:bg-gray-300": this.color === "gray-light",

        "bg-green-700": this.color === "green",
        "hover:bg-green-800": this.color === "green",
        "disabled:bg-green-600": this.color === "green",

        "bg-blue-500": this.color === "blue",
        "hover:bg-blue-600": this.color === "blue",
        "disabled:bg-blue-400": this.color === "blue",

        "bg-blue-400": this.color === "blue-light",
        "hover:bg-blue-300": this.color === "blue-light",
        "disabled:bg-blue-300": this.color === "blue-light",

        "bg-gold-500": this.color === "gold",
        "hover:bg-gold-600": this.color === "gold",
        "disabled:bg-gold-400": this.color === "gold",

        "bg-red-500": this.color === "red",
        "hover:bg-red-600": this.color === "red",
        "disabled:bg-red-400": this.color === "red",

        "text-blue-600": this.color === "white",
        "bg-white": this.color === "white",
        "hover:bg-gray-200": this.color === "white",
        "disabled:bg-gray-200": this.color === "white",
      };
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
