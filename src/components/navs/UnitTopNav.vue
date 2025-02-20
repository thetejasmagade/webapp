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
      <BlockButton v-if="sandbox" class="ml-4" :click="showSandbox" color="red">
        You're in Sandbox Mode
      </BlockButton>
    </div>
    <div class="flex-1 flex justify-end mr-5">
      <HotKey :backLink="backLink" :forwardLink="forwardLink" />

      <BlockButton
        :link="backLink"
        :disabled="!canGoBack"
        :color="canGoBack ? 'blue' : 'gray'"
      >
        <Tooltip :text="gotoPreviousTooltip" position="bottom"
          ><FontAwesomeIcon icon="arrow-left"
        /></Tooltip>
      </BlockButton>

      <BlockButton
        :disabled="!canGoForward"
        class="ml-3"
        :link="forwardLink"
        :color="canGoForward ? 'blue' : 'gray'"
        :pulse="pulseNext"
      >
        <Tooltip :text="gotoForwardTooltip" position="bottom"
          ><FontAwesomeIcon icon="arrow-right"
        /></Tooltip>
      </BlockButton>
    </div>
  </div>
</template>

<script>
import { getOperatingSystem, MAC } from "@/lib/platform.js";
import BlockButton from "@/components/BlockButton.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SelectDropdown from "@/components/SelectDropdown.vue";
import SandboxModeModal from "@/components/modals/SandboxModeModal.vue";
import Tooltip from "@/components/Tooltip.vue";
import HotKey from "../HotKey.vue";

export default {
  components: {
    BlockButton,
    FontAwesomeIcon,
    SelectDropdown,
    SandboxModeModal,
    HotKey,
    Tooltip,
  },
  props: {
    pulseNext: {
      type: Boolean,
      required: false,
      default: false,
    },
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
    forwardLink: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    gotoPreviousTooltip() {
      const OS = getOperatingSystem();
      if (OS === MAC) {
        return "Cmd + A";
      } else return "Ctrl + A";
    },
    gotoForwardTooltip() {
      const OS = getOperatingSystem();
      if (OS === MAC) {
        return "Cmd + D";
      } else return "Ctrl + D";
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
    showSandbox() {
      this.$refs.sandboxModeModal?.show();
    },
  },
};
</script>

<style scoped></style>
