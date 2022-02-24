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
    <CodeEditor
      :key="isCheating"
      :model-value="modelValue"
      class="h-full flex flex-col flex-1 overflow-auto"
      :run-callback="runCallback"
      :reset-callback="resetCodeCallback"
      :cheat-callback="cheatCallback"
      :prog-lang="progLang"
      :canvas-enabled="false"
      :solution="solutionCode"
      :is-cheating="isCheating"
      :is-cheat-purchased="isCheatPurchased"
      :cheat-cost="cheatCost"
      @update:modelValue="(value) => $emit('update:modelValue', value)"
    />
  </Multipane>
</template>

<script>
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import Multipane from "@/components/Multipane.vue";
import MultipaneResizer from "@/components/MultipaneResizer.vue";
import HintButton from "@/components/HintButton.vue";

export default {
  components: {
    MarkdownViewer,
    CodeEditor,
    Multipane,
    MultipaneResizer,
    HintButton,
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
    isHintPurchased: {
      type: Boolean,
      required: false,
      default: false,
    },
    cheatCost: {
      type: Number,
      required: false,
      default: null,
    },
    hintCost: {
      type: Number,
      required: false,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    isHintAvailable() {
      if (!this.hintMarkdownSource) {
        return false;
      }
      return true;
    },
  },
  watch: {
    modelValue(newModelValue) {
      this.$emit("update:modelValue", newModelValue);
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
