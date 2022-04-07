<template>
  <div class="h-full overflow-auto bg-gray-750">
    <div class="h-full hidden lg:block">
      <Multipane layout="horizontal" class="h-full flex-1 overflow-y-auto">
        <MarkdownWithHint
          class="flex flex-col w-1/2 border-r border-gray-500"
          :markdown-source="markdownSource"
          :hint-markdown-source="hintMarkdownSource"
          :hint-callback="hintCallback"
          :is-hint-purchased="isHintPurchased"
          :hint-cost="hintCost"
        />
        <MultipaneResizer layout="horizontal" />
        <MultipleChoice
          class="h-full flex flex-col flex-1 overflow-auto"
          :callback="callback"
          :answers="answers"
          :question="question"
          :sandbox="sandbox"
        />
      </Multipane>
    </div>
    <div class="block lg:hidden">
      <MarkdownWithHint
        :markdown-source="markdownSource"
        :hint-markdown-source="hintMarkdownSource"
        :hint-callback="hintCallback"
        :is-hint-purchased="isHintPurchased"
        :hint-cost="hintCost"
      />
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
import MultipleChoice from "@/components/MultipleChoice.vue";
import Multipane from "@/components/Multipane.vue";
import MultipaneResizer from "@/components/MultipaneResizer.vue";
import MarkdownWithHint from "@/components/MarkdownWithHint.vue";
import Section from "@/components/Section.vue";

export default {
  components: {
    MarkdownWithHint,
    Section,
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
