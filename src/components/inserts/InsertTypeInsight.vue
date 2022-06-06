<template>
  <div class="flex flex-col justify-start h-full overflow-auto">
    <div class="flex flex-col justify-center items-center flex-1 p-4">
      <Section
        title="Share your knowledge with other learners"
        subtitle="Check out the insights tab at the bottom of each assignment"
        class="max-w-2xl mb-4 w-full"
      >
        <div class="flex flex-col p-4">
          <h3 class="mb-4 text-xl text-blue-400">When writing insights, do:</h3>
          <ul class="list-disc mb-4">
            <li>
              Write comments that relate to the topic of the current exercise
            </li>
            <li>
              Add additional information that isn't required learning, but that
              you find interesting
            </li>
            <li>
              Share a personal experience or perspective about the concept
            </li>
          </ul>
          <h3 class="mb-4 text-xl text-blue-400">
            When writing insights, do not:
          </h3>
          <ul class="list-disc mb-4">
            <li>Do not report bugs or issues (use the issues tab instead)</li>
            <li>Do not give hints</li>
            <li>Do not ask for help (use the Discord community)</li>
          </ul>
          <div class="flex justify-center mb-4">
            <BlockButton :click="onClickDone">Got it</BlockButton>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>
<script>
import BlockButton from "@/components/BlockButton.vue";
import Section from "@/components/Section.vue";
import { markSeen, seenInsightInsertKey } from "@/lib/localStorageLib";
import { onMounted } from "@vue/runtime-core";

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
  setup(props) {
    onMounted(() => markSeen(seenInsightInsertKey));
    function onClickDone() {
      props.onDone();
    }
    return {
      onClickDone,
    };
  },
};
</script>

<style scoped></style>
