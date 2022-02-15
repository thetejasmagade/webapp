<template>
  <div>
    <VueLoadingOverlay
      :active="isLoading"
      :is-full-page="false"
      :can-cancel="false"
      :enforce-focus="true"
      :opacity="0.8"
      :loader="'bars'"
    >
      <template v-if="cancel" #before>
        <div>
          <h2 v-if="displayText" class="text-2xl text-gold-600">
            {{ displayText }}
          </h2>
        </div>
      </template>
      <template v-if="cancel" #after>
        <BlockButton :click="cancel" color="gray"> Cancel </BlockButton>
      </template>
    </VueLoadingOverlay>
  </div>
</template>

<script>
import BlockButton from "@/components/BlockButton.vue";
import VueLoadingOverlay from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  components: {
    VueLoadingOverlay,
    BlockButton,
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    cancel: {
      type: Function,
      required: false,
      default: null,
    },
    displayText: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>

<style>
.vld-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
