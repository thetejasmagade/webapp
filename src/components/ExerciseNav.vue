<template>
  <div class="navigation">
    <div>
      <BlockButton
        :click="goBack"
        color="green"
        :disabled="!canGoBack"
        class="margin-bottom-mobile"
      >
        <FontAwesomeIcon
          icon="arrow-left"
        />
      </BlockButton>
      <BlockButton
        :disabled="!canGoForward"
        class="margin-left-desktop"
        :click="goForward"
        color="green"
      >
        <FontAwesomeIcon
          icon="arrow-right"
        />
      </BlockButton>
    </div>

    <BlockButton
      class="btn"
      :click="() => {linkClick('https://discord.gg/k4rVEWt')}"
    >
      <FontAwesomeIcon
        :icon="['fab', 'discord']"
      />
      <span class="margin-left-small-desktop"> Help </span>
    </BlockButton>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    BlockButton,
    FontAwesomeIcon
  },
  props: { 
    goBack:{
      type: Function,
      required: true
    },
    goForward:{
      type: Function,
      required: true
    },
    canGoBack:{
      type: Boolean,
      required: false,
      default: true
    },
    canGoForward:{
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    linkClick(url) {
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.navigation{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;

  .margin-left-desktop {
    @media (min-width: $mobile-size) {
      margin-left: 1em;
    }
  }

  .margin-bottom-mobile {
    @media (max-width: $mobile-size) {
      margin-bottom: 1em;
    }
  }

  .margin-left-small-desktop {
    @media (min-width: $mobile-size) {
      margin-left: 4px;
    }
  }
}
</style>
