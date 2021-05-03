<template>
  <div class="btns">
    <Tooltip
      v-if="upgradeCallback"
      :text="`Get pro`"
      position="bottom"
    >
      <BlockButton
        class="btn"
        :click="upgradeCallback"
        color="gold"
      >
        <FontAwesomeIcon
          icon="level-up-alt"
        />
        Upgrade
      </BlockButton>
    </Tooltip>
    <Tooltip
      :text="`Run code`"
      position="bottom"
    >
      <BlockButton
        class="btn"
        :click="runCallback"
      >
        <FontAwesomeIcon
          icon="play"
        />
        Run
      </BlockButton>
    </Tooltip>
    <Tooltip
      v-if="saveCallback"
      :text="`Save code`"
      position="bottom"
    >
      <BlockButton
        class="btn"
        :click="saveCallback"
        color="gray"
      >
        <FontAwesomeIcon
          icon="save"
        />
      </BlockButton>
    </Tooltip>
    <Tooltip
      v-if="loadCallback"
      :text="`Load last save`"
      position="bottom"
    >
      <BlockButton
        class="btn"
        :click="loadCallback"
        color="gray"
      >
        <FontAwesomeIcon
          icon="backward"
        />
      </BlockButton>
    </Tooltip>
    <Tooltip
      :text="`Reset code`"
      position="bottom"
    >
      <BlockButton
        class="btn"
        :click="resetCallback"
        color="gray"
      >
        <FontAwesomeIcon
          icon="undo"
        />
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
      required: true
    },
    resetCallback: {
      type: Function,
      required: true
    },
    saveCallback: {
      type: Function,
      required: false,
      default: null
    },
    loadCallback: {
      type: Function,
      required: false,
      default: null
    },
    upgradeCallback: {
      type: Function,
      required: false,
      default: null
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .btn {
    margin: 0 1em 0 0;
  }
}
</style>
