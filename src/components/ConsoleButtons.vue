<template>
  <div class="flex flex-row justify-start content-center">
    <Tooltip
      v-if="upgradeCallback"
      :text="`Get pro`"
      position="bottom"
    >
      <BlockButton
        class="mr-3"
        :click="upgradeCallback"
        color="gold"
      >
        <FontAwesomeIcon
          icon="level-up-alt"
        />
        Go Pro
      </BlockButton>
    </Tooltip>

    <Tooltip
      :text="`Run code`"
      position="bottom"
    >
      <BlockButton
        class="mr-3"
        :click="runCallback"
        :disabled="!runCallback"
      >
        <FontAwesomeIcon
          icon="play"
        />
        Run
      </BlockButton>
    </Tooltip>
    <Tooltip
      :text="`Reset code`"
      position="bottom"
    >
      <BlockButton
        class="mr-3"
        :click="resetCallback"
        color="gray"
      >
        <FontAwesomeIcon
          icon="undo"
        />
      </BlockButton>
    </Tooltip>
    <Tooltip
      v-if="cheatCallback"
      :text="`Toggle Solution`"
      position="bottom"
    >
      <BlockButton
        class="mr-3"
        :click="cheatCallback"
        :color="isCheating ? 'gold' : 'gray'"
      >
        <FontAwesomeIcon
          icon="eye"
        />
        Cheat
      </BlockButton>
    </Tooltip>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import BlockButton from '@/components/BlockButton.vue';
import Tooltip from '@/components/Tooltip.vue';

export default {
  components: {
    FontAwesomeIcon,
    BlockButton,
    Tooltip
  },
  props: {
    runCallback: {
      type: Function,
      required: false,
      default: null
    },
    resetCallback: {
      type: Function,
      required: true
    },
    upgradeCallback: {
      type: Function,
      required: false,
      default: null
    },
    cheatCallback: {
      type: Function,
      required: false,
      default: null
    },
    isCheating: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style scoped>

</style>
