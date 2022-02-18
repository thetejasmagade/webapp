<template>
  <div class="overflow-y-auto w-full flex flex-col items-center">
    <div class="max-w-4xl">
      <div class="mt-4 w-full flex flex-row justify-end">
        <BlockButton
          v-if="$store.getters.getIsLoggedIn"
          class="btn mr-3"
          :click="doneWithExercise"
        >
          I'm done with this exercise
        </BlockButton>
      </div>
      <MarkdownViewer ref="viewer" :source="markdownSource" />
    </div>
  </div>
</template>

<script>
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import BlockButton from "@/components/BlockButton.vue";

export default {
  components: {
    MarkdownViewer,
    BlockButton,
  },
  props: {
    markdownSource: {
      type: String,
      required: true,
    },
    doneWithExercise: {
      type: Function,
      required: true,
    },
  },
  emits: ["update:modelValue"],
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
