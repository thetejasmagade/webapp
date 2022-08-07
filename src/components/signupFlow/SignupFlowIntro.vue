<template>
  <Section
    title="How can I become a backend developer with Boot.dev?"
    subtitle="Answers to common questions and concerns"
    class="max-w-2xl w-full"
  >
    <div class="max-w-xl p-4">
      <ul class="list-disc mb-4">
        <li class="mb-2">
          Complete each course and project in order, from top to bottom
        </li>
        <li class="mb-2">
          Try not to skip any courses, it's good to review what you already know
        </li>
        <li class="mb-2">
          You will write code in JavaScript, Python, and Go. Becoming familiar
          with several programming languages is important for your career
        </li>
        <li class="mb-2">
          Your goal isn't to learn 3 programming languages, it's to learn the
          computer science concepts necessary for a backend job, and that's what
          our curriculum does
        </li>
      </ul>

      <div class="text-center">
        <BlockButton :click="onDone">Get Started Coding</BlockButton>
      </div>
    </div>
  </Section>
</template>

<script>
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";

export default {
  components: {
    Section,
    BlockButton,
  },
  props: {
    onDone: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const state = {};
    return state;
  },
};
</script>

<style scoped></style>
