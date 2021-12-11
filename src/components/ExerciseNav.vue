<template>
  <div
    class="
      flex 
      flex-row
      whitespace-nowrap
      bg-gray-200
      border-gray-400
    "
    :class="{
      'bg-green-200': isComplete,
      'bg-red-200': locked,
    }"
  >
    <div>
      <BlockButton
        :click="goBack"
        :disabled="!canGoBack"
        :color="canGoBack ? 'blue' : 'gray'"
      >
        <FontAwesomeIcon
          icon="arrow-left"
        />
      </BlockButton>
      <BlockButton
        :disabled="!canGoForward"
        class="ml-3"
        :click="goForward"
        :color="canGoForward ? 'blue' : 'gray'"
      >
        <FontAwesomeIcon
          icon="arrow-right"
        />
      </BlockButton>
    </div>

    <div
      class="px-10 flex-1 flex items-center justify-center"
    >
      <SelectDropdown
        v-if="
          dropdownOneNames && 
            dropdownOneIndex !== null
        "
        :options="dropdownOneNames"
        :default="dropdownOneNames[dropdownOneIndex]"
        @update:modelValue="itemName => { selectItem(itemName, dropdownOneItems) }"
      />
      <SelectDropdown
        v-if="
          dropdownTwoNames &&
            dropdownTwoIndex !== null
        "
        class="ml-3"
        :options="dropdownTwoNames"
        :default="dropdownTwoNames[dropdownTwoIndex]"
        @update:modelValue="itemName => { selectItem(itemName, dropdownTwoItems) }"
      />
    </div>

    <div class="flex flex-row flex-end">
      <Tooltip
        :text="`Feedback`"
        position="left"
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
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/Tooltip.vue';
import BlockButton from '@/components/BlockButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import SelectDropdown from '@/components/SelectDropdown.vue';


export default {
  components: {
    BlockButton,
    FontAwesomeIcon,
    Tooltip,
    SelectDropdown
  },
  props: {
    dropdownOneItems: {
      type: Array,
      required: false,
      default: null
    },
    dropdownTwoItems: {
      type: Array,
      required: false,
      default: null
    },
    dropdownOneIndex: {
      type: Number,
      required: false,
      default: null
    },
    dropdownTwoIndex: {
      type: Number,
      required: false,
      default: null
    },
    locked: {
      type: Boolean,
      required: false,
      default: false
    },
    isComplete: {
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
    clickComment:{
      type: Function,
      required: false,
      default: null
    }
  },
  computed: {
    dropdownOneNames() {
      if (!this.dropdownOneItems){
        return null;
      }
      return this.dropdownOneItems.map(
        item => item.name
      );
    },
    dropdownTwoNames() {
      if (!this.dropdownTwoItems){
        return null;
      }
      return this.dropdownTwoItems.map(
        item => item.name
      );
    }
  },
  methods: {
    selectItem(itemName, dropdownItems){
      for (const dropdownItem of dropdownItems){
        if (itemName === dropdownItem.name){
          this.$router.push(dropdownItem.link);
        }
      }
    }
  }
};
</script>

<style scoped>

</style>
