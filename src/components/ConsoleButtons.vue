<template>
  <div class="btns">
    <Tooltip
      :text="`Run Code`"
      position="right"
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
      v-if="!$store.getters.getUserIsSubscribed"
      :text="`Check Answer`"
      position="right"
      class="bottom"
    >
      <BlockButton
        class="btn"
        :click="verifyCallback"
        color="gold"
      >
        <FontAwesomeIcon
          icon="check"
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
import BlockButton from '@/components/BlockButton';
import Tooltip from '@/components/Tooltip';

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
    verifyCallback: {
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
