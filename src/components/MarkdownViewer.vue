<template>
  <div>
    <div id="markdown-viewer-container">
      <VueMarkdown
        id="viewer"
        :source="source"
        :breaks="false"
        :anchor-attributes="{target: '_blank'}"
        @rendered="update"
      />
    </div>
  </div>
</template>

<script>
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-haskell.min'; // required for purescript
import 'prismjs/components/prism-purescript.min';

import VueMarkdown from 'vue-markdown';

export default {
  components: {
    VueMarkdown
  },
  props: { 
    source:{
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    update() {
      this.$nextTick(() => {
        Prism.highlightAll();
      });
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/colors.scss';

#markdown-viewer-container {
  min-height: 100%;
  background-color: $white;

  #viewer{
    padding: 20px;
    overflow: auto;
    min-height: 100%;
    background-color: inherit;

    pre {
      code {
        color: inherit;
      }
    }

    code {
      color: $pink-dark;
    }
  }
}

</style>
