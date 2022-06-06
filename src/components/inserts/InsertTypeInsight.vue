<template>
  <div class="flex flex-col justify-start h-full overflow-auto">
    <div class="flex flex-col justify-center items-center flex-1 p-4">
      <Section
        title="Share your knowledge with other learners."
        subtitle="Add additional information to any assignment."
        class="max-w-2xl mb-4 w-full"
      >
        <div class="flex flex-col p-4">
          <p class="mb-4">
            Have something you could add to what is being taught?
            <b>submit an insight!</b>
          </p>
          <p class="mb-4">
            Insights are a place for students to share additional knowledge with
            other students about the current topic being taught in the course.
          </p>
          <p class="mb-4">
            <b>Inisghts are not a place to submit bugs or general comments.</b>
          </p>
          <p class="mb-4">
            Keep the courses focused on learning! Comments, and thoughts, can be
            shared on our
            <a
              class="text-blue-400 underline hover:text-blue-300"
              href="https://discord.gg/RGEqstYgVC"
              target="_blank"
            >
              community discord server
            </a>
          </p>
          <p class="mb-4">
            Bugs, typos, or other course issues can be sumbitted within the
            <b>Report Issue</b> tab.
          </p>
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
