<template>
  <div
    ref="codemirror"
  />
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
    }
  },
  mounted() {
    this.codemirror = CodeMirror(
      this.$refs.codemirror,
      {
        ...this.options,
        value: this.modelValue
      }
    );
      
    this.codemirror.on('change', cm => {
      this.$emit(
        'update:modelValue',
        cm.getValue()
      );
    });
  }
};
</script>

<style>
.CodeMirror {
  height: 100%;
}
</style>
