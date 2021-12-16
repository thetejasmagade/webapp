<template>
  <div
    class="
        overflow-y-auto
        w-full
        flex
        flex-col
        items-center
      "
  >
    <div
      class="max-w-4xl"
    >
      <MarkdownViewer
        ref="viewer"
        :source="markdownSource"
      />
    </div>
  </div>
</template>

<script>
import MarkdownViewer from '@/components/MarkdownViewer.vue';

export default {
  components: {
    MarkdownViewer
  },
  emits: [ 'update:modelValue' ],
  props:{
    markdownSource: {
      type: String,
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
