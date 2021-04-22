<template>
  <div class="navigation">
    <div>
      <BlockButton
        :click="goBack"
        :disabled="!canGoBack"
        class="margin-bottom-mobile"
        :color="canGoBack ? 'green' : 'gray'"
      >
        <FontAwesomeIcon
          icon="arrow-left"
        />
      </BlockButton>
      <BlockButton
        :disabled="!canGoForward"
        class="margin-left-desktop"
        :click="goForward"
        :color="canGoForward ? 'green' : 'gray'"
      >
        <FontAwesomeIcon
          icon="arrow-right"
        />
      </BlockButton>
    </div>

    <div
      v-if="title"
      class="title"
      :class="{'complete': exerciseIsComplete}"
    >
      <FontAwesomeIcon
        v-if="exerciseIsComplete"
        class="icon"
        icon="check"
      />
      <FontAwesomeIcon
        v-else-if="locked"
        class="icon pink"
        icon="lock"
      />
      <span>
        {{ title }}
      </span>
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
import BlockButton from '@/components/BlockButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    BlockButton,
    FontAwesomeIcon
  },
  props: {
    title: {
      type: String,
      required: false,
      default: null
    },
    locked: {
      type: Boolean,
      required: false,
      default: false
    },
    exerciseIsComplete: {
      type: Boolean,
      required: false,
      default: false
    },
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
  background-color: $gray-lighter;
  color: $gray-darker;

  .icon {
    margin-right: 5px;

    &.pink {
      color: $pink-dark;
    }
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: center;

    &.complete {
      color: $green-dark;
    }

    @media (max-width: $mobile-size) {
      display: none;
    }
  }

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
