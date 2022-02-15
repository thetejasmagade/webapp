<template>
  <div ref="codemirror" />
</template>

<script>
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "@/lib/codemirrorModeGo.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/haskell/haskell.js";
import "@/styles/codemirror-darcula.css";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
import DiffMatchPatch from "diff-match-patch";
window.diff_match_patch = DiffMatchPatch;
window.DIFF_DELETE = DiffMatchPatch.DIFF_DELETE;
window.DIFF_INSERT = DiffMatchPatch.DIFF_INSERT;
window.DIFF_EQUAL = DiffMatchPatch.DIFF_EQUAL;
import "codemirror/addon/merge/merge.js";
import "codemirror/addon/selection/active-line.js";
import CodeMirror from "codemirror";
import { markRaw } from "vue";

export default {
  props: {
    code: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      codemirror: null,
    };
  },
  watch: {
    options: {
      deep: true,
      handler(options) {
        this.init();
        for (const key in options) {
          this.codemirror.setOption(key, options[key]);
        }
      },
    },
    solution: {
      handler() {
        this.init();
      },
    },
    code: {
      handler() {
        this.init();
      },
    },
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    this.codemirror = null;
  },
  methods: {
    init() {
      let opts = this.options;
      opts.value = this.code;
      opts.origRight = this.solution;
      this.codemirror = markRaw(
        CodeMirror.MergeView(this.$refs.codemirror, opts)
      );
    },
  },
};
</script>

<style>
span.token.operator {
  background: inherit !important;
}

.CodeMirror {
  height: 100% !important;
}

.CodeMirror-merge {
  height: 100%;
}

.CodeMirror-merge-pane {
  height: 100%;
  width: 50% !important;
}

.CodeMirror-merge-gap {
  width: 0% !important;
}
</style>
