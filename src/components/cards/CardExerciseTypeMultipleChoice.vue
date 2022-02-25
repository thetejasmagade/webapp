<template>
  <Multipane layout="horizontal" class="flex-1 overflow-y-auto">
    <MarkdownWithHint
      class="flex flex-col w-1/2 bg-white border-r border-gray-300"
      :markdown-source="markdownSource"
      :hint-markdown-source="hintMarkdownSource"
      :hint-callback="hintCallback"
      :is-hint-purchased="isHintPurchased"
      :hint-cost="hintCost"
    />
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
import MultipleChoice from "@/components/MultipleChoice.vue";
import Multipane from "@/components/Multipane.vue";
import MultipaneResizer from "@/components/MultipaneResizer.vue";
import MarkdownWithHint from "@/components/MarkdownWithHint.vue";

export default {
  components: {
    MarkdownWithHint,
    MultipleChoice,
    Multipane,
    MultipaneResizer,
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
      default: null,
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
};
</script>

<style scoped></style>
