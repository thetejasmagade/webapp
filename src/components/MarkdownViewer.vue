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
@import '@/styles/prism-darcula.css';

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
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    h2 {
      font-weight: 600;
      font-size: 1.6rem;
      margin-bottom: 1rem;
    }

    h3 {
      font-weight: 600;
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }

    h4 {
      font-weight: 600;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.1rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    pre {
      code {
        color: inherit;
        background-color: inherit;
      }
    }

    ul {
      @apply list-disc;
      margin-left: 1rem;
    }

    ol {
      @apply list-decimal;
      margin-left: 1rem;
    }

    code {
      color: $pink-dark;
    }

    img {
      max-width: 100%;
      border-radius: 2px;
    }
  }
}

</style>
