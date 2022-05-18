<template>
  <div class="flex flex-col justify-start h-full overflow-auto">
    <div class="flex flex-col justify-center items-center flex-1 p-4">
      <Section
        title="Losing your motivation is the worst thing that can happen"
        subtitle="Invite a friend to do your course with you!"
        class="max-w-2xl mb-4 w-full"
      >
        <div class="flex flex-col p-4">
          <p class="mb-4">
            If you're enjoying the course so far, <b>invite a friend</b> to work
            on it with you!
          </p>
          <p class="mb-4">
            The #1 problem you'll have as an online learner is a lack of
            accountability. We don't have exams, deadlines, or even huge
            tuitions that would serve as external motivators at a traditional
            school.
          </p>
          <p class="mb-4">
            <b
              >The best thing you can do is find a group of friends to work
              with.</b
            >
            You can hold each other accountable, and give each other help if you
            get stuck. If you don't know anyone personally, drop a message in
            our Discord server and find someone there!
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
import { markSeen, seenFriendsInsertKey } from "@/lib/localStorageLib";

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
  async mounted() {
    markSeen(seenFriendsInsertKey);
  },
  methods: {
    onClickDone() {
      this.onDone();
    },
  },
};
</script>

<style scoped></style>
