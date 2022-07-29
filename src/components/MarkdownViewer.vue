<template>
  <div>
    <div class="min-h-full">
      <div ref="viewer" class="viewer md:p-4 p-2 overflow-auto min-h-full" />
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import MarkdownItEmoji from "markdown-it-emoji";
import MarkdownItSubscript from "markdown-it-sub";
import MarkdownItSuperscript from "markdown-it-sup";
import MarkdownItLinkAttributes from "markdown-it-link-attributes";
import Prism from "prismjs";

import "@/styles/prism-darcula.css";

import "prismjs/components/prism-go.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-haskell.js"; // required for purescript
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-purescript.js";
import "prismjs/components/prism-python.js";

export default {
  props: {
    source: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    const md = new MarkdownIt("default", {
      breaks: true,
    });
    md.use(MarkdownItEmoji);
    md.use(MarkdownItSubscript);
    md.use(MarkdownItSuperscript);
    md.use(MarkdownItLinkAttributes, {
      attrs: {
        target: "_blank",
        rel: "noopener nofollow",
      },
    });
    return {
      md,
    };
  },
  watch: {
    source: {
      immediate: true,
      handler(newSource) {
        this.$nextTick(() => {
          this.$refs.viewer.innerHTML = this.md.render(newSource);
          Prism.highlightAll();
        });
      },
    },
  },
};
</script>

<style>
.viewer {
  background-color: inherit;
}

.viewer h1 {
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--blue-400);
}

.viewer h2 {
  font-weight: 600;
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: var(--blue-400);
}

.viewer h3 {
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--blue-400);
}

.viewer h4 {
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--blue-400);
}

.viewer p {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.viewer pre {
  border-radius: 4px;
  overflow-x: auto;
  background-color: var(--gray-700);
  padding: 1em;
}

.viewer pre code {
  color: inherit;
  background-color: inherit;
  overflow-x: auto;
  padding: 0;
}

.viewer ul {
  list-style-type: disc;
  margin-left: 1rem;
  margin-bottom: 1rem;
}

.viewer ol {
  list-style-type: decimal;
  margin-left: 1rem;
  margin-bottom: 1rem;
}

.viewer code {
  background: var(--gray-700);
  padding: 3px 6px 3px 6px;
  border-radius: 4px;
}

.viewer a {
  color: var(--blue-400);
  text-decoration: underline;
}

.viewer a:hover {
  color: var(--blue-300);
}

.viewer img {
  max-width: 100%;
  border-radius: 5px;
  margin: auto;
}
</style>
