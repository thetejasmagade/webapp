<template>
  <div class="flex flex-col justify-start h-full overflow-auto">
    <div class="flex flex-col justify-center items-center flex-1 p-4">
      <Section
        title="Help us improve Boot.dev"
        subtitle="What should we build next?"
        class="max-w-2xl mb-4 w-full"
      >
        <div class="flex flex-col p-4">
          <p class="mb-4">
            If you have a second, we'd love to hear your feedback so we can make
            Boot.dev better. Fill out
            <a
              href="https://forms.gle/fC5Tm62aBGenC3MG7"
              target="_blank"
              class="text-blue-400 hover:text-blue-300 underline"
              >this survey</a
            >, it will only take 5 minutes!'
          </p>

          <div class="flex justify-center mb-4">
            <BlockButton :click="onClickDone">Done</BlockButton>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>
<script>
import BlockButton from "@/components/BlockButton.vue";
import Section from "@/components/Section.vue";
import { markSeen, seenSurveyInsertKey } from "@/lib/localStorageLib";
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
    onMounted(() => {
      markSeen(seenSurveyInsertKey);
    });

    const onClickDone = () => {
      props.onDone();
    };

    return {
      onClickDone,
    };
  },
};
</script>

<style scoped></style>
