<template>
  <div class="h-full overflow-auto">
    <div class="h-full hidden lg:block">
      <Multipane layout="horizontal" class="h-full flex-1 overflow-y-auto">
        <div
          class="flex flex-col w-1/2 border-r border-gray-500 bg-gray-800 overflow-auto"
        >
          <MarkdownViewer :source="markdownSource" />
          <div class="border-b mx-4 mb-8"></div>
          <BottomOfMarkdownTabsNav
            v-if="isLoggedIn"
            class="mb-4"
            :tabs="
              isHintAvailable
                ? [
                    { icon: 'comment', name: 'Insights' },
                    {
                      icon: 'eye',
                      name: 'View Hint',
                    },
                    { icon: 'exclamation-triangle', name: 'Report Issue' },
                  ]
                : [
                    { icon: 'comment', name: 'Insights' },
                    { icon: 'exclamation-triangle', name: 'Report Issue' },
                  ]
            "
            :is-exercise-complete="isExerciseComplete"
            :hint-markdown-source="hintMarkdownSource"
            :hint-callback="hintCallback"
            :did-user-hint="didUserHint"
            :uuid="uuid"
            unit-type="exercise"
          />
        </div>
        <MultipaneResizer layout="horizontal" />
        <CodeEditor
          :key="isCheating"
          :model-value="modelValue"
          class="h-full flex flex-col flex-1 overflow-y-auto"
          :run-callback="runCallback"
          :reset-callback="resetCodeCallback"
          :cheat-callback="cheatCallback"
          :prog-lang="progLang"
          :canvas-enabled="true"
          :solution="solutionCode"
          :is-cheating="isCheating"
          :did-user-cheat="didUserCheat"
          @update:modelValue="(value) => $emit('update:modelValue', value)"
        />
      </Multipane>
    </div>
    <div class="h-full block lg:hidden overflow-auto">
      <MarkdownViewer :source="markdownSource" />
      <Section title="Come back on a computer">
        <p class="h-full p-4 overflow-auto">
          Coding is hard to do on a phone. I want you to have a great
          experience, so please hurry back on a larger device.
        </p>
      </Section>
    </div>
  </div>
</template>

<script>
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import Multipane from "@/components/Multipane.vue";
import MultipaneResizer from "@/components/MultipaneResizer.vue";
import Section from "@/components/Section.vue";
import BottomOfMarkdownTabsNav from "@/components/navs/BottomOfMarkdownTabsNav.vue";

export default {
  components: {
    CodeEditor,
    Multipane,
    Section,
    MultipaneResizer,
    MarkdownViewer,
    BottomOfMarkdownTabsNav,
  },
  props: {
    markdownSource: {
      type: String,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
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
    didUserCheat: {
      type: Boolean,
      required: true,
    },
    hintMarkdownSource: {
      type: String,
      required: false,
      default: null,
    },
    didUserHint: {
      type: Boolean,
      required: false,
      default: false,
    },
    uuid: {
      type: String,
      required: true,
    },
    isExerciseComplete: {
      type: Boolean,
      required: false,
      default: false,
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
