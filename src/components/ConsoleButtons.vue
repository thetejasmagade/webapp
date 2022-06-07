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
      :text="`View Solution Code`"
      position="bottom"
    >
      <BlockButton
        class="mr-3"
        :click="cheatCallback"
        :color="isCheating ? 'blue' : 'gray'"
      >
        <FontAwesomeIcon icon="eye" />
        {{ "Peek Solution" }}
      </BlockButton>
    </Tooltip>
  </div>
</template>

<script>
import { getOperatingSystem, MAC } from "@/lib/platform.js";
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
  },
  computed: {
    getRunCodeTooltip() {
      const OS = getOperatingSystem();
      if (OS === MAC) {
        return "Run Code Cmd + Enter";
      } else return "Run Code Ctrl + Enter";
    },
  },
};
</script>

<style scoped></style>
