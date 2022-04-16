<template>
  <div class="h-full overflow-auto">
    <div class="h-full hidden lg:block">
      <Multipane layout="horizontal" class="h-full flex-1 overflow-y-auto">
        <div
          class="flex flex-col w-1/2 border-r border-gray-500 bg-gray-800 overflow-auto"
        >
          <MarkdownViewer :source="markdownSource" />
          <BottomOfMarkdownTabsNav
            v-if="isLoggedIn"
            class="mb-2"
            :tabs="
              isHintAvailable
                ? [
                    { icon: 'comment', name: 'Report Issue' },
                    {
                      icon: 'eye',
                      name: `${isHintPurchased ? 'View' : 'Buy'} Hint`,
                    },
                  ]
                : [{ icon: 'comment', name: 'Report Issue' }]
            "
            :hint-markdown-source="hintMarkdownSource"
            :hint-callback="hintCallback"
            :is-hint-purchased="isHintPurchased"
            :hint-cost="hintCost"
            :uuid="uuid"
            unit-type="exercise"
          />
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
    </div>
    <div class="h-full block lg:hidden">
      <MarkdownViewer :source="markdownSource" />
      <Section title="Come back on a computer">
        <p class="p-4">
          Coding is hard to do on a phone. I want you to have a great
          experience, so please hurry back on a larger device.
        </p>
      </Section>
    </div>
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor.vue";
import Multipane from "@/components/Multipane.vue";
import MultipaneResizer from "@/components/MultipaneResizer.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import Section from "@/components/Section.vue";
import BottomOfMarkdownTabsNav from "@/components/BottomOfMarkdownTabsNav.vue";

export default {
  components: {
    CodeEditor,
    Multipane,
    MultipaneResizer,
    MarkdownViewer,
    Section,
    BottomOfMarkdownTabsNav,
  },
  props: {
    uuid: {
      type: String,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
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
};
</script>

<style scoped></style>
