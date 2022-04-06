<template>
  <div class="flex flex-row whitespace-nowrap bg-gray-650 border-gray-400">
    <SandboxModeModal ref="sandboxModeModal" class="whitespace-normal" />
    <div class="flex-1 flex items-center justify-start">
      <SelectDropdown
        v-if="dropdownOneItems && dropdownOneIndex !== null"
        class="hidden lg:block ml-3"
        :options="dropdownOneItems"
        :default="dropdownOneItems[dropdownOneIndex]"
        @update:modelValue="
          (item) => {
            selectItem(item, dropdownOneItems);
          }
        "
      />
      <SelectDropdown
        v-if="dropdownTwoItems && dropdownTwoIndex !== null"
        class="hidden lg:block ml-3"
        :options="dropdownTwoItems"
        :default="dropdownTwoItems[dropdownTwoIndex]"
        @update:modelValue="
          (item) => {
            selectItem(item, dropdownTwoItems);
          }
        "
      />
      <span
        v-if="sandbox"
        class="ml-4 text-red-500 underline cursor-pointer"
        @click="$refs.sandboxModeModal.show"
      >
        Sandbox Mode ⓘ
      </span>
    </div>
    <div class="flex-1 flex justify-end">
      <BlockButton
        :link="backLink"
        :disabled="!canGoBack"
        :color="canGoBack ? 'blue' : 'gray'"
      >
        <FontAwesomeIcon icon="arrow-left" />
      </BlockButton>

      <BlockButton
        :disabled="!canGoForward"
        class="ml-3"
        :link="forwardLink"
        :click="forwardClick"
        :color="canGoForward ? 'blue' : 'gray'"
      >
        <FontAwesomeIcon icon="arrow-right" />
      </BlockButton>
    </div>
    <div class="flex mr-6 flex-row items-center flex-end">
      <Tooltip
        v-if="$store.getters.getIsLoggedIn"
        :text="`Feedback`"
        position="left"
      >
        <BlockButton :click="clickComment" color="gray" class="ml-4">
          <FontAwesomeIcon icon="comment" />
        </BlockButton>
      </Tooltip>
    </div>
  </div>
</template>

<script>
import Tooltip from "@/components/Tooltip.vue";
import BlockButton from "@/components/BlockButton.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SelectDropdown from "@/components/SelectDropdown.vue";
import SandboxModeModal from "@/components/SandboxModeModal.vue";

export default {
  components: {
    BlockButton,
    FontAwesomeIcon,
    Tooltip,
    SelectDropdown,
    SandboxModeModal,
  },
  props: {
    dropdownOneItems: {
      type: Array,
      required: false,
      default: null,
    },
    dropdownTwoItems: {
      type: Array,
      required: false,
      default: null,
    },
    dropdownOneIndex: {
      type: Number,
      required: false,
      default: null,
    },
    dropdownTwoIndex: {
      type: Number,
      required: false,
      default: null,
    },
    sandbox: {
      type: Boolean,
      required: false,
      default: false,
    },
    canGoBack: {
      type: Boolean,
      required: false,
      default: true,
    },
    canGoForward: {
      type: Boolean,
      required: false,
      default: true,
    },
    clickComment: {
      type: Function,
      required: false,
      default: null,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
    backLink: {
      type: Object,
      required: false,
      default: null,
    },
    forwardClick: {
      type: Function,
      required: false,
      default: null,
    },
    forwardLink: {
      type: Object,
      required: false,
      default: null,
    },
  },
  methods: {
    selectItem(item, dropdownItems) {
      for (const dropdownItem of dropdownItems) {
        if (item.name === dropdownItem.name) {
          this.$router.push(dropdownItem.link);
        }
      }
    },
  },
};
</script>

<style scoped></style>
