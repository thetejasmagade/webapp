<template>
  <div class="flex flex-row justify-start content-center">
    <Tooltip :text="getRunCodeTooltip" position="bottom">
      <BlockButton class="mr-3" :click="runCallback">
        <FontAwesomeIcon icon="play" />
        Run
      </BlockButton>
    </Tooltip>
    <Tooltip :text="`Reset code`" position="bottom">
      <BlockButton class="mr-3" :click="resetCallback" color="gray">
        <FontAwesomeIcon icon="undo" />
      </BlockButton>
    </Tooltip>
    <Tooltip
      v-if="$store.getters.getIsLoggedIn"
      :text="cheatTooltipText"
      position="bottom"
    >
      <BlockButton
        v-if="cheatCost != null"
        class="mr-3"
        :click="cheatCallback"
        :color="isCheating ? 'blue' : 'gray'"
        :disabled="notEnoughGemsToCheat"
      >
        <FontAwesomeIcon icon="eye" />
        {{ isCheatPurchased ? "Peek Solution" : `Peek Solution: 20 Gems` }}
      </BlockButton>
    </Tooltip>
  </div>
</template>

<script>
import { getOperatingSystem } from "@/lib/platform.js";
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
    runCallback: {
      type: Function,
      required: false,
      default: null,
    },
    resetCallback: {
      type: Function,
      required: true,
    },
    cheatCallback: {
      type: Function,
      required: false,
      default: null,
    },
    isCheating: {
      type: Boolean,
      required: false,
      default: false,
    },
    isCheatPurchased: {
      type: Boolean,
      required: false,
      default: null,
    },
    cheatCost: {
      type: Number,
      required: false,
      default: null,
    },
  },
  computed: {
    cheatTooltipText() {
      if (this.notEnoughGemsToCheat) {
        return "You need more gems";
      } else if (!this.isCheatPurchased) {
        return "Buy Solution";
      }
      return "Toggle Solution";
    },
    notEnoughGemsToCheat() {
      return (
        this.cheatCost > this.$store.getters.getBalance &&
        !this.isCheatPurchased
      );
    },
    getRunCodeTooltip() {
      const OS = getOperatingSystem();
      if (OS === "MAC") {
        return "Run Code Cmd + Enter";
      } else return "Run Code Ctrl + Enter";
    },
  },
};
</script>

<style scoped></style>
