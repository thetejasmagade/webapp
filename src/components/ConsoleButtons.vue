<template>
  <div
    class="
      flex
      flex-row
      justify-start
      content-center
    "
  >
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
      v-if="$store.getters.getIsLoggedIn"
      :text="cheatTooltipText"
      position="bottom"
    >
      <BlockButton
        class="mr-3"
        :click="cheatCallback"
        :color="isCheating ? 'gold' : 'gray'"
        :disabled="notEnoughGemsToCheat"
      >
        <FontAwesomeIcon
          icon="eye"
        />
        {{ isCheatPurchased ? 'Cheat' : `Cheat for 💎${cheatCost}` }}
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
    cheatCallback: {
      type: Function,
      required: false,
      default: null
    },
    isCheating: {
      type: Boolean,
      required: false,
      default: false
    },
    isCheatPurchased: {
      type: Boolean,
      required: true
    },
    cheatCost: {
      type: Number,
      required: true
    }
  },
  computed: {
    cheatTooltipText(){
      if (this.notEnoughGemsToCheat){
        return 'You need more gems';
      } else if (!this.isCheatPurchased){
        return 'Buy Solution';
      }
      return 'Toggle Solution';
    },
    notEnoughGemsToCheat(){
      return (this.cheatCost > this.$store.getters.getBalance) &&
        !this.isCheatPurchased;
    }
  }
};
</script>

<style scoped>

</style>
