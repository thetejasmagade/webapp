<template>
  <div class="btns">
    <Tooltip
      v-if="upgradeCallback"
      :text="`Upgrade to pro`"
      position="right"
    >
      <BlockButton
        class="btn"
        :click="upgradeCallback"
        color="gold"
      >
        <FontAwesomeIcon
          icon="level-up-alt"
        />
      </BlockButton>
    </Tooltip>
    <Tooltip
      :text="`Run Code`"
      position="right"
      class="bottom"
    >
      <BlockButton
        class="btn"
        :click="runCallback"
      >
        <FontAwesomeIcon
          icon="play"
        />
      </BlockButton>
    </Tooltip>
    <Tooltip
      v-if="saveCallback"
      :text="`Save Code`"
      position="right"
      class="bottom"
    >
      <BlockButton
        class="btn"
        :click="saveCallback"
        color="green"
      >
        <FontAwesomeIcon
          icon="save"
        />
      </BlockButton>
    </Tooltip>
    <Tooltip
      v-if="loadCallback"
      :text="`Load Last Save`"
      position="right"
      class="bottom"
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
      :text="`Reset Exercise`"
      position="right"
      class="bottom"
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
  flex-direction: column;

  .btn {
    font-size: 1em;
    width: 100%;
  }

  .bottom {
    margin: 1em 0 0 0;
  }
}
</style>
