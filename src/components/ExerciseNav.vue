<template>
  <div class="flex flex-row justify-between bg-gray-300 text-gray-700">
    <div>
      <BlockButton
        :click="goBack"
        :disabled="!canGoBack"
        :color="canGoBack ? 'green' : 'gray'"
      >
        <FontAwesomeIcon
          icon="arrow-left"
        />
      </BlockButton>
      <BlockButton
        :disabled="!canGoForward"
        class="ml-3"
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
      class="flex items-center"
      :class="{'text-green-700': exerciseIsComplete}"
    >
      <FontAwesomeIcon
        v-if="exerciseIsComplete"
        class="mr-3"
        icon="check"
      />
      <FontAwesomeIcon
        v-else-if="locked"
        class="mr-3 text-red-600"
        icon="lock"
      />
      <span>
        {{ title }}
      </span>
    </div>

    <div class="flex flex-row flex-end">
      <Tooltip
        :text="`Leave Feedback`"
        position="bottom"
      >
        <BlockButton
          :click="clickComment"
          color="gray"
          class="mr-4"
        >
          <FontAwesomeIcon
            icon="comment"
          />
        </BlockButton>
      </Tooltip>
      <div :style="{'visibility': clickSolution ? 'visible' : 'hidden'}">
        <BlockButton
          :click="clickSolution"
          color="gray"
        >
          <FontAwesomeIcon
            class="mr-1"
            icon="eye"
          />
          <span> Cheat </span>
        </BlockButton>
      </div>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/Tooltip.vue';
import BlockButton from '@/components/BlockButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    BlockButton,
    FontAwesomeIcon,
    Tooltip
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
    },
    clickSolution:{
      type: Function,
      required: false,
      default: null
    },
    clickComment:{
      type: Function,
      required: false,
      default: null
    }
  },
  methods: {
    linkClick(url) {
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped>

</style>
