<template>
  <Section
    title="How do I learn enough to succeed as a developer?"
    subtitle="We are developers passionate about coding education. Here are some of our beliefs about how you should learn to code."
    class="max-w-2xl w-full"
  >
    <div class="max-w-xl p-4">
      <ul class="list-disc mb-4">
        <li>You can't learn to code if you aren't writing code.</li>
        <li>
          Mastering computer science fundamentals is the best way to
          differentiate yourself in the job market.
        </li>
        <li>
          Your time is best spent learning modern programming languages and
          practices.
        </li>
        <li>
          A mix of guided courses and projects that put them into practice is
          best.
        </li>
        <li>
          It's not hard to find coding courses online, but it's hard to find
          good ones.
        </li>
        <li>Traditional boot camps are too fast, CS degrees are too slow.</li>
        <li>
          Understanding and retaining information is important, grades are not.
        </li>
        <li>
          Your coding skills don't matter if you don't know how to show them off
          to a potential employer.
        </li>
      </ul>

      <p class="mb-4 text-center">
        You can read more about our
        <a
          class="text-blue-400 underline hover:text-blue-300"
          href="https://blog.boot.dev/about"
          target="_blank"
          >method here</a
        >
      </p>

      <div class="text-center">
        <BlockButton :click="onDone"> Get Started </BlockButton>
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
