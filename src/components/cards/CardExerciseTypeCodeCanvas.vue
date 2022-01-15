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
    <CodeEditor
      :key="isCheating"
      v-model="modelValue"
      class="
        h-full
        flex
        flex-col
        flex-1
        overflow-auto
      "
      :run-callback="runCallback"
      :reset-callback="resetCodeCallback"
      :cheat-callback="cheatCallback"
      :prog-lang="progLang"
      :canvas-enabled="true"
      :solution="solutionCode"
      :is-cheating="isCheating"
    />
  </Multipane>
</template>

<script>
import MarkdownViewer from '@/components/MarkdownViewer.vue';
import CodeEditor from '@/components/CodeEditor.vue';
import Multipane from '@/components/Multipane.vue';
import MultipaneResizer from '@/components/MultipaneResizer.vue';

export default {
  components: {
    MarkdownViewer,
    CodeEditor,
    Multipane,
    MultipaneResizer
  },
  emits: [ 'update:modelValue' ],
  props:{
    markdownSource: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    },
    progLang: {
      type: String,
      required: true
    },
    solutionCode: {
      type: String,
      required: true
    },
    runCallback: {
      type: Function,
      required: true
    },
    resetCodeCallback: {
      type: Function,
      required: true
    },
    cheatCallback: {
      type: Function,
      required: true
    },
    isCheating: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    modelValue(newModelValue){
      this.$emit('update:modelValue', newModelValue);
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
