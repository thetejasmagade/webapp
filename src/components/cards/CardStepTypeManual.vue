<template>
  <div class="overflow-y-auto w-full flex flex-col items-center">
    <div class="max-w-4xl">
      <div class="mt-4 w-full flex flex-row justify-end">
        <BlockButton
          v-if="$store.getters.getIsLoggedIn"
          class="btn mr-3"
          :click="doneWithStep"
        >
          I'm done with this step
        </BlockButton>

        <BlockButton :click="linkClick" color="gray">
          <FontAwesomeIcon icon="eye" />
          Cheat
        </BlockButton>
      </div>
      <div>
        <MarkdownViewer ref="viewer" :source="markdownSource" />
        <HintButton
          v-if="!isHintPurchased && isHintAvailable"
          class="mr-3"
          :hint-cost="hintCost"
          :hint-callback="hintCallback"
          :is-hint-available="isHintAvailable"
        />
        <MarkdownViewer
          v-if="isHintAvailable"
          ref="viewer"
          :source="hintMarkdownSource"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import BlockButton from "@/components/BlockButton.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: {
    MarkdownViewer,
    BlockButton,
    FontAwesomeIcon,
  },
  props: {
    markdownSource: {
      type: String,
      required: true,
    },
    projectSlug: {
      type: String,
      required: true,
    },
    stepSlug: {
      type: String,
      required: true,
    },
    hintCallback: {
      type: Function,
      required: false,
      default: null,
    },
    doneWithStep: {
      type: Function,
      required: true,
    },
    hintMarkdownSource: {
      type: String,
      required: false,
      default: "",
    },
    hintCost: {
      type: Number,
      required: false,
      default: null,
    },
    isHintPurchased: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    isHintAvailable() {
      if (this.hintMarkdownSource === "") {
        return false;
      }
      return true;
    },
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
    },
    linkClick() {
      window.open(
        `https://github.com/qvault/projects/tree/main/projects/${this.projectSlug}/${this.stepSlug}/src`,
        "_blank"
      );
    },
  },
};
</script>

<style scoped></style>
