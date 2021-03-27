<template>
  <div>
    <div class="markdown-viewer-container">
      <VueMarkdown
        class="viewer"
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
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-haskell.js'; // required for purescript
import 'prismjs/components/prism-purescript.js';
import 'prismjs/components/prism-python.js';

// should match any other prism components that share a page
import 'prismjs/themes/prism-coy.css';

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
@import '@/styles/consts.scss';

.markdown-viewer-container {
  min-height: 100%;

  .viewer{
    padding: 1em;
    overflow: auto;
    min-height: 100%;
    background-color: inherit;

    @media (max-width: $mobile-size) {
      padding: .5em;
    }

    pre {
      code {
        color: inherit;
      }
    }

    code {
      color: $pink-dark;
      font-size: 1.2em;
    }

    img {
      max-width: 100%;
      border-radius: 2px;
    }
  }
}

</style>
