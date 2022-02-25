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
    <CodeEditor
      :key="isCheating"
      :model-value="modelValue"
      class="h-full flex flex-col flex-1 overflow-auto"
      :run-callback="runCallback"
      :reset-callback="resetCodeCallback"
      :cheat-callback="cheatCallback"
      :prog-lang="progLang"
      :canvas-enabled="true"
      :solution="solutionCode"
      :is-cheating="isCheating"
      :is-cheat-purchased="isCheatPurchased"
      :cheat-cost="cheatCost"
      @update:modelValue="(value) => $emit('update:modelValue', value)"
    />
  </Multipane>
</template>

<script>
import MarkdownWithHint from "@/components/MarkdownWithHint.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import Multipane from "@/components/Multipane.vue";
import MultipaneResizer from "@/components/MultipaneResizer.vue";

export default {
  components: {
    CodeEditor,
    Multipane,
    MultipaneResizer,
    MarkdownWithHint,
  },
  props: {
    markdownSource: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    progLang: {
      type: String,
      required: true,
    },
    solutionCode: {
      type: String,
      required: true,
    },
    runCallback: {
      type: Function,
      required: true,
    },
    resetCodeCallback: {
      type: Function,
      required: true,
    },
    cheatCallback: {
      type: Function,
      required: true,
    },
    hintCallback: {
      type: Function,
      required: false,
      default: null,
    },
    isCheating: {
      type: Boolean,
      required: true,
    },
    isCheatPurchased: {
      type: Boolean,
      required: true,
    },
    cheatCost: {
      type: Number,
      required: false,
      default: null,
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
    isHintPurchased: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  watch: {
    modelValue(newModelValue) {
      this.$emit("update:modelValue", newModelValue);
    },
  },
};
</script>

<style scoped></style>
