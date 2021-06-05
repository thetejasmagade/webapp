<template>
  <textarea ref="textarea" />
</template>

<script>
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import '@/lib/codemirrorModeGo.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/haskell/haskell.js';
import '@/styles/codemirror-darcula.css';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/selection/active-line.js';
import CodeMirror from 'codemirror';
import { markRaw } from 'vue';

export default {
  props: {
    modelValue: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [ 'update:modelValue' ],
  data() {
    return {
      codemirror: null
    };
  },
  watch: {
    options: {
      deep: true,
      handler(options) {
        for (const key in options) {
          this.codemirror.setOption(key, options[key]);
        }
      }
    },
    modelValue: {
      handler(newModelValue){
        this.updateCode(newModelValue);
      }
    }
  },
  mounted() {
    this.codemirror = markRaw(CodeMirror.fromTextArea(this.$refs.textarea, this.options));
    this.codemirror.setSize(null, '100%');
    this.codemirror.setValue(this.modelValue);
    this.codemirror.on('change', cm => {
      this.$emit(
        'update:modelValue',
        cm.getValue()
      );
    });
    this.refresh();
  },
  methods: {
    refresh() {
      this.$nextTick(() => {
        this.codemirror.refresh();
      });
    },
    updateCode(newVal) {
      const currentVal = this.codemirror.getValue();
      if (newVal !== currentVal) {
        const scrollInfo = this.codemirror.getScrollInfo();
        this.codemirror.setValue(newVal);
        this.content = newVal;
        this.codemirror.scrollTo(scrollInfo.left, scrollInfo.top);
      }
    }
  }
};
</script>

<style>

</style>
