<template>
  <Multipane layout="horizontal" class="flex-1 overflow-y-auto">
    <div class="flex flex-col w-1/2 bg-white border-r border-gray-300">
      <div>
        <MarkdownViewer
          ref="viewer"
          class="flex-1 overflow-y-auto"
          :source="markdownSource"
        />
        <HintButton
          v-if="!isHintPurchased && isHintAvailable"
          class="mr-3"
          :hint-cost="hintCost"
          :hint-callback="hintCallback"
          :is-hint-available="isHintAvailable"
        />
        <MarkdownViewer
          v-if="isHintAvailable & isHintPurchased"
          ref="viewer"
          class="flex-1 overflow-y-auto"
          :source="hintMarkdownSource"
        />
      </div>
    </div>
    <MultipaneResizer layout="horizontal" />
    <MultipleChoice
      class="h-full flex flex-col flex-1 overflow-auto bg-white"
      :callback="callback"
      :answers="answers"
      :question="question"
      :sandbox="sandbox"
    />
  </Multipane>
</template>

<script>
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import MultipleChoice from "@/components/MultipleChoice.vue";
import Multipane from "@/components/Multipane.vue";
import MultipaneResizer from "@/components/MultipaneResizer.vue";
import HintButton from "@/components/BlockButton.vue";

export default {
  components: {
    MarkdownViewer,
    MultipleChoice,
    Multipane,
    MultipaneResizer,
    HintButton,
  },
  props: {
    markdownSource: {
      type: String,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    sandbox: {
      type: Boolean,
      required: true,
    },
    callback: {
      type: Function,
      required: true,
    },
    hintMarkdownSource: {
      type: String,
      required: false,
      default: "",
    },
    hintCost: {
      type: Number,
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
  },
  computed: {
    isHintAvailable() {
      if (this.hintMarkdownSource === "") {
        return false;
      }

      return true;
    },
  },
  async mounted() {
    this.scrollMarkdownToTop();
  },
  methods: {
    scrollMarkdownToTop() {
      requestAnimationFrame(() => {
        if (this.$refs.viewer && this.$refs.viewer.$el) {
          this.$refs.viewer.$el.scrollTop = 0;
        }
      });
    },
  },
};
</script>

<style scoped></style>
