<template>
  <div>
    <div class="markdown-viewer-container">
      <div
        ref="viewer"
        class="viewer"
      />
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import MarkdownItEmoji from 'markdown-it-emoji';
import MarkdownItSubscript from 'markdown-it-sub';
import MarkdownItSuperscript from 'markdown-it-sup';
import MarkdownItLinkAttributes from 'markdown-it-link-attributes';
import Prism from 'prismjs';

import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-haskell.js'; // required for purescript
import 'prismjs/components/prism-purescript.js';
import 'prismjs/components/prism-python.js';

// should match any other prism components that share a page
import 'prismjs/themes/prism-coy.css';

export default {
  props: { 
    source:{
      type: String,
      required: false,
      default: ''
    }
  },
  data(){
    const md = new MarkdownIt('default', {
      breaks: true
    });
    md.use(MarkdownItEmoji);
    md.use(MarkdownItSubscript);
    md.use(MarkdownItSuperscript);
    md.use(MarkdownItLinkAttributes, {
      attrs: {
        target: '_blank',
        rel: 'noopener nofollow'
      }
    });
    return {
      md
    };
  },
  watch: {
    source: {
      immediate: true,
      handler(newSource) {
        this.$nextTick(() => {
          this.$refs.viewer.innerHTML = this.md.render(
            newSource
          );
          Prism.highlightAll();
        });
      }
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

    h1 {
      font-weight: 600;
    }

    h2 {
      font-weight: 400;
    }

    p {
      font-size: 1.1rem;
      line-height: 1.5;
    }

    pre {
      code {
        color: inherit;
        background-color: inherit;
        font-size: 1em;
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
