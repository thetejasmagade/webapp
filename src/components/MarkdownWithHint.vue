<template>
  <div>
    <div class="flex-1 overflow-y-auto">
      <MarkdownViewer :source="markdownSource" />
    </div>
  </div>
</template>

<script>
import MarkdownViewer from "@/components/MarkdownViewer.vue";

export default {
  components: {
    MarkdownViewer,
  },
  props: {
    markdownSource: {
      type: String,
      required: true,
    },
    hintMarkdownSource: {
      type: String,
      required: false,
      default: null,
    },
    hintCallback: {
      type: Function,
      required: false,
      default: null,
    },
    isHintPurchased: {
      type: Boolean,
      required: false,
      default: false,
    },
    hintCost: {
      type: Number,
      required: false,
      default: null,
    },
  },
  computed: {
    isHintAvailable() {
      if (!this.hintMarkdownSource) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped></style>
