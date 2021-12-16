<template>
  <Multipane
    layout="horizontal"
    class="flex-1 overflow-y-auto"
  >
    <div
      class="
        flex
        flex-col
        w-1/2
        bg-white
        border-r
        border-gray-300
      "
    >
      <MarkdownViewer
        ref="viewer"
        class="
          flex-1
          overflow-y-auto
        "
        :source="markdownSource"
      />
    </div>
    <MultipaneResizer layout="horizontal" />
    <MultipleChoice
      class="
        h-full
        flex
        flex-col
        flex-1
        overflow-auto
        bg-white
      "
      :callback="callback"
      :answers="answers"
      :question="question"
      :locked="locked"
    />
  </Multipane>
</template>

<script>
import MarkdownViewer from '@/components/MarkdownViewer.vue';
import MultipleChoice from '@/components/MultipleChoice.vue';
import Multipane from '@/components/Multipane.vue';
import MultipaneResizer from '@/components/MultipaneResizer.vue';

export default {
  components: {
    MarkdownViewer,
    MultipleChoice,
    Multipane,
    MultipaneResizer
  },
  props:{
    markdownSource:{
      type: String,
      required: true
    },
    answers:{
      type: Array,
      required: true
    },
    question:{
      type: Array,
      required: true
    },
    locked: {
      type: Boolean,
      required: true
    },
    callback: {
      type: Function,
      required: true
    }
  },
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
    }
  }
};
</script>

<style scoped>
</style>
